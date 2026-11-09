const nodemailer = require('nodemailer');
const db = require('./db');

class EmailEngine {
  constructor() {
    this.timer = null;
    this.isProcessing = false;
    this.defaultIntervalSec = 720; // 12 minutes per email (Strict 5 emails/hour)
    this.defaultBatchTarget = 5;   // 5 emails per 1-hour window
    this.defaultCoolingSec = 3600; // 1 hour cooling pause

    // Initialize campaign schedule defaults in database
    this.initScheduleState();
  }

  initScheduleState() {
    const state = db.get();
    if (!state.campaign) {
      state.campaign = {};
    }
    const c = state.campaign;
    c.batch_target = 5;
    c.interval_seconds = 720; // 12 mins per send = 5/hour
    c.cooling_seconds = 3600;
    if (c.current_batch_sent === undefined) c.current_batch_sent = 0;
    if (c.phase === undefined) c.phase = 'sending';
    if (c.test_mode === undefined) c.test_mode = true;
    if (c.batch_cycle === undefined) c.batch_cycle = 1;
    if (c.total_sent_today === undefined) c.total_sent_today = 0;
    if (c.consecutive_smtp_errors === undefined) c.consecutive_smtp_errors = 0;
    c.cadence_desc = 'Ultra-Safe Elite Cadence: 5 emails/hour (1 every 12 mins)';
    db.save();
  }

  getTransporter() {
    const s = db.get().settings;
    return nodemailer.createTransport({
      host: s.smtp_host || 'smtp.hostinger.com',
      port: parseInt(s.smtp_port || 465),
      secure: parseInt(s.smtp_port) === 465,
      auth: {
        user: s.smtp_user,
        pass: s.smtp_pass,
      },
      connectionTimeout: 10000, // 10s connection timeout
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }

  isWeekend() {
    const day = new Date().getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  }

  wrapEmailContent(lead, rawTemplate, rawSubject) {
    const s = db.get().settings;
    const appUrl = (s.app_url || 'http://localhost:3000').replace(/\/$/, '');

    // Replace dynamic tags
    let subject = (rawSubject || '')
      .replace(/{{name}}/gi, lead.name || 'Editorial Team')
      .replace(/{{website}}/gi, lead.website || 'your site')
      .replace(/{{niche}}/gi, lead.niche || 'Digital Marketing & SEO')
      .replace(/Amritpal/gi, 'DailyAura Editorial Team'); // Ensure Amritpal is never sent

    let processed = (rawTemplate || '')
      .replace(/{{name}}/gi, lead.name || 'Editorial Team')
      .replace(/{{website}}/gi, lead.website || 'your site')
      .replace(/{{niche}}/gi, lead.niche || 'Digital Marketing & SEO')
      .replace(/Amritpal/gi, 'DailyAura Editorial Team');

    const isHtml = processed.includes('<table') || processed.includes('<div') || processed.includes('<!DOCTYPE') || processed.includes('<html');

    let textBody = isHtml ? processed.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim() : processed;
    let htmlBody = isHtml ? processed : processed
      .split('\n\n')
      .map(p => `<p style="margin: 0 0 14px 0; line-height: 1.6; font-size: 15px; color: #222;">${p.replace(/\n/g, '<br>')}</p>`)
      .join('');

    // Rewrite links for Click Tracking if enabled
    if (s.track_clicks) {
      if (isHtml) {
        htmlBody = htmlBody.replace(/href=["'](https?:\/\/[^"']+)["']/gi, (match, url) => {
          if (url.includes('/track/')) return match;
          const trackedUrl = `${appUrl}/track/click/${lead.id}?to=${encodeURIComponent(url)}`;
          return `href="${trackedUrl}"`;
        });
      } else {
        const linkRegex = /(https?:\/\/[^\s<>"']+)/g;
        htmlBody = htmlBody.replace(linkRegex, (url) => {
          const trackedUrl = `${appUrl}/track/click/${lead.id}?to=${encodeURIComponent(url)}`;
          return `<a href="${trackedUrl}" style="color: #2563eb; text-decoration: underline;">${url}</a>`;
        });
      }
    }

    // Append 1x1 Transparent Open Tracking Pixel if enabled
    if (s.track_opens) {
      const pixel = `<img src="${appUrl}/track/open/${lead.id}.png" width="1" height="1" style="display:none !important; border:0; outline:none;" alt="" />`;
      if (htmlBody.includes('</body>')) {
        htmlBody = htmlBody.replace('</body>', `${pixel}</body>`);
      } else {
        htmlBody += pixel;
      }
    }

    return { subject, text: textBody, html: htmlBody };
  }

  async sendOne(lead) {
    const state = db.get();
    const s = state.settings;
    const camp = state.campaign;

    // Check suppression list
    const isBlacklisted = (state.blacklist || []).some(b => b.email && b.email.toLowerCase() === lead.email.toLowerCase());
    if (isBlacklisted) {
      console.log(`[CRM Engine] Skipping blacklisted email: ${lead.email}`);
      db.updateLead(lead.id, { status: 'suppressed', last_error: 'Blacklisted address' });
      return null;
    }

    const transporter = this.getTransporter();
    const { subject, text, html } = this.wrapEmailContent(lead, camp.template, camp.subject);

    const senderDisplayName = s.from_name || 'DailyAura Editorial Team';
    const mailOptions = {
      from: `"${senderDisplayName}" <${s.from_email || s.smtp_user}>`,
      to: lead.email,
      subject,
      text,
      html,
    };

    console.log(`[CRM Engine] Dispatching outreach to ${lead.email} (${lead.website})...`);
    const info = await transporter.sendMail(mailOptions);

    db.updateLead(lead.id, {
      status: 'sent',
      sent_at: new Date().toISOString(),
      last_error: null,
      message_id: info.messageId,
    });

    db.addEvent({
      type: 'sent',
      lead_id: lead.id,
      email: lead.email,
      website: lead.website,
      message_id: info.messageId,
    });

    console.log(`[CRM Engine] Successfully sent to ${lead.email} (Message ID: ${info.messageId})`);
    return info;
  }

  async processQueue() {
    const state = db.get();
    const camp = state.campaign;

    if (camp.status !== 'running' || this.isProcessing) {
      return;
    }

    // Check weekday schedule rule unless test_mode is enabled
    if (this.isWeekend() && !camp.test_mode) {
      console.log('[CRM Engine] Weekend outreach hold active (Mon-Fri only). Standing by...');
      camp.phase = 'weekend_hold';
      db.save();
      return;
    }

    // Check if in cooling break
    if (camp.phase === 'cooling') {
      const now = Date.now();
      const coolingEnds = camp.cooling_ends_at ? new Date(camp.cooling_ends_at).getTime() : 0;
      if (now < coolingEnds) {
        const remainingMs = coolingEnds - now;
        console.log(`[CRM Engine] In 1-Hour Cooling Break. ${Math.round(remainingMs / 60000)} minutes remaining.`);
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.processQueue();
        }, Math.min(remainingMs, 30000));
        return;
      } else {
        // Cooling break finished! Transition back to sending phase
        console.log('[CRM Engine] 1-Hour Cooling Break completed! Starting next 60-email batch.');
        camp.phase = 'sending';
        camp.current_batch_sent = 0;
        camp.batch_cycle = (camp.batch_cycle || 1) + 1;
        camp.cooling_ends_at = null;
        db.save();
      }
    }

    // Check if current 60-email batch is complete
    const batchTarget = camp.batch_target || 60;
    if ((camp.current_batch_sent || 0) >= batchTarget) {
      console.log(`[CRM Engine] Batch target of ${batchTarget} emails reached (2-hour active window complete).`);
      camp.phase = 'cooling';
      const coolingMs = (camp.cooling_seconds || 3600) * 1000;
      camp.cooling_ends_at = new Date(Date.now() + coolingMs).toISOString();
      db.save();

      console.log(`[CRM Engine] Entering 1-Hour Cooling Period. Next batch resumes at: ${camp.cooling_ends_at}`);
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.processQueue();
      }, coolingMs);
      return;
    }

    this.isProcessing = true;

    try {
      // Find candidate leads: "send only to them who looks good"
      // Filter for valid email, reputable domain, and rank by highest DA authority first
      let candidates = (state.leads || []).filter(l => 
        l.status === 'pending' &&
        l.email &&
        l.email.includes('@') &&
        !l.email.endsWith('.test') &&
        (l.da_score || 0) >= 40
      );

      if (camp.selected_niche && camp.selected_niche !== 'All Niches') {
        const nicheFiltered = candidates.filter(l => l.niche === camp.selected_niche);
        if (nicheFiltered.length > 0) candidates = nicheFiltered;
      }

      // Sort by highest DA authority first so premier agencies receive outreach first
      candidates.sort((a, b) => (b.da_score || 0) - (a.da_score || 0));

      let pendingLead = candidates[0] || null;

      // Fallback to any pending lead if no DA >= 40 is available
      if (!pendingLead) {
        pendingLead = state.leads.find(l => l.status === 'pending' && l.email && l.email.includes('@'));
      }

      // If no pending lead found, try to auto-mine immediately
      if (!pendingLead) {
        try {
          const leadFinder = require('./leadFinderEngine');
          console.log('[CRM Engine] Pending high-DA leads queue low. Requesting LeadFinderEngine to mine 10 verified prospects...');
          leadFinder.mineBatch(10);
          const freshState = db.get();
          pendingLead = freshState.leads.find(l => l.status === 'pending');
        } catch (e) {
          console.warn('[CRM Engine] Auto-mine error:', e.message);
        }
      }

      if (!pendingLead) {
        console.log('[CRM Engine] All leads have been processed. Standing by for new discovered prospects...');
        this.isProcessing = false;
        // Check again in 30 seconds
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => this.processQueue(), 30000);
        return;
      }

      // Send the email
      let sendSuccess = false;
      try {
        await this.sendOne(pendingLead);
        sendSuccess = true;
        // Reset consecutive error count on successful send
        const campRef = db.get().campaign;
        campRef.consecutive_smtp_errors = 0;
        campRef.smtp_diagnostic = null;
      } catch (sendErr) {
        console.error(`[CRM Engine] Send error for ${pendingLead.email}:`, sendErr.message);

        const isTimeoutOrBlock = 
          sendErr.message.includes('timeout') ||
          sendErr.message.includes('ETIMEDOUT') ||
          sendErr.message.includes('ECONNREFUSED') ||
          sendErr.message.includes('ECONNRESET') ||
          sendErr.message.includes('Greeting never received');

        const campRef = db.get().campaign;

        if (isTimeoutOrBlock) {
          // Do NOT mark good leads as failed! Preserve them in pending pool.
          campRef.consecutive_smtp_errors = (campRef.consecutive_smtp_errors || 0) + 1;
          console.warn(`[CRM Circuit Breaker] Outbound connection timeout (${campRef.consecutive_smtp_errors}/2). Preserving lead ${pendingLead.email} in pending state.`);

          if (campRef.consecutive_smtp_errors >= 2) {
            // Auto-pause campaign to prevent infinite hanging or false failures
            campRef.status = 'paused';
            campRef.phase = 'smtp_blocked';
            campRef.smtp_diagnostic = 'SMTP connection timed out. If running on Render Free tier, outbound SMTP port 465 is blocked by Render firewall. Upgrading Render service to Starter ($7/mo) unlocks SMTP, or run CRM locally.';
            db.save();

            db.addEvent({
              type: 'error',
              lead_id: pendingLead.id,
              email: pendingLead.email,
              message: 'SMTP Port 465 blocked by host firewall. Auto-pausing campaign to protect lead pool.'
            });

            this.isProcessing = false;
            console.warn('[CRM Circuit Breaker] Outreach auto-paused due to host SMTP port blocking.');
            return;
          }
        } else {
          // Address-specific mailbox failure (e.g., 550 User Not Found)
          db.updateLead(pendingLead.id, {
            status: 'failed',
            last_error: sendErr.message
          });
          db.addEvent({
            type: 'error',
            lead_id: pendingLead.id,
            email: pendingLead.email,
            message: sendErr.message
          });
        }
      }

      // Update counters
      const updatedCamp = db.get().campaign;
      if (sendSuccess) {
        updatedCamp.current_batch_sent = (updatedCamp.current_batch_sent || 0) + 1;
        updatedCamp.total_sent_today = (updatedCamp.total_sent_today || 0) + 1;
        updatedCamp.last_sent_at = new Date().toISOString();
      }

      // Check if we reached batch target immediately after this send
      if (updatedCamp.current_batch_sent >= batchTarget) {
        updatedCamp.phase = 'cooling';
        const coolingMs = (updatedCamp.cooling_seconds || 3600) * 1000;
        updatedCamp.cooling_ends_at = new Date(Date.now() + coolingMs).toISOString();
        updatedCamp.next_send_at = null;
        db.save();
        this.isProcessing = false;

        console.log(`[CRM Engine] Hourly batch of ${batchTarget} emails completed! 1-Hour Cooling break initiated.`);
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => this.processQueue(), coolingMs);
        return;
      }

      // Enforce the 12-Minute (720 seconds) Pacing (Strict 5 emails/hour)
      const intervalSec = updatedCamp.interval_seconds || 720;
      const nextDelayMs = intervalSec * 1000;
      updatedCamp.next_send_at = new Date(Date.now() + nextDelayMs).toISOString();
      db.save();

      console.log(`[CRM Engine] Batch Progress: ${updatedCamp.current_batch_sent}/${batchTarget} emails sent. Next dispatch scheduled in ${intervalSec}s (${Math.round(intervalSec / 60)} minutes)...`);

      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.isProcessing = false;
        this.processQueue();
      }, nextDelayMs);

    } catch (fatalErr) {
      console.error('[CRM Engine] Fatal queue processing error:', fatalErr.message);
      this.isProcessing = false;
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => this.processQueue(), 30000);
    }
  }

  start() {
    const state = db.get();
    state.campaign.status = 'running';
    if (!state.campaign.phase || state.campaign.phase === 'idle') {
      state.campaign.phase = 'sending';
    }
    state.campaign.test_mode = true; // Ensure today's live test run is enabled
    db.save();

    console.log('[CRM Engine] Outreach campaign STARTED. Elite Cadence: 5 Emails/hour (1 every 12 mins) + 1-Hour Break active.');
    this.isProcessing = false;
    this.processQueue();
  }

  pause() {
    const state = db.get();
    state.campaign.status = 'paused';
    db.save();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.isProcessing = false;
    console.log('[CRM Engine] Outreach campaign PAUSED.');
  }

  stop() {
    const state = db.get();
    state.campaign.status = 'idle';
    state.campaign.phase = 'idle';
    state.campaign.current_batch_sent = 0;
    state.campaign.next_send_at = null;
    state.campaign.cooling_ends_at = null;
    db.save();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.isProcessing = false;
    console.log('[CRM Engine] Outreach campaign STOPPED.');
  }

  getStatus() {
    const state = db.get();
    const camp = state.campaign || {};
    const leads = state.leads || [];
    const pendingCount = leads.filter(l => l.status === 'pending').length;
    const sentCount = leads.filter(l => l.status === 'sent').length;
    const failedCount = leads.filter(l => l.status === 'failed').length;

    let nextSendSecRemaining = 0;
    if (camp.next_send_at && camp.status === 'running') {
      nextSendSecRemaining = Math.max(0, Math.floor((new Date(camp.next_send_at).getTime() - Date.now()) / 1000));
    }

    let coolingSecRemaining = 0;
    if (camp.cooling_ends_at && camp.phase === 'cooling') {
      coolingSecRemaining = Math.max(0, Math.floor((new Date(camp.cooling_ends_at).getTime() - Date.now()) / 1000));
    }

    return {
      status: camp.status || 'idle',
      phase: camp.phase || 'sending',
      batch_target: camp.batch_target || 5,
      current_batch_sent: camp.current_batch_sent || 0,
      batch_cycle: camp.batch_cycle || 1,
      interval_seconds: camp.interval_seconds || 720,
      cooling_seconds: camp.cooling_seconds || 3600,
      total_sent_today: camp.total_sent_today || 0,
      test_mode: camp.test_mode !== undefined ? camp.test_mode : true,
      next_send_at: camp.next_send_at,
      cooling_ends_at: camp.cooling_ends_at,
      next_send_seconds: nextSendSecRemaining,
      cooling_seconds_remaining: coolingSecRemaining,
      last_sent_at: camp.last_sent_at,
      smtp_diagnostic: camp.smtp_diagnostic || null,
      consecutive_smtp_errors: camp.consecutive_smtp_errors || 0,
      cadence_desc: camp.cadence_desc || '5 emails/hour (1 every 12 mins)',
      pendingCount,
      sentCount,
      failedCount,
      totalLeads: leads.length
    };
  }
      last_sent_at: camp.last_sent_at,
      pendingCount,
      sentCount,
      totalLeads: leads.length
    };
  }
}

module.exports = new EmailEngine();
