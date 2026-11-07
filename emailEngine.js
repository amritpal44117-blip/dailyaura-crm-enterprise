const nodemailer = require('nodemailer');
const db = require('./db');

class EmailEngine {
  constructor() {
    this.timer = null;
    this.isProcessing = false;
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
    });
  }

  getRandomDelay(minSec, maxSec) {
    // Enforce minimum 120 seconds (2 minutes) if not configured
    const min = (minSec && minSec >= 120 ? minSec : 120) * 1000;
    const max = (maxSec && maxSec >= minSec ? maxSec : minSec + 60) * 1000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    const isBlacklisted = (state.blacklist || []).some(b => b.email.toLowerCase() === lead.email.toLowerCase());
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

    console.log(`[CRM Engine] Sending email to ${lead.email} (${lead.website})...`);
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

    console.log(`[CRM Engine] Successfully sent to ${lead.email} (ID: ${info.messageId})`);
    return info;
  }

  async processQueue() {
    const state = db.get();
    if (state.campaign.status !== 'running' || this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      // Find next pending lead, optionally filtered by selected niche
      let pendingLead = null;
      if (state.campaign.selected_niche && state.campaign.selected_niche !== 'All Niches') {
        pendingLead = state.leads.find(l => l.status === 'pending' && l.niche === state.campaign.selected_niche);
      }
      if (!pendingLead) {
        pendingLead = state.leads.find(l => l.status === 'pending');
      }

      if (!pendingLead) {
        console.log('[CRM Engine] All leads have been processed! Campaign completed.');
        state.campaign.status = 'completed';
        db.save();
        this.isProcessing = false;
        return;
      }

      await this.sendOne(pendingLead);

      // Check remaining pending leads
      const remaining = db.get().leads.filter(l => l.status === 'pending').length;
      if (remaining > 0 && db.get().campaign.status === 'running') {
        // Enforce the 2-minute minimum gap (120-180 seconds)
        const delay = this.getRandomDelay(state.campaign.delay_min, state.campaign.delay_max);
        console.log(`[CRM Engine] Throttling: Waiting ${(delay / 1000).toFixed(1)}s (approx. ${Math.round(delay/60000)} min) before next send to protect domain reputation... (${remaining} remaining)`);
        this.timer = setTimeout(() => {
          this.isProcessing = false;
          this.processQueue();
        }, delay);
      } else {
        if (remaining === 0) {
          db.get().campaign.status = 'completed';
          db.save();
        }
        this.isProcessing = false;
      }
    } catch (err) {
      console.error('[CRM Engine] Send error:', err.message);
      this.isProcessing = false;
      db.get().campaign.status = 'paused';
      db.save();
    }
  }

  start() {
    db.get().campaign.status = 'running';
    db.save();
    this.processQueue();
  }

  pause() {
    db.get().campaign.status = 'paused';
    db.save();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.isProcessing = false;
  }

  stop() {
    db.get().campaign.status = 'idle';
    db.save();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.isProcessing = false;
  }
}

module.exports = new EmailEngine();
