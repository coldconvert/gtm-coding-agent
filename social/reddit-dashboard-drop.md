# Reddit Post — Dashboard Drop

**Target subs:** r/SaaS, r/ClaudeAI, r/sales, r/nextjs, r/webdev

---

**Title:** I built an open-source GTM dashboard with Next.js + Supabase instead of paying for one

**Body:**

i've been building go-to-market systems with coding agents (Claude Code specifically) for the past few months. the first thing i open-sourced was a 10-chapter starter kit for GTM engineers learning to use coding agents.

today i'm adding a production dashboard to that repo.

**the stack:**

- Next.js 16 + React 19 + TypeScript
- Tailwind v4 + shadcn/ui (dark theme)
- Recharts for charts
- Supabase (Postgres) for the database
- Python scripts for the signal pipeline

**what the dashboard does:**

5 pages. campaigns overview with KPI cards and send volume charts. database intelligence showing enrichment coverage and score distributions. an accounts browser with expandable rows (click a company, see its contacts and mapped signals). a signals page with intent signal analytics. and a segments page with live-computed campaign segments.

everything polls from Supabase via Next.js API routes every 15-30 seconds. no websockets needed for an operational dashboard.

**the signal scoring model is the core:**

16 intent signal types, each with a configurable weight (0-10). signals decay exponentially with a 14-day half-life. the formula:

```
score = signal_weight * source_reliability * e^(-0.0495 * days_old)
```

capped at 20 points per signal type to prevent one source from inflating scores. diversity bonuses: +2 per distinct signal type, +3 per distinct data source. a company with signals from 3 different types and 2 sources scores higher than one with 10 identical signals from one source.

signal types include: tool_evaluation (10), vendor_switch (10), hiring_signal (8), pain_expression (7), budget_mention (6), competitor_mention (5), and more.

**the supabase schema:**

companies table with ICP scoring. contacts table with a hard 3-per-company limit enforced by a postgres trigger (forces you to rank contacts by quality). signals table mapped to companies. campaign infrastructure with auto-pause triggers when bounce rate exceeds 2%.

3 SQL files, run them in order, you have a working backend.

**the pipeline:**

3 Python scripts. one discovers companies via the Exa API (neural search by vertical). one scores signals using the decay formula. one loads everything to Supabase. you can swap Exa for Apollo, Clay, or a manual CSV and the rest still works.

**cost:**

supabase free tier + vercel hobby plan = $0/mo to start. exa API for discovery is pay-per-query (a few dollars for hundreds of companies). compare to $300-1K/mo for salesforce/hubspot dashboard access.

**the repo:**

it's part of the GTM coding agent starter kit. chapter 11 walks through the architecture. the starter is in `starters/signals-dashboard/`. MIT license.

this is not a finished product. it's a starting point. i'm still building on it and would genuinely appreciate feedback, PRs, or just hearing what you'd add.

link: [will add in edit/comment per sub rules]

---

**Posting notes:**
- Adjust tone per sub:
  - r/SaaS: lead with the build-vs-buy angle and cost math
  - r/ClaudeAI: lead with the coding agent workflow, how Claude Code built most of it
  - r/sales: lead with the signal model and what it means for outbound
  - r/nextjs: lead with the technical stack, the polling pattern, shadcn integration
  - r/webdev: lead with the architecture, the Supabase schema design, the trigger patterns
- Include the GitHub link in the body for Reddit (different from LinkedIn)
- Reply to technical questions with specifics (share the actual scoring formula, table schemas, etc.)
- If someone asks "why not use X tool" give an honest answer about tradeoffs

