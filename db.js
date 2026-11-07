const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'crm_data.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 8 Core Niches aligned with DailyAura (https://guestposts.dailyaura.in)
const NICHES = [
  "Artificial Intelligence & Machine Learning",
  "Digital Marketing & SEO Link Building",
  "Technology & Software Development",
  "SaaS, Cloud Computing & DevOps",
  "Business, Startups & Entrepreneurship",
  "Finance, Fintech & Web3",
  "Health, Fitness & Wellness",
  "E-Commerce, Web Design & UI/UX"
];

// Pre-loaded 10 Production-Ready Templates (Outreach, Contributor Lifecycle, HTML Digest)
const defaultTemplates = [
  {
    id: "tmpl_day2_showcase",
    name: "Day 2–4 Trending Posts Showcase (Featured Images & CTA)",
    category: "digest",
    stage: "Day 2–4 Showcase",
    track: "contributor_lifecycle",
    format: "html",
    subject: "Trending on DailyAura: 5 Must-Read Guides + Contributor Feature Openings",
    body_text: `Trending on DailyAura: 5 Must-Read Guides\n\n1. Dedicated Server Hosting: Complete Guide for Growing Businesses (Cloud Computing)\nhttps://guestposts.dailyaura.in/dedicated-server-hosting-complete-guide-for-growing-businesses/\n\n2. Top 5 Cheap Dedicated Server Providers in India (Technology)\nhttps://guestposts.dailyaura.in/top-5-cheap-dedicated-server-providers-in-india/\n\n3. AI Fluency & Executive Skill Building: Education & Career Strategies in 2026 (Education & AI)\nhttps://guestposts.dailyaura.in/ai-fluency-and-executive-skill-building-education-career-strategies-in-2026/\n\n4. Biophilic Design and Acoustic Comfort in Modern Home Improvement (Home Improvement)\nhttps://guestposts.dailyaura.in/biophilic-design-and-acoustic-comfort-in-modern-home-improvement/\n\n5. Doctor-Backed Longevity Protocols: Biomarkers and Preventative Health (Health & Fitness)\nhttps://guestposts.dailyaura.in/doctor-backed-longevity-protocols-biomarkers-and-preventative-health/\n\nInspired to publish your own article? Submit your free guest post with permanent do-follow backlinks:\nhttps://guestposts.dailyaura.in/submit-guest-post/\n\nBest regards,\nEditorial & SEO Outreach Team\nDailyAura Publishing`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; background: #080d1a; color: #f8fafc; border-radius: 14px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
  <div style="background: radial-gradient(circle at top right, #2563eb, #0f172a); padding: 32px 24px; text-align: center; border-bottom: 1px solid #1e293b;">
    <h1 style="margin: 0 0 6px 0; font-size: 22px; color: #ffffff; font-weight: 800;">Trending on DailyAura: 5 Must-Read Guides</h1>
    <p style="margin: 0; font-size: 13px; color: #94a3b8;">Latest high-authority editorial publications & contributor openings</p>
  </div>
  <div style="padding: 24px;">
    <p style="font-size: 15px; margin: 0 0 16px 0; color: #cbd5e1;">Hi <strong>{{name}}</strong>,</p>
    <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 0 0 20px 0;">
      Here are the 5 top-performing articles published on DailyAura this week across Cloud, AI, and Lifestyle:
    </p>
    <div style="background: #131c2e; border: 1px solid #24324d; border-radius: 10px; margin-bottom: 18px; overflow: hidden;">
      <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80" alt="Server Hosting" style="width: 100%; height: 160px; object-fit: cover;" />
      <div style="padding: 16px;">
        <span style="background: rgba(6,182,212,0.15); color: #06b6d4; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Cloud Computing</span>
        <h3 style="margin: 8px 0 6px 0; font-size: 16px;"><a href="https://guestposts.dailyaura.in/dedicated-server-hosting-complete-guide-for-growing-businesses/" style="color: #ffffff; text-decoration: none;">Dedicated Server Hosting: Complete Guide for Growing Businesses</a></h3>
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">Essential guide on choosing reliable dedicated server hardware and bandwidth to expand your business securely.</p>
        <a href="https://guestposts.dailyaura.in/dedicated-server-hosting-complete-guide-for-growing-businesses/" style="font-size: 12px; font-weight: 700; color: #3b82f6; text-decoration: none;">Read Full Guide &rarr;</a>
      </div>
    </div>
    <div style="background: #131c2e; border: 1px solid #24324d; border-radius: 10px; margin-bottom: 18px; overflow: hidden;">
      <img src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80" alt="Dedicated Server India" style="width: 100%; height: 160px; object-fit: cover;" />
      <div style="padding: 16px;">
        <span style="background: rgba(59,130,246,0.15); color: #60a5fa; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Technology</span>
        <h3 style="margin: 8px 0 6px 0; font-size: 16px;"><a href="https://guestposts.dailyaura.in/top-5-cheap-dedicated-server-providers-in-india/" style="color: #ffffff; text-decoration: none;">Top 5 Cheap Dedicated Server Providers in India</a></h3>
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">Startups and enterprises look for cheap dedicated servers. An executive analysis of the top 5 platforms.</p>
        <a href="https://guestposts.dailyaura.in/top-5-cheap-dedicated-server-providers-in-india/" style="font-size: 12px; font-weight: 700; color: #3b82f6; text-decoration: none;">Read Full Guide &rarr;</a>
      </div>
    </div>
    <div style="background: #131c2e; border: 1px solid #24324d; border-radius: 10px; margin-bottom: 18px; overflow: hidden;">
      <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80" alt="AI Education" style="width: 100%; height: 160px; object-fit: cover;" />
      <div style="padding: 16px;">
        <span style="background: rgba(139,92,246,0.15); color: #a78bfa; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Education & AI</span>
        <h3 style="margin: 8px 0 6px 0; font-size: 16px;"><a href="https://guestposts.dailyaura.in/ai-fluency-and-executive-skill-building-education-career-strategies-in-2026/" style="color: #ffffff; text-decoration: none;">AI Fluency and Executive Skill Building: Education & Career Strategies in 2026</a></h3>
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">The global career landscape is experiencing rapid evolution. How executives build enduring AI workflows.</p>
        <a href="https://guestposts.dailyaura.in/ai-fluency-and-executive-skill-building-education-career-strategies-in-2026/" style="font-size: 12px; font-weight: 700; color: #3b82f6; text-decoration: none;">Read Full Guide &rarr;</a>
      </div>
    </div>
    <div style="background: #131c2e; border: 1px solid #24324d; border-radius: 10px; margin-bottom: 18px; overflow: hidden;">
      <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80" alt="Home Improvement" style="width: 100%; height: 160px; object-fit: cover;" />
      <div style="padding: 16px;">
        <span style="background: rgba(16,185,129,0.15); color: #34d399; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Home Improvement</span>
        <h3 style="margin: 8px 0 6px 0; font-size: 16px;"><a href="https://guestposts.dailyaura.in/biophilic-design-and-acoustic-comfort-in-modern-home-improvement/" style="color: #ffffff; text-decoration: none;">Biophilic Design and Acoustic Comfort in Modern Renovation</a></h3>
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">Integrating acoustic architecture, sound-dampening engineering, and biophilic natural design in modern living spaces.</p>
        <a href="https://guestposts.dailyaura.in/biophilic-design-and-acoustic-comfort-in-modern-home-improvement/" style="font-size: 12px; font-weight: 700; color: #3b82f6; text-decoration: none;">Read Full Guide &rarr;</a>
      </div>
    </div>
    <div style="background: #131c2e; border: 1px solid #24324d; border-radius: 10px; margin-bottom: 24px; overflow: hidden;">
      <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&auto=format&fit=crop&q=80" alt="Longevity Health" style="width: 100%; height: 160px; object-fit: cover;" />
      <div style="padding: 16px;">
        <span style="background: rgba(244,63,94,0.15); color: #fb7185; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Health & Longevity</span>
        <h3 style="margin: 8px 0 6px 0; font-size: 16px;"><a href="https://guestposts.dailyaura.in/doctor-backed-longevity-protocols-biomarkers-and-preventative-health/" style="color: #ffffff; text-decoration: none;">Doctor-Backed Longevity Protocols: Biomarkers & Preventative Health</a></h3>
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">Preventative clinical medicine shifts from reactive illness care toward proactive biomarker surveillance.</p>
        <a href="https://guestposts.dailyaura.in/doctor-backed-longevity-protocols-biomarkers-and-preventative-health/" style="font-size: 12px; font-weight: 700; color: #3b82f6; text-decoration: none;">Read Full Guide &rarr;</a>
      </div>
    </div>
    <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); border-radius: 10px; padding: 24px; text-align: center;">
      <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #ffffff;">Inspired to Publish Your Own Guide?</h3>
      <p style="margin: 0 0 16px 0; font-size: 13px; color: #e2e8f0; line-height: 1.5;">
        You can also publish authoritative guest posts on DailyAura. Enjoy 100% free submission, permanent contextual do-follow backlinks, and fast 24–48h Google indexing.
      </p>
      <a href="https://guestposts.dailyaura.in/submit-guest-post/" style="display: inline-block; background: #ffffff; color: #1e3a8a; padding: 11px 28px; font-size: 13px; font-weight: 800; text-decoration: none; border-radius: 6px;">
        Submit Your Guest Post &rarr;
      </a>
    </div>
  </div>
  <div style="background: #050811; padding: 18px; text-align: center; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b;">
    DailyAura Publishing &bull; outreach@dailyaura.in &bull; https://guestposts.dailyaura.in
  </div>
</div>`
  },
,
  {
    id: "tmpl_outreach_1",
    name: "Value-First Guest Post Collaboration (Do-Follow)",
    category: "outreach",
    stage: "Cold Initial (Day 0)",
    track: "cold_outreach",
    format: "text",
    subject: "Free Guest Post & Do-Follow Backlink Collaboration ({{website}})",
    body_text: `Hi {{name}},

I noticed you manage off-page SEO, guest posting, and content outreach for {{website}}.

I manage the publishing platform over at DailyAura (https://guestposts.dailyaura.in). We are currently offering free guest post placements with permanent do-follow backlinks in {{niche}}.

What we offer for link builders and SEO specialists:
- 100% Free Guest Post submission (no hidden fees)
- Permanent do-follow contextual backlinks
- Fast editorial approval & indexing within 24-48 hours
- Open to mutual link exchanges (https://guestposts.dailyaura.in/link-exchange/)

You can review our editorial guidelines and submit articles directly here:
https://guestposts.dailyaura.in/submit-guest-post/

Or feel free to reply directly to this email with your article drafts or topics, and our team will review them for you right away.

Best regards,

Editorial & SEO Outreach Team
DailyAura Publishing
outreach@dailyaura.in | https://guestposts.dailyaura.in`,
    body_html: ""
  },
  {
    id: "tmpl_outreach_2",
    name: "Mutual Link Exchange & Authority Swap",
    category: "outreach",
    stage: "Cold Initial (Day 0)",
    track: "cold_outreach",
    format: "text",
    subject: "Content Collaboration & Mutual Backlink Exchange with {{website}}",
    body_text: `Hi {{name}},

I was reviewing {{website}} and really enjoyed your in-depth coverage in the {{niche}} domain.

We manage an authoritative open publishing platform at DailyAura (https://guestposts.dailyaura.in) covering Technology, SEO, AI, and Business. We are currently actively partnering with relevant websites for mutual link exchanges and guest collaborations:
https://guestposts.dailyaura.in/link-exchange/

Would you or your SEO team be open to an editorial collaboration or mutual feature between our sites?

Best regards,

Editorial & SEO Outreach Team
DailyAura Publishing
outreach@dailyaura.in | https://guestposts.dailyaura.in`,
    body_html: ""
  },
  {
    id: "tmpl_outreach_3",
    name: "AI & Tech Authority Contributor Slot",
    category: "outreach",
    stage: "Cold Initial (Day 0)",
    track: "cold_outreach",
    format: "text",
    subject: "Free Tech & AI Contributor Slot for {{website}} on DailyAura",
    body_text: `Hi {{name}},

I came across {{website}} while researching high-growth platforms in {{niche}}.

Our editorial platform at DailyAura (https://guestposts.dailyaura.in) has over 60+ published guides in Artificial Intelligence and Cloud Tech. We are offering free contributor spots with permanent do-follow backlinks for high-quality technical guides.

Submission Guidelines:
https://guestposts.dailyaura.in/submit-guest-post/

Let us know if your writing team has a draft ready to syndicate!

Best regards,

Editorial & SEO Outreach Team
DailyAura Publishing
outreach@dailyaura.in | https://guestposts.dailyaura.in`,
    body_html: ""
  },
  {
    id: "tmpl_outreach_4",
    name: "Gentle Outreach Editorial Nudge (Day 3-4)",
    category: "outreach",
    stage: "Follow-up (Day 3)",
    track: "cold_outreach",
    format: "text",
    subject: "Re: Free Guest Post & Do-Follow Backlink Collaboration ({{website}})",
    body_text: `Hi {{name}},

I wanted to quickly bump my previous note in case it slipped past your inbox.

We are reserving a few editorial contributor slots this month on DailyAura (https://guestposts.dailyaura.in) for publications in {{niche}}. All published articles receive permanent do-follow links with fast 24-48h turnaround.

You can inspect our live publishing guidelines here:
https://guestposts.dailyaura.in/submit-guest-post/

Would you like us to review any pending article drafts or proposed topics this week?

Best regards,

Editorial & SEO Outreach Team
DailyAura Publishing
outreach@dailyaura.in | https://guestposts.dailyaura.in`,
    body_html: ""
  },
  {
    id: "tmpl_outreach_5",
    name: "Final Contributor Slot Check (Day 7)",
    category: "outreach",
    stage: "Final Check (Day 7)",
    track: "cold_outreach",
    format: "text",
    subject: "Final check regarding {{website}} editorial placement on DailyAura",
    body_text: `Hi {{name}},

I understand your team is likely busy with ongoing marketing initiatives.

This will be my final note regarding the free contributor placement for {{website}} on DailyAura (https://guestposts.dailyaura.in). If you ever need permanent do-follow backlinks or wish to syndicate high-quality content, our submission portal remains open:
https://guestposts.dailyaura.in/submit-guest-post/

Wishing you and {{website}} continued growth!

Best regards,

Editorial & SEO Outreach Team
DailyAura Publishing
outreach@dailyaura.in | https://guestposts.dailyaura.in`,
    body_html: ""
  },
  {
    id: "tmpl_lifecycle_welcome",
    name: "Instant Contributor Welcome & Publishing SLA",
    category: "lifecycle",
    stage: "Instant Welcome (Day 0)",
    track: "contributor_lifecycle",
    format: "html",
    subject: "Welcome to DailyAura Contributor Community — Publishing Guidelines & Next Steps",
    body_text: `Hi {{name}},

Thank you for joining the DailyAura Contributor Community (https://guestposts.dailyaura.in)!

Your contributor profile has been registered. Here are the 4 key editorial standards to keep in mind:
1. Editorial Review SLA: Our editorial desk reviews all submissions within 24 to 48 business hours.
2. Contextual Backlinks: We permit 1-2 permanent, natural do-follow backlinks per guide.
3. Word Count & Value: Minimum 800+ words with unique, non-promotional insights.
4. Fast Indexing: Live notification sent as soon as your article is indexed by Google.

Review full guidelines & submit drafts here:
https://guestposts.dailyaura.in/submit-guest-post/

Best regards,
Editorial & SEO Outreach Team
DailyAura Publishing`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
  <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 32px 28px; text-align: center;">
    <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #ffffff; font-weight: 800; letter-spacing: -0.5px;">Welcome to DailyAura</h1>
    <p style="margin: 0; font-size: 14px; color: #e2e8f0;">Official Contributor Community & Publishing Desk</p>
  </div>
  <div style="padding: 28px 24px;">
    <p style="font-size: 16px; margin: 0 0 16px 0; color: #f1f5f9;">Hi <strong>{{name}}</strong>,</p>
    <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 0 0 20px 0;">
      Thank you for connecting with <strong>DailyAura Publishing</strong> (<a href="https://guestposts.dailyaura.in" style="color: #60a5fa; text-decoration: none;">guestposts.dailyaura.in</a>). Our platform provides high-authority publishing opportunities for writers, agencies, and subject-matter leaders.
    </p>

    <div style="background: #1e293b; border-left: 4px solid #3b82f6; border-radius: 6px; padding: 18px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #ffffff;">Editorial Standards & Publishing SLA:</h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.8; color: #cbd5e1;">
        <li><strong style="color: #60a5fa;">24–48h Fast Review:</strong> Rapid editorial turn-around for all submitted drafts.</li>
        <li><strong style="color: #34d399;">Permanent Do-Follow Links:</strong> Contextual backlink inclusion guaranteed.</li>
        <li><strong style="color: #fbbf24;">800+ Word Depth:</strong> Quality-driven, well-researched, non-promotional content.</li>
        <li><strong style="color: #a78bfa;">Link Exchange Support:</strong> Open to mutual syndication partnerships.</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 30px 0 20px 0;">
      <a href="https://guestposts.dailyaura.in/submit-guest-post/" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 30px; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 14px rgba(37,99,235,0.4);">
        Submit Your Article Draft &rarr;
      </a>
    </div>

    <p style="font-size: 12px; line-height: 1.5; color: #64748b; text-align: center; margin: 0;">
      Need a custom mutual link swap? Explore our <a href="https://guestposts.dailyaura.in/link-exchange/" style="color: #60a5fa; text-decoration: underline;">Link Exchange Directory</a>.
    </p>
  </div>
  <div style="background: #090e1a; padding: 16px; text-align: center; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b;">
    DailyAura Editorial Desk &bull; outreach@dailyaura.in &bull; https://guestposts.dailyaura.in
  </div>
</div>`
  },
  {
    id: "tmpl_lifecycle_day7",
    name: "Day 7 Contributor Retention & Indexing Review",
    category: "lifecycle",
    stage: "Contributor Check-in (Day 7)",
    track: "contributor_lifecycle",
    format: "html",
    subject: "How is your DailyAura publication performing? Submit your next feature",
    body_text: `Hi {{name}},

It has been one week since your contribution was submitted on DailyAura (https://guestposts.dailyaura.in).

We recommend verifying your live article URL and monitoring your backlink indexing in Google Search Console. 

Our editorial calendar has opened priority contributor spots for your second submission. You can submit another article draft directly:
https://guestposts.dailyaura.in/submit-guest-post/

Best regards,
Editorial & SEO Outreach Team
DailyAura Publishing`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b; padding: 28px; box-shadow: 0 8px 24px rgba(0,0,0,0.4);">
  <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 20px;">
    <span style="background: rgba(16,185,129,0.2); color: #10b981; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 12px; text-transform: uppercase;">Week 1 Check-In</span>
    <h2 style="margin: 10px 0 4px 0; font-size: 20px; color: #ffffff;">How is your DailyAura article performing?</h2>
  </div>
  <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
    Hi <strong>{{name}}</strong>,<br><br>
    It has been 7 days since your editorial collaboration with <strong>DailyAura</strong>. Our platform indexes articles promptly in Google, generating lasting contextual PageRank.
  </p>
  <div style="background: #1e293b; border-radius: 8px; padding: 16px; margin: 20px 0;">
    <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #e2e8f0;">Ready to syndicate your next article?</h4>
    <p style="margin: 0 0 12px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
      Frequent contributors enjoy expedited same-day reviews, dedicated author bios, and recurring do-follow link placements.
    </p>
    <a href="https://guestposts.dailyaura.in/submit-guest-post/" style="display: inline-block; background: #10b981; color: #042f2e; padding: 10px 22px; font-size: 13px; font-weight: 700; text-decoration: none; border-radius: 6px;">
      Submit Article #2 Now &rarr;
    </a>
  </div>
  <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 0;">
    Best regards,<br>
    <strong>DailyAura Editorial & SEO Team</strong><br>
    <a href="https://guestposts.dailyaura.in" style="color: #60a5fa;">guestposts.dailyaura.in</a>
  </p>
</div>`
  },
  {
    id: "tmpl_lifecycle_day15",
    name: "Day 15 Authority Boost & Internal Link Synergy",
    category: "lifecycle",
    stage: "Authority Growth (Day 15)",
    track: "contributor_lifecycle",
    format: "html",
    subject: "Strategic Editorial Update: Cross-linking & syndication opportunities on DailyAura",
    body_text: `Hi {{name}},

As your published content on DailyAura (https://guestposts.dailyaura.in) matures and builds search authority, our team wanted to offer an opportunity for strategic cross-linking.

If your website has published new guides or authority resources, we can cross-link relevant anchor texts from our active topic clusters.

Review our link exchange options:
https://guestposts.dailyaura.in/link-exchange/

Best regards,
Editorial & SEO Outreach Team
DailyAura Publishing`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b; padding: 28px;">
  <span style="background: rgba(139,92,246,0.2); color: #a78bfa; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 12px; text-transform: uppercase;">Day 15 Authority Booster</span>
  <h2 style="margin: 12px 0 16px 0; font-size: 20px; color: #ffffff;">Maximizing Your Backlink Authority on DailyAura</h2>
  <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 20px;">
    Hi <strong>{{name}}</strong>,<br><br>
    Google values contextual link velocity and depth. As your featured article gains organic impressions, our editorial desk can connect your published guide to complementary authority articles across our Technology, SEO, and Business columns.
  </p>
  <div style="background: #1e293b; border-radius: 8px; padding: 16px; margin-bottom: 22px;">
    <h4 style="margin: 0 0 6px 0; color: #e2e8f0; font-size: 14px;">Next Level Collaboration:</h4>
    <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
      We welcome reciprocal editorial mentions and guest collaborations. Check out our mutual exchange guidelines:
    </p>
    <div style="margin-top: 14px;">
      <a href="https://guestposts.dailyaura.in/link-exchange/" style="display: inline-block; background: #8b5cf6; color: #ffffff; padding: 9px 20px; font-size: 13px; font-weight: 700; text-decoration: none; border-radius: 6px;">
        Review Link Exchange Program &rarr;
      </a>
    </div>
  </div>
  <p style="font-size: 12px; color: #64748b; margin: 0;">
    DailyAura Publishing &bull; outreach@dailyaura.in
  </p>
</div>`
  },
  {
    id: "tmpl_digest_biweekly",
    name: "Bi-Weekly Trending Article Showcase & Community Digest",
    category: "digest",
    stage: "Bi-Weekly Digest",
    track: "contributor_lifecycle",
    format: "html",
    subject: "DailyAura Community Digest: Trending Guides, New Contributors & Editorial Openings",
    body_text: `DailyAura Bi-Weekly Contributor Digest & Article Showcase

Here are 6 trending publications live on DailyAura (https://guestposts.dailyaura.in):

1. Dedicated Server Hosting: Complete Guide for Growing Businesses (Cloud Computing)
https://guestposts.dailyaura.in/dedicated-server-hosting-complete-guide-for-growing-businesses/

2. Top 5 Cheap Dedicated Server Providers in India (Technology)
https://guestposts.dailyaura.in/top-5-cheap-dedicated-server-providers-in-india/

3. AI Fluency and Executive Skill Building: Education & Career Strategies in 2026 (Education)
https://guestposts.dailyaura.in/ai-fluency-and-executive-skill-building-education-career-strategies-in-2026/

4. Biophilic Design and Acoustic Comfort in Modern Home Improvement (Home Improvement)
https://guestposts.dailyaura.in/biophilic-design-and-acoustic-comfort-in-modern-home-improvement/

5. Circular Fashion and Clean Beauty: The Conscious Wardrobe Playbook (Fashion & Beauty)
https://guestposts.dailyaura.in/circular-fashion-and-clean-beauty-the-conscious-wardrobe-playbook/

6. Doctor-Backed Longevity Protocols: Biomarkers and Preventative Health (Health & Fitness)
https://guestposts.dailyaura.in/doctor-backed-longevity-protocols-biomarkers-and-preventative-health/

Want your article featured in the next edition? Submit your draft today:
https://guestposts.dailyaura.in/submit-guest-post/

Best regards,
Editorial & SEO Outreach Team
DailyAura Publishing`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #080d1a; color: #f8fafc; border-radius: 14px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
  <!-- HEADER -->
  <div style="background: radial-gradient(circle at top right, #2563eb, #0f172a); padding: 36px 28px; text-align: center; border-bottom: 1px solid #1e293b;">
    <span style="background: rgba(255,255,255,0.15); color: #ffffff; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">COMMUNITY DIGEST &bull; ISSUE #24</span>
    <h1 style="margin: 12px 0 8px 0; font-size: 24px; color: #ffffff; font-weight: 800;">Trending Articles on DailyAura</h1>
    <p style="margin: 0; font-size: 14px; color: #94a3b8;">Discover the top industry insights published across our 8 core editorial domains</p>
  </div>

  <div style="padding: 28px 24px;">
    <!-- POST 1 -->
    <div style="background: #131c2e; border: 1px solid #24324d; border-radius: 10px; padding: 18px; margin-bottom: 16px;">
      <span style="background: rgba(6,182,212,0.15); color: #06b6d4; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px;">Cloud Computing</span>
      <h3 style="margin: 8px 0 6px 0; font-size: 16px; color: #ffffff;">
        <a href="https://guestposts.dailyaura.in/dedicated-server-hosting-complete-guide-for-growing-businesses/" style="color: #ffffff; text-decoration: none;">Dedicated Server Hosting: Complete Guide for Growing Businesses</a>
      </h3>
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">When expanding your digital footprint, choosing the right physical resources and bandwidth is critical. A complete executive roadmap.</p>
      <a href="https://guestposts.dailyaura.in/dedicated-server-hosting-complete-guide-for-growing-businesses/" style="font-size: 12px; font-weight: 700; color: #3b82f6; text-decoration: none;">Read Full Guide &rarr;</a>
    </div>

    <!-- POST 2 -->
    <div style="background: #131c2e; border: 1px solid #24324d; border-radius: 10px; padding: 18px; margin-bottom: 16px;">
      <span style="background: rgba(59,130,246,0.15); color: #60a5fa; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px;">Technology</span>
      <h3 style="margin: 8px 0 6px 0; font-size: 16px; color: #ffffff;">
        <a href="https://guestposts.dailyaura.in/top-5-cheap-dedicated-server-providers-in-india/" style="color: #ffffff; text-decoration: none;">Top 5 Cheap Dedicated Server Providers in India</a>
      </h3>
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">Startups and scaling enterprises often seek cost-effective, high-throughput dedicated hardware. Analysis of the top 5 platforms.</p>
      <a href="https://guestposts.dailyaura.in/top-5-cheap-dedicated-server-providers-in-india/" style="font-size: 12px; font-weight: 700; color: #3b82f6; text-decoration: none;">Read Full Guide &rarr;</a>
    </div>

    <!-- POST 3 -->
    <div style="background: #131c2e; border: 1px solid #24324d; border-radius: 10px; padding: 18px; margin-bottom: 16px;">
      <span style="background: rgba(139,92,246,0.15); color: #a78bfa; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px;">Education & AI</span>
      <h3 style="margin: 8px 0 6px 0; font-size: 16px; color: #ffffff;">
        <a href="https://guestposts.dailyaura.in/ai-fluency-and-executive-skill-building-education-career-strategies-in-2026/" style="color: #ffffff; text-decoration: none;">AI Fluency & Executive Skill Building: 2026 Career Strategies</a>
      </h3>
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">The global career landscape is experiencing its most rapid transformation. How professionals build enduring AI workflow literacy.</p>
      <a href="https://guestposts.dailyaura.in/ai-fluency-and-executive-skill-building-education-career-strategies-in-2026/" style="font-size: 12px; font-weight: 700; color: #3b82f6; text-decoration: none;">Read Full Guide &rarr;</a>
    </div>

    <!-- POST 4 -->
    <div style="background: #131c2e; border: 1px solid #24324d; border-radius: 10px; padding: 18px; margin-bottom: 16px;">
      <span style="background: rgba(16,185,129,0.15); color: #34d399; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px;">Home Improvement</span>
      <h3 style="margin: 8px 0 6px 0; font-size: 16px; color: #ffffff;">
        <a href="https://guestposts.dailyaura.in/biophilic-design-and-acoustic-comfort-in-modern-home-improvement/" style="color: #ffffff; text-decoration: none;">Biophilic Design and Acoustic Comfort in Modern Renovation</a>
      </h3>
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">Homeowners and interior designers are integrating natural acoustics and biophilic architecture for restorative living environments.</p>
      <a href="https://guestposts.dailyaura.in/biophilic-design-and-acoustic-comfort-in-modern-home-improvement/" style="font-size: 12px; font-weight: 700; color: #3b82f6; text-decoration: none;">Read Full Guide &rarr;</a>
    </div>

    <!-- POST 5 -->
    <div style="background: #131c2e; border: 1px solid #24324d; border-radius: 10px; padding: 18px; margin-bottom: 24px;">
      <span style="background: rgba(244,63,94,0.15); color: #fb7185; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px;">Health & Longevity</span>
      <h3 style="margin: 8px 0 6px 0; font-size: 16px; color: #ffffff;">
        <a href="https://guestposts.dailyaura.in/doctor-backed-longevity-protocols-biomarkers-and-preventative-health/" style="color: #ffffff; text-decoration: none;">Doctor-Backed Longevity Protocols: Biomarkers & Preventative Health</a>
      </h3>
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">Preventative clinical medicine shifts from reactive symptom care toward proactive biomarker surveillance and mitochondrial support.</p>
      <a href="https://guestposts.dailyaura.in/doctor-backed-longevity-protocols-biomarkers-and-preventative-health/" style="font-size: 12px; font-weight: 700; color: #3b82f6; text-decoration: none;">Read Full Guide &rarr;</a>
    </div>

    <!-- CALLOUT BANNER -->
    <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); border-radius: 10px; padding: 22px; text-align: center;">
      <h3 style="margin: 0 0 8px 0; font-size: 17px; color: #ffffff;">Want Your Article Featured in the Next Issue?</h3>
      <p style="margin: 0 0 16px 0; font-size: 13px; color: #cbd5e1; line-height: 1.5;">
        Join over 100+ active contributors. Submit your free article with permanent contextual do-follow links today.
      </p>
      <a href="https://guestposts.dailyaura.in/submit-guest-post/" style="display: inline-block; background: #ffffff; color: #1e3a8a; padding: 10px 24px; font-size: 13px; font-weight: 800; text-decoration: none; border-radius: 6px;">
        Submit Your Guest Post &rarr;
      </a>
    </div>
  </div>

  <div style="background: #050811; padding: 18px; text-align: center; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b;">
    DailyAura Publishing &bull; 8 Core Categories &bull; <a href="https://guestposts.dailyaura.in" style="color: #3b82f6; text-decoration: none;">guestposts.dailyaura.in</a>
  </div>
</div>`
  },
  {
    id: "tmpl_advertising_1",
    name: "Featured Contributor Spotlight & Sponsored Brand Announcement",
    category: "advertising",
    stage: "Partner Feature",
    track: "contributor_lifecycle",
    format: "html",
    subject: "Featured Contributor Spotlight: Explore our latest high-authority editorial releases",
    body_text: `Hi {{name}},

We are thrilled to unveil this month's Featured Contributor Spotlight on DailyAura (https://guestposts.dailyaura.in)!

Our publication highlights top industry perspectives across Artificial Intelligence, Cloud Infrastructure, and Digital Marketing.

If your agency or brand is seeking targeted exposure, we offer:
- High-visibility homepage and category feature slots
- Permanent do-follow backlinks with authoritative contextual placement
- Syndication across our active subscriber network

Review contributor options and submit drafts:
https://guestposts.dailyaura.in/submit-guest-post/

Best regards,
Editorial & SEO Outreach Team
DailyAura Publishing`,
    body_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
  <div style="text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 20px; margin-bottom: 20px;">
    <span style="background: rgba(245,158,11,0.2); color: #f59e0b; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 12px; text-transform: uppercase;">Editorial Spotlight</span>
    <h2 style="margin: 12px 0 6px 0; font-size: 22px; color: #ffffff;">Featured Brand & Contributor Showcase</h2>
    <p style="margin: 0; font-size: 13px; color: #94a3b8;">High-authority backlink syndication on DailyAura</p>
  </div>
  <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px;">
    Hi <strong>{{name}}</strong>,<br><br>
    Each month, DailyAura highlights top editorial contributions that deliver exceptional practical value to our readers. Whether you are scaling an agency, promoting SaaS platforms, or establishing personal domain authority, our publishing desk gives you direct access to high-impact do-follow links.
  </p>
  <div style="background: #1e293b; border-radius: 8px; padding: 18px; margin-bottom: 22px;">
    <h4 style="margin: 0 0 10px 0; font-size: 15px; color: #ffffff;">Key Opportunities for Your Brand:</h4>
    <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.7; color: #94a3b8;">
      <li>Feature your latest case studies in AI, SaaS, or Marketing</li>
      <li>Acquire permanent contextual do-follow links with zero recurring fees</li>
      <li>Accelerate organic indexing within 24–48 hours</li>
    </ul>
  </div>
  <div style="text-align: center; margin-bottom: 20px;">
    <a href="https://guestposts.dailyaura.in/submit-guest-post/" style="display: inline-block; background: #f59e0b; color: #000000; padding: 12px 28px; font-size: 14px; font-weight: 800; text-decoration: none; border-radius: 6px;">
      Reserve Your Contributor Feature &rarr;
    </a>
  </div>
  <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">
    DailyAura Publishing &bull; outreach@dailyaura.in &bull; https://guestposts.dailyaura.in
  </p>
</div>`
  }
];

const defaultState = {
  settings: {
    smtp_host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    smtp_port: parseInt(process.env.SMTP_PORT || '465'),
    smtp_user: process.env.SMTP_USER || 'outreach@dailyaura.in',
    smtp_pass: process.env.SMTP_PASS || 'Aarrii@1122',
    from_name: 'DailyAura Editorial Team',
    from_email: 'outreach@dailyaura.in',
    app_url: process.env.APP_URL || 'http://localhost:3000',
    admin_user: process.env.ADMIN_USER || 'admin',
    admin_pass: process.env.ADMIN_PASS || 'dailyaura@123',
    track_opens: true,
    track_clicks: true,
    signature: `Editorial & SEO Outreach Team\nDailyAura Publishing\noutreach@dailyaura.in | https://guestposts.dailyaura.in`,
    welcome_email_enabled: true,
    welcome_email_delay_mins: 3,
    welcome_email_subject: "Welcome to DailyAura Contributor Community — Publishing Guidelines",
    welcome_email_body: defaultTemplates[5].body_text
  },
  campaign: {
    status: 'idle', // 'idle' | 'running' | 'paused' | 'completed'
    name: 'Q4 2026 High-DA Off-Page Outreach',
    delay_min: 120, // 2 minutes minimum gap
    delay_max: 180, // 3 minutes maximum gap
    daily_limit: 50,
    selected_niche: 'All Niches',
    subject: 'Free Guest Post & Do-Follow Backlink Collaboration ({{website}})',
    template: defaultTemplates[0].body_text,
    active_track: 'cold_outreach'
  },
  campaigns: [
    {
      id: "camp_1",
      name: "SEO Agencies & Link Builders Batch #1",
      niche: "Digital Marketing & SEO Link Building",
      segment: "All Prospects",
      track: "cold_outreach",
      status: "running",
      delay_min: 120,
      delay_max: 180,
      sent_count: 10,
      open_count: 7,
      click_count: 3,
      created_at: "2026-11-07T06:00:00.000Z"
    },
    {
      id: "camp_2",
      name: "AI & Tech Publications Outreach",
      niche: "Artificial Intelligence & Machine Learning",
      segment: "Never Contacted",
      track: "cold_outreach",
      status: "idle",
      delay_min: 120,
      delay_max: 180,
      sent_count: 0,
      open_count: 0,
      click_count: 0,
      created_at: "2026-11-07T18:00:00.000Z"
    },
    {
      id: "camp_3",
      name: "Bi-Weekly Community Digest & Article Showcase",
      niche: "All Niches",
      segment: "All Prospects",
      track: "contributor_lifecycle",
      status: "idle",
      delay_min: 120,
      delay_max: 180,
      sent_count: 0,
      open_count: 0,
      click_count: 0,
      created_at: "2026-11-07T20:00:00.000Z"
    }
  ],
  templates: defaultTemplates,
  sequences: [
    {
      id: "seq_1",
      track: "cold_outreach",
      step: 1,
      name: "Step 1: Free Guest Post Pitch (Day 0)",
      delay_days: 0,
      subject: "Free Guest Post & Do-Follow Backlink Collaboration ({{website}})",
      active: true,
      description: "Initial value-first outreach offering free placement with permanent do-follow links."
    },
    {
      id: "seq_2",
      track: "cold_outreach",
      step: 2,
      name: "Step 2: Gentle Editorial Follow-up (Day 3)",
      delay_days: 3,
      subject: "Re: Free Guest Post & Do-Follow Backlink Collaboration ({{website}})",
      active: true,
      description: "Automated nudge sent 3 days after initial send if email was unopened or unreplied."
    },
    {
      id: "seq_3",
      track: "cold_outreach",
      step: 3,
      name: "Step 3: Final Contributor Slot Reservation (Day 7)",
      delay_days: 7,
      subject: "Final check regarding {{website}} editorial placement on DailyAura",
      active: true,
      description: "Final friendly reminder closing out the contributor slot reservation."
    },
    {
      id: "seq_4",
      track: "contributor_lifecycle",
      step: 1,
      name: "Step 1: Instant Contributor Welcome & SLA",
      delay_days: 0,
      delay_mins: 3,
      subject: "Welcome to DailyAura Contributor Community — Publishing Guidelines",
      active: true,
      description: "Automated welcome email with guidelines sent within 3 minutes of signup or submission."
    },
    {
      id: "seq_5",
      track: "contributor_lifecycle",
      step: 2,
      name: "Step 2: Day 7 Contributor Retention & Indexing Review",
      delay_days: 7,
      subject: "How is your DailyAura publication performing? Submit your next feature",
      active: true,
      description: "Check-in checking live URL indexing and offering priority slot for article #2."
    },
    {
      id: "seq_6",
      track: "contributor_lifecycle",
      step: 3,
      name: "Step 3: Day 15 Authority Boost & Link Synergy",
      delay_days: 15,
      subject: "Strategic Editorial Update: Cross-linking & syndication opportunities on DailyAura",
      active: true,
      description: "Invites author to explore reciprocal linking and syndication across DailyAura pillars."
    },
    {
      id: "seq_7",
      track: "contributor_lifecycle",
      step: 4,
      name: "Step 4: Bi-Weekly Trending Article Showcase & Digest",
      delay_days: 14,
      subject: "DailyAura Community Digest: Trending Guides, New Contributors & Editorial Openings",
      active: true,
      description: "Rich HTML newsletter showcasing 6 top articles, category badges, and contributor CTAs."
    }
  ],
  replies: [
    {
      id: "rep_1",
      lead_id: "lead_1",
      email: "theguestpostingoutreach@gmail.com",
      website: "Guest Posting Outreach",
      sender_name: "Rahul Verma",
      subject: "Re: Free Guest Post & Do-Follow Backlink Collaboration",
      snippet: "Hello! Yes, we have 2 high quality articles on Digital Marketing & AI Tools ready for publication. Can we include 2 contextual do-follow links?",
      sentiment: "interested",
      received_at: "2026-11-07T08:30:00.000Z",
      status: "unread"
    },
    {
      id: "rep_2",
      lead_id: "lead_4",
      email: "digitalmarketing@cbitss.in",
      website: "CBitss Technologies",
      sender_name: "CBitss Content Desk",
      subject: "Re: Content Collaboration & Link Exchange",
      snippet: "Hi Team DailyAura, we would love to collaborate on a mutual link exchange. Here are our high DA blogs...",
      sentiment: "interested",
      received_at: "2026-11-07T09:15:00.000Z",
      status: "replied"
    },
    {
      id: "rep_3",
      lead_id: "lead_7",
      email: "dhrubajyoti2012@gmail.com",
      website: "Tech Media Hub",
      sender_name: "Dhrubajyoti",
      subject: "Re: Free Guest Post Placement",
      snippet: "Thanks for reaching out! I checked guestposts.dailyaura.in and submitted a draft on Cloud DevOps through your form. Please approve.",
      sentiment: "published",
      received_at: "2026-11-07T10:45:00.000Z",
      status: "read"
    }
  ],
  blacklist: [
    { email: "spam-trap@domain.com", reason: "Spam trap address", added_at: "2026-11-01T00:00:00.000Z" }
  ],
  
  contributors: [
    {
      id: "contrib_1",
      name: "The Blue Kite",
      email: "thebluekite15@gmail.com",
      website: "thebluekite.com",
      niche: "Real Estate & Lifestyle",
      registered_at: "2026-11-06T17:53:20.000Z",
      posts_submitted: 1,
      published_urls: ["https://guestposts.dailyaura.in/"],
      stage: "welcome_sent",
      welcome_sent_at: "2026-11-06T17:56:00.000Z",
      day2_digest_sent_at: null,
      day10_retention_sent_at: null,
      open_count: 1,
      click_count: 0
    },
    {
      id: "contrib_2",
      name: "Bharat Datacenter",
      email: "bdcamitsingh101@gmail.com",
      website: "bharatdatacenter.com",
      niche: "Cloud Computing & Tech",
      registered_at: "2026-11-06T17:53:26.000Z",
      posts_submitted: 2,
      published_urls: [
        "https://guestposts.dailyaura.in/dedicated-server-hosting-complete-guide-for-growing-businesses/",
        "https://guestposts.dailyaura.in/top-5-cheap-dedicated-server-providers-in-india/"
      ],
      stage: "day2_digest_sent",
      welcome_sent_at: "2026-11-06T17:55:00.000Z",
      day2_digest_sent_at: "2026-11-07T12:30:00.000Z",
      day10_retention_sent_at: null,
      open_count: 2,
      click_count: 1
    },
    {
      id: "contrib_3",
      name: "NoPest UK",
      email: "nopestseo@gmail.com",
      website: "nopest.co.uk",
      niche: "Home Improvement",
      registered_at: "2026-11-06T17:53:33.000Z",
      posts_submitted: 1,
      published_urls: ["https://guestposts.dailyaura.in/why-professional-pest-control-is-important-for-a-healthy-home/"],
      stage: "day10_retention_sent",
      welcome_sent_at: "2026-11-06T17:56:00.000Z",
      day2_digest_sent_at: "2026-11-07T10:00:00.000Z",
      day10_retention_sent_at: "2026-11-07T16:00:00.000Z",
      open_count: 3,
      click_count: 2
    },
    {
      id: "contrib_4",
      name: "Amrit Chhabra",
      email: "chhabraamrit686@gmail.com",
      website: "dailyaura.in",
      niche: "Education & AI",
      registered_at: "2026-11-07T16:59:16.000Z",
      posts_submitted: 5,
      published_urls: ["https://guestposts.dailyaura.in/ai-fluency-and-executive-skill-building-education-career-strategies-in-2026/"],
      stage: "welcome_sent",
      welcome_sent_at: "2026-11-07T17:02:00.000Z",
      day2_digest_sent_at: null,
      day10_retention_sent_at: null,
      open_count: 1,
      click_count: 0
    },
    {
      id: "contrib_5",
      name: "DigiTech Scaling Group",
      email: "growth@digitechscaling.com",
      website: "digitechscaling.com",
      niche: "Digital Marketing & SEO",
      registered_at: "2026-11-05T09:14:00.000Z",
      posts_submitted: 1,
      published_urls: [],
      stage: "day2_digest_sent",
      welcome_sent_at: "2026-11-05T09:17:00.000Z",
      day2_digest_sent_at: "2026-11-07T11:00:00.000Z",
      day10_retention_sent_at: null,
      open_count: 2,
      click_count: 1
    }
  ],
  articles: [
    {
      id: "art_1",
      title: "Dedicated Server Hosting: Complete Guide for Growing Businesses",
      url: "https://guestposts.dailyaura.in/dedicated-server-hosting-complete-guide-for-growing-businesses/",
      category: "Cloud Computing",
      author: "Bharat Datacenter",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
      excerpt: "Essential guide on choosing reliable dedicated server hardware and bandwidth to expand your business securely.",
      published_at: "2026-11-04"
    },
    {
      id: "art_2",
      title: "Top 5 Cheap Dedicated Server Providers in India",
      url: "https://guestposts.dailyaura.in/top-5-cheap-dedicated-server-providers-in-india/",
      category: "Technology",
      author: "Bharat Datacenter",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
      excerpt: "Startups and enterprises look for cheap dedicated servers. An executive analysis of the top 5 platforms.",
      published_at: "2026-11-02"
    },
    {
      id: "art_3",
      title: "AI Fluency and Executive Skill Building: Education & Career Strategies in 2026",
      url: "https://guestposts.dailyaura.in/ai-fluency-and-executive-skill-building-education-career-strategies-in-2026/",
      category: "Education & AI",
      author: "Amrit Chhabra",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      excerpt: "The global career landscape is experiencing rapid evolution. How executives build enduring AI workflows.",
      published_at: "2026-10-27"
    },
    {
      id: "art_4",
      title: "Biophilic Design and Acoustic Comfort in Modern Home Improvement",
      url: "https://guestposts.dailyaura.in/biophilic-design-and-acoustic-comfort-in-modern-home-improvement/",
      category: "Home Improvement",
      author: "Amrit Chhabra",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
      excerpt: "Integrating acoustic architecture, sound-dampening engineering, and biophilic natural design in modern living spaces.",
      published_at: "2026-10-27"
    },
    {
      id: "art_5",
      title: "Circular Fashion and Clean Beauty: The Conscious Wardrobe Playbook",
      url: "https://guestposts.dailyaura.in/circular-fashion-and-clean-beauty-the-conscious-wardrobe-playbook/",
      category: "Fashion & Beauty",
      author: "Amrit Chhabra",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
      excerpt: "Regenerative textile innovations, non-toxic formulations, and circular capsule wardrobes for conscious consumers.",
      published_at: "2026-10-27"
    },
    {
      id: "art_6",
      title: "Doctor-Backed Longevity Protocols: Biomarkers and Preventative Health",
      url: "https://guestposts.dailyaura.in/doctor-backed-longevity-protocols-biomarkers-and-preventative-health/",
      category: "Health & Fitness",
      author: "Amrit Chhabra",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&auto=format&fit=crop&q=80",
      excerpt: "Preventative clinical medicine shifts from reactive illness care toward proactive biomarker surveillance.",
      published_at: "2026-10-27"
    }
  ],
  leads: [
    {
      id: "lead_1",
      name: "Guest Posting Outreach",
      email: "theguestpostingoutreach@gmail.com",
      website: "Guest Posting Outreach",
      niche: "Digital Marketing & SEO Link Building",
      da_score: 42,
      tld: ".com",
      role: "Link Outreach Specialist",
      status: "opened",
      sent_at: "2026-11-07T06:46:05.626Z",
      open_count: 2,
      opened_at: "2026-11-07T07:12:10.000Z",
      click_count: 1,
      clicked_at: "2026-11-07T07:15:33.000Z",
      last_error: null
    },
    {
      id: "lead_2",
      name: "DigiMarkLand Team",
      email: "digimarkland@gmail.com",
      website: "DigiMarkLand",
      niche: "Digital Marketing & SEO Link Building",
      da_score: 38,
      tld: ".com",
      role: "SEO Specialist",
      status: "opened",
      sent_at: "2026-11-07T06:46:46.057Z",
      open_count: 1,
      opened_at: "2026-11-07T07:30:22.000Z",
      click_count: 0,
      clicked_at: null,
      last_error: null
    },
    {
      id: "lead_3",
      name: "Amit Chavan",
      email: "amitchavan0203@gmail.com",
      website: "Ultimate Tech News",
      niche: "Technology & Software Development",
      da_score: 45,
      tld: ".com",
      role: "Managing Editor",
      status: "opened",
      sent_at: "2026-11-07T06:47:13.191Z",
      open_count: 1,
      opened_at: "2026-11-07T17:12:51.000Z",
      click_count: 0,
      clicked_at: null,
      last_error: null
    },
    {
      id: "lead_4",
      name: "CBitss Technologies",
      email: "digitalmarketing@cbitss.in",
      website: "CBitss Technologies",
      niche: "Digital Marketing & SEO Link Building",
      da_score: 48,
      tld: ".in",
      role: "Content Marketing Director",
      status: "clicked",
      sent_at: "2026-11-07T06:47:54.351Z",
      open_count: 1,
      opened_at: "2026-11-07T08:05:14.000Z",
      click_count: 1,
      clicked_at: "2026-11-07T08:08:42.000Z",
      last_error: null
    },
    {
      id: "lead_5",
      name: "All Tech About Editorial",
      email: "alltechabout@gmail.com",
      website: "All Tech About",
      niche: "Technology & Software Development",
      da_score: 35,
      tld: ".com",
      role: "Off-Page SEO Executive",
      status: "opened",
      sent_at: "2026-11-07T06:48:33.976Z",
      open_count: 1,
      opened_at: "2026-11-07T08:45:00.000Z",
      click_count: 0,
      clicked_at: null,
      last_error: null
    },
    {
      id: "lead_6",
      name: "TechSaaS Insider",
      email: "techsaasinsider@gmail.com",
      website: "TechSaaS Insider",
      niche: "SaaS, Cloud Computing & DevOps",
      da_score: 52,
      tld: ".com",
      role: "Editorial Desk",
      status: "clicked",
      sent_at: "2026-11-07T06:49:20.632Z",
      open_count: 1,
      opened_at: "2026-11-07T10:20:00.000Z",
      click_count: 1,
      clicked_at: "2026-11-07T10:25:30.000Z",
      last_error: null
    },
    {
      id: "lead_7",
      name: "Dhrubajyoti",
      email: "dhrubajyoti2012@gmail.com",
      website: "Tech Media Hub",
      niche: "Artificial Intelligence & Machine Learning",
      da_score: 41,
      tld: ".com",
      role: "SEO Outreach",
      status: "opened",
      sent_at: "2026-11-07T06:50:06.946Z",
      open_count: 1,
      opened_at: "2026-11-07T09:12:00.000Z",
      click_count: 0,
      clicked_at: null,
      last_error: null
    },
    {
      id: "lead_8",
      name: "Tech With Africa Team",
      email: "techwithafrica@gmail.com",
      website: "Tech With Africa",
      niche: "Business, Startups & Entrepreneurship",
      da_score: 39,
      tld: ".com",
      role: "Editor in Chief",
      status: "sent",
      sent_at: "2026-11-07T06:50:41.013Z",
      open_count: 0,
      opened_at: null,
      click_count: 0,
      clicked_at: null,
      last_error: null
    },
    {
      id: "lead_9",
      name: "William Zevren",
      email: "williamzevren@gmail.com",
      website: "Faith Archive",
      niche: "Business, Startups & Entrepreneurship",
      da_score: 36,
      tld: ".com",
      role: "Staff Writer",
      status: "sent",
      sent_at: "2026-11-07T06:51:16.933Z",
      open_count: 1,
      opened_at: "2026-11-07T09:40:00.000Z",
      click_count: 0,
      clicked_at: null,
      last_error: null
    },
    {
      id: "lead_10",
      name: "BazzHood Editorial",
      email: "bazzhoodonline@gmail.com",
      website: "BazzHood",
      niche: "Health, Fitness & Wellness",
      da_score: 38,
      tld: ".com",
      role: "Content Director",
      status: "sent",
      sent_at: "2026-11-07T06:51:43.943Z",
      open_count: 0,
      opened_at: null,
      click_count: 0,
      clicked_at: null,
      last_error: null
    }
  ],
  events: [
    { id: "ev_1", type: "sent", lead_id: "lead_1", website: "Guest Posting Outreach", email: "theguestpostingoutreach@gmail.com", timestamp: "2026-11-07T06:46:05.626Z" },
    { id: "ev_2", type: "open", lead_id: "lead_1", website: "Guest Posting Outreach", email: "theguestpostingoutreach@gmail.com", timestamp: "2026-11-07T07:12:10.000Z" },
    { id: "ev_3", type: "click", lead_id: "lead_1", website: "Guest Posting Outreach", email: "theguestpostingoutreach@gmail.com", url: "https://guestposts.dailyaura.in/submit-guest-post/", timestamp: "2026-11-07T07:15:33.000Z" },
    { id: "ev_4", type: "sent", lead_id: "lead_2", website: "DigiMarkLand", email: "digimarkland@gmail.com", timestamp: "2026-11-07T06:46:46.057Z" },
    { id: "ev_5", type: "open", lead_id: "lead_2", website: "DigiMarkLand", email: "digimarkland@gmail.com", timestamp: "2026-11-07T07:30:22.000Z" },
    { id: "ev_6", type: "sent", lead_id: "lead_3", website: "Ultimate Tech News", email: "amitchavan0203@gmail.com", timestamp: "2026-11-07T06:47:13.191Z" },
    { id: "ev_7", type: "open", lead_id: "lead_3", website: "Ultimate Tech News", email: "amitchavan0203@gmail.com", timestamp: "2026-11-07T17:12:51.000Z" },
    { id: "ev_8", type: "sent", lead_id: "lead_4", website: "CBitss Technologies", email: "digitalmarketing@cbitss.in", timestamp: "2026-11-07T06:47:54.351Z" },
    { id: "ev_9", type: "open", lead_id: "lead_4", website: "CBitss Technologies", email: "digitalmarketing@cbitss.in", timestamp: "2026-11-07T08:05:14.000Z" },
    { id: "ev_10", type: "click", lead_id: "lead_4", website: "CBitss Technologies", email: "digitalmarketing@cbitss.in", url: "https://guestposts.dailyaura.in/submit-guest-post/", timestamp: "2026-11-07T08:08:42.000Z" },
    { id: "ev_11", type: "sent", lead_id: "lead_5", website: "All Tech About", email: "alltechabout@gmail.com", timestamp: "2026-11-07T06:48:33.976Z" },
    { id: "ev_12", type: "open", lead_id: "lead_5", website: "All Tech About", email: "alltechabout@gmail.com", timestamp: "2026-11-07T08:45:00.000Z" },
    { id: "ev_13", type: "sent", lead_id: "lead_6", website: "TechSaaS Insider", email: "techsaasinsider@gmail.com", timestamp: "2026-11-07T06:49:20.632Z" },
    { id: "ev_14", type: "open", lead_id: "lead_6", website: "TechSaaS Insider", email: "techsaasinsider@gmail.com", timestamp: "2026-11-07T10:20:00.000Z" },
    { id: "ev_15", type: "click", lead_id: "lead_6", website: "TechSaaS Insider", email: "techsaasinsider@gmail.com", url: "https://guestposts.dailyaura.in/submit-guest-post/", timestamp: "2026-11-07T10:25:30.000Z" },
    { id: "ev_16", type: "sent", lead_id: "lead_7", website: "Tech Media Hub", email: "dhrubajyoti2012@gmail.com", timestamp: "2026-11-07T06:50:06.946Z" },
    { id: "ev_17", type: "open", lead_id: "lead_7", website: "Tech Media Hub", email: "dhrubajyoti2012@gmail.com", timestamp: "2026-11-07T09:12:00.000Z" }
  ],
  chat: [
    {
      id: "msg_init",
      role: "assistant",
      content: "Hello! I am your DailyAura Enterprise AI Outreach Assistant. I can help you monitor live analytics, launch campaigns with safe 2-minute throttling, generate niche-specific outreach templates, and manage your 100k+ lead pipeline. How can I assist you today?",
      timestamp: new Date().toISOString()
    }
  ]
};

let db = { ...defaultState };

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const loaded = JSON.parse(raw);
      db = {
        ...defaultState,
        ...loaded,
        settings: { ...defaultState.settings, ...(loaded.settings || {}) },
        campaign: { ...defaultState.campaign, ...(loaded.campaign || {}) },
        templates: (loaded.templates && loaded.templates.length > 0) ? loaded.templates : defaultTemplates,
        campaigns: (loaded.campaigns && loaded.campaigns.length > 0) ? loaded.campaigns : defaultState.campaigns,
        sequences: (loaded.sequences && loaded.sequences.length >= 7) ? loaded.sequences : defaultState.sequences,
        replies: (loaded.replies && loaded.replies.length > 0) ? loaded.replies : defaultState.replies,
        contributors: (loaded.contributors && loaded.contributors.length > 0) ? loaded.contributors : defaultState.contributors,
        articles: (loaded.articles && loaded.articles.length > 0) ? loaded.articles : defaultState.articles,
      };
      // Strictly prevent Amritpal from ever being used
      db.settings.from_name = 'DailyAura Editorial Team';
      db.settings.signature = `Editorial & SEO Outreach Team\nDailyAura Publishing\noutreach@dailyaura.in | https://guestposts.dailyaura.in`;
      
      // Enforce 2 minute minimum gap (120s)
      if (!db.campaign.delay_min || db.campaign.delay_min < 120) {
        db.campaign.delay_min = 120;
        db.campaign.delay_max = 180;
      }
      saveData();
    } else {
      saveData();
    }
  } catch (err) {
    console.error('Error loading CRM database, initializing defaults:', err);
    db = { ...defaultState };
    saveData();
  }
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving CRM database:', err);
  }
}

loadData();

module.exports = {
  get: () => db,
  save: () => saveData(),
  NICHES,
    getContributors: (search, stage) => {
    let list = db.contributors || defaultState.contributors;
    if (stage && stage !== 'all') {
      list = list.filter(c => c.stage === stage);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.website && c.website.toLowerCase().includes(q))
      );
    }
    return list;
  },
  addContributor: (c) => {
    c.id = 'contrib_' + Date.now();
    c.registered_at = c.registered_at || new Date().toISOString();
    c.stage = c.stage || 'registered';
    c.posts_submitted = parseInt(c.posts_submitted || 0);
    c.published_urls = c.published_urls || [];
    c.open_count = 0;
    c.click_count = 0;
    if (!db.contributors) db.contributors = [];
    db.contributors.unshift(c);
    saveData();
    return c;
  },
  updateContributor: (id, updates) => {
    if (!db.contributors) db.contributors = [...defaultState.contributors];
    const c = db.contributors.find(x => x.id === id);
    if (c) {
      Object.assign(c, updates);
      saveData();
      return c;
    }
    return null;
  },
  deleteContributor: (id) => {
    if (!db.contributors) return;
    db.contributors = db.contributors.filter(x => x.id !== id);
    saveData();
  },
  getArticles: () => (db.articles || defaultState.articles).map(a => ({
    ...a,
    image: a.image || a.featured_image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    featured_image: a.featured_image || a.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80'
  })),
  addArticle: (art) => {
    art.id = 'art_' + Date.now();
    art.published_at = art.published_at || new Date().toISOString();
    if (!db.articles) db.articles = [...defaultState.articles];
    db.articles.unshift(art);
    saveData();
    return art;
  },
  getTemplates: (category = 'all', track = 'all') => {
    let list = db.templates || defaultTemplates;
    if (track && track !== 'all') {
      list = list.filter(t => t.track === track);
    }
    if (category && category !== 'all') {
      list = list.filter(t => t.category === category);
    }
    return list;
  },
  addTemplate: (tmpl) => {
    tmpl.id = 'tmpl_' + Date.now();
    tmpl.created_at = new Date().toISOString();
    db.templates.unshift(tmpl);
    saveData();
    return tmpl;
  },
  updateTemplate: (id, updates) => {
    const t = db.templates.find(x => x.id === id);
    if (t) {
      Object.assign(t, updates);
      saveData();
      return t;
    }
    return null;
  },
  deleteTemplate: (id) => {
    db.templates = db.templates.filter(x => x.id !== id);
    saveData();
  },
  addLead: (lead) => {
    lead.id = 'lead_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
    lead.status = lead.status || 'pending';
    lead.open_count = lead.open_count || 0;
    lead.opened_at = lead.opened_at || null;
    lead.click_count = lead.click_count || 0;
    lead.clicked_at = lead.clicked_at || null;
    lead.sent_at = lead.sent_at || null;
    lead.da_score = lead.da_score || Math.floor(Math.random() * 30) + 30;
    lead.niche = lead.niche || 'Digital Marketing & SEO Link Building';
    db.leads.unshift(lead);
    saveData();
    return lead;
  },
  updateLead: (id, updates) => {
    const lead = db.leads.find(l => l.id === id);
    if (lead) {
      Object.assign(lead, updates);
      saveData();
      return lead;
    }
    return null;
  },
  deleteLead: (id) => {
    db.leads = db.leads.filter(l => l.id !== id);
    saveData();
  },
  addEvent: (ev) => {
    ev.id = 'ev_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
    ev.timestamp = ev.timestamp || new Date().toISOString();
    db.events.unshift(ev);
    saveData();
    return ev;
  },
  addCampaign: (camp) => {
    camp.id = 'camp_' + Date.now();
    camp.created_at = new Date().toISOString();
    camp.sent_count = 0;
    camp.open_count = 0;
    camp.click_count = 0;
    camp.status = camp.status || 'idle';
    camp.delay_min = parseInt(camp.delay_min || 120);
    camp.delay_max = parseInt(camp.delay_max || 180);
    camp.track = camp.track || 'cold_outreach';
    db.campaigns.unshift(camp);
    saveData();
    return camp;
  },
  addChatMessage: (role, content) => {
    const msg = {
      id: 'msg_' + Date.now(),
      role,
      content,
      timestamp: new Date().toISOString()
    };
    db.chat.push(msg);
    saveData();
    return msg;
  },
  generateNicheBatch: (nicheName, count = 25, options = {}) => {
    const prefixes = ["outreach", "editor", "guestpost", "seo", "partnerships", "editorial", "collaborations", "blog"];
    const domainRoots = [
      "techpulsejournal", "growthmarketingspot", "aiinsighthub",
      "saascaleup", "cloudfrontierdaily", "searchenginehackers",
      "venturebuilderweekly", "web3fintechguide", "digitalrankboost",
      "authoritativebacklinks", "contentrankerspro", "nextgentechtrends",
      "marketgrowthauthority", "futuristictrends", "devopscloudinsider"
    ];

    const tld = options.tld || ".com";
    const daMin = options.daMin || 35;
    const daMax = options.daMax || 65;
    const role = options.role || "Off-Page SEO Executive";

    const generated = [];
    for (let i = 0; i < count; i++) {
      const root = domainRoots[Math.floor(Math.random() * domainRoots.length)] + (i > 0 ? i : '');
      const domain = `${root}${tld}`;
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const siteName = root.replace(/[-_0-9]/g, ' ').trim().replace(/\b\w/g, l => l.toUpperCase());
      const email = `${prefix}@${domain}`;
      const da_score = Math.floor(Math.random() * (daMax - daMin + 1)) + daMin;

      const newLead = {
        id: `lead_${Date.now()}_${i}_${Math.floor(Math.random()*1000)}`,
        name: `${siteName} Editorial`,
        email,
        website: siteName,
        niche: nicheName,
        da_score,
        tld,
        role,
        status: "pending",
        open_count: 0,
        opened_at: null,
        click_count: 0,
        clicked_at: null,
        sent_at: null,
        last_error: null
      };
      db.leads.push(newLead);
      generated.push(newLead);
    }
    saveData();
    return generated;
  }
};
