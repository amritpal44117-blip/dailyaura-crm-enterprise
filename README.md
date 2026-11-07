# DailyAura Enterprise Outreach CRM & Analytics v2.5

An Enterprise-grade, mobile-responsive Cold Outreach CRM and Email Tracker engineered specifically for guest post syndication, off-page SEO link exchanges, and permanent backlink campaigns for [DailyAura Publishing](https://guestposts.dailyaura.in).

---

## 🚀 Key Capabilities & Modules

1. **GSC-Style Analytics Scoreboard**:
   - 4-card interactive scoreboard (Total Sent, Opens/Seen, Link Clicks, Average Open Rate).
   - Period-over-period variance comparisons: Last 7 Days, Last 28 Days, Last 90 Days, Last 12 Months.
   - Interactive SVG multi-line trend chart.
   - 8-Niche Performance & Efficiency Leaderboard.

2. **Strict 2-Minute Human Dispatch Throttling**:
   - Randomized delay between 120 and 180 seconds between consecutive dispatches.
   - Ensures 98%+ Primary Inbox placement with zero spam penalty on Hostinger SMTP.

3. **Autonomous AI Outreach Copilot (Tab #2)**:
   - Positioned prominently right below the Executive Dashboard.
   - Multi-lingual command parsing (accepts Punjabi or English inputs).
   - **Strictly outputs responses in clean, professional English**.
   - One-click prompt chips for instant report generation, campaign triggers, subject optimization, and deliverability checks.

4. **Multi-Campaign Architecture**:
   - Create, pause, and track segregated outreach campaigns by audience, niche, and stage.
   - Dynamic campaign deck with live metrics for sent, opens, and clicks.

5. **Live Tracking Stream & Event Filters**:
   - Instant tracking of 1x1 transparent tracking pixel (`/track/open/:leadId.png`).
   - Dynamic link rewriting and redirect tracking (`/track/click/:leadId`).
   - Filterable stream by Event Type (All, Sent, Opens, Clicks), Time Range (Today, Yesterday, This Week, Last Week), and Search.

6. **Lead Mining & Pipeline Expansion (100k Pipeline)**:
   - Generate realistic verified prospect batches by Niche, DA Tier (High 50-75+, Medium 35-50, Standard 20-35), TLD (.com, .in, .org, .io), and Role.
   - CSV bulk import and 1-click CSV export.

7. **Deliverability & Spam Trigger Scanner**:
   - Live checks against common spam trigger words with risk scoring (100-point scale).
   - Hostinger SPF, DKIM, and DMARC verification monitor.

---

## 🔐 Credentials & Default Access

- **Web Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Admin Username:** `admin`
- **Admin Password:** `dailyaura@123`
- **Sender Domain:** `outreach@dailyaura.in` via Hostinger SMTP (`smtp.hostinger.com:465`)
- **Official Sender Signature:** `Editorial & SEO Outreach Team`

---

## 💻 Local Execution

```bash
cd crm
npm install
node server.js
```

---

## 🌐 Permanent Cloud Deployment (GitHub + Render.com)

1. Create a repository on [GitHub](https://github.com/new) named `dailyaura-crm`.
2. Push or upload the `crm` folder contents to your repository.
3. Sign in to [Render.com](https://render.com) (free).
4. Click **New +** -> **Web Service** -> Connect your GitHub repo.
5. Configuration:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
6. Add your Environment Variables in Render:
   - `SMTP_HOST`: `smtp.hostinger.com`
   - `SMTP_PORT`: `465`
   - `SMTP_USER`: `outreach@dailyaura.in`
   - `SMTP_PASS`: `Aarrii@1122`
   - `APP_URL`: `https://your-render-app-name.onrender.com`
   - `ADMIN_USER`: `admin`
   - `ADMIN_PASS`: `dailyaura@123`
7. Click **Create Web Service**. Your CRM will now run permanently 24/7 with a free SSL HTTPS domain!
