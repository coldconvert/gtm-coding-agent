# GTM Signals Dashboard

A real-time go-to-market dashboard built with Next.js, Supabase, and Recharts. Track companies, contacts, intent signals, campaign segments, and outbound operations from one dark-themed control panel.

**Part of the [GTM Coding Agent Starter Kit](../../README.md).** Read [Chapter 11](../../chapters/11-build-your-dashboard.md) for the full walkthrough.

---

## Quick Start

### 1. Set Up Supabase

Create a free project at [supabase.com](https://supabase.com). Then run the schema files in order via the SQL Editor:

```sql
-- Run these in the Supabase SQL Editor, in order:
-- 1. schema/01_core.sql        (companies, contacts, signals)
-- 2. schema/02_campaigns.sql   (domains, campaigns, send queue)
-- 3. schema/03_seed_data.sql   (sample data to see the dashboard working)
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase project URL and service role key (found in Supabase > Settings > API).

### 3. Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## What You Get

| Page | What It Shows |
|------|---------------|
| **Campaigns** (home) | KPI cards, 24-hour send volume chart, domain health grid, active campaigns table |
| **Database** | Enrichment coverage bars, score distributions, pipeline stage breakdown, top companies by ICP |
| **Accounts** | Searchable, filterable account browser with expandable rows showing contacts + signals |
| **Signals** | Signal type distribution, source breakdown, signal-rich companies ranked |
| **Segments** | Live-computed campaign segments with expandable company previews |

## Stack

- **Next.js 16** + React 19 + TypeScript
- **Tailwind CSS v4** + shadcn/ui (dark theme)
- **Recharts** for data visualization
- **Supabase** (Postgres) for data storage
- Real-time polling (15-30s refresh intervals)

## Signal Pipeline

The `pipeline/` directory contains Python scripts for discovering companies and scoring intent signals:

```bash
cd pipeline
pip install -r requirements.txt
python discover_companies.py    # find companies via Exa API
python score_signals.py         # score signals with exponential decay
python load_to_supabase.py      # push scored data to Supabase
```

See `pipeline/config.py` for signal weights, scoring thresholds, and source reliability scores.

## Deploy to Vercel

Push to GitHub, connect the repo in Vercel, add your `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` as environment variables. Done.

## License

MIT
