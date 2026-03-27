# ABM / Outbound Pipeline Builder Mode

**For:** Building pipeline through account-based marketing and outbound sequences. Precision over volume.

---

## Philosophy

Research deeply, personalize heavily, automate the boring parts.

Most outbound fails because it's lazy: same template, same value prop, same "I noticed you're hiring" opener sent to 10,000 people. ABM-driven outbound works because you earn the right to someone's attention through relevance. This mode is about building the system that produces that relevance at scale.

## Recommended Stack

| Tool | Purpose | Why This One |
|------|---------|-------------|
| Claude Code | Orchestration, research synthesis, personalization | Reads your GTM-OS, writes contextual outreach |
| Python | Enrichment pipelines, data processing, API glue | The backbone of every automation |
| CRM | Deal tracking, contact management | HubSpot or Salesforce |
| Apollo / Clay | Contact enrichment, email finding | Apollo for volume, Clay for depth |
| Exa / Firecrawl | Account research, news monitoring | Research APIs that agents can call |
| Sequencing tool | Outreach, Instantly, Apollo sequences | Automated sending and tracking |
| Claude API | Personalization at scale | Generate custom email copy per account |

The enrichment layer (Apollo/Clay + Exa/Firecrawl) is what separates real ABM from spray-and-pray with a fancy label.

## Folder Structure

Full GTM-OS with emphasis on segments, enrichment tooling, and active campaigns:

```
gtm-os/
  CLAUDE.md
  demand/
    icp.md                ← ICP with detailed scoring model
    positioning.md        ← Positioning by segment
    competitors.md        ← Competitive intel for objection handling
    signals.md            ← Buying signals mapped to actions
  messaging/
    attack-angles.md      ← 5+ angles, tested and scored
  segments/
    tier-1-enterprise.md  ← Your top 50 accounts
    tier-2-mid-market.md  ← Next 200 accounts
    expansion.md          ← Existing customers to upsell
  engine/
    apollo.md             ← Enrichment setup
    exa.md                ← Research API setup
    clay.md               ← Waterfall enrichment (if used)
    crm.md                ← CRM integration
    sequencing.md         ← Sending tool setup
    prompts/
      account-research.md ← Prompt for researching an account
      personalize.md      ← Prompt for personalizing emails
  campaigns/
    active/
      q1-tier1-cto-pain.md   ← Campaign: attack angle + segment
      q1-tier2-expansion.md
  scripts/
    enrich.py             ← Enrichment pipeline
    research.py           ← Account research via Exa
    personalize.py        ← Email personalization via Claude API
    score.py              ← Account scoring
    sync.py               ← CRM sync
  data/
    raw/                  ← Raw enrichment output
    enriched/             ← Processed, scored accounts
    research/             ← Per-account research files
  status.md
  log.md
```

## The ABM Workflow

This is the full loop. Every step has a corresponding script or process:

```
1. Define ICP          → demand/icp.md (scoring criteria)
       ↓
2. Build account list  → scripts/enrich.py (Apollo API)
       ↓
3. Enrich accounts     → scripts/enrich.py (multiple sources)
       ↓
4. Score & prioritize  → scripts/score.py (apply ICP scoring)
       ↓
5. Research top accounts → scripts/research.py (Exa API)
       ↓
6. Personalize outreach → scripts/personalize.py (Claude API)
       ↓
7. Load into sequences → CRM + sequencing tool
       ↓
8. Track & iterate     → CRM data → update scoring → repeat
```

Steps 2-6 are automatable. Step 1 requires your brain. Step 7 requires your tools. Step 8 closes the loop.

## First Week Priorities

### Day 1: Define ICP and scoring model
Fill in `demand/icp.md` with every field. Then build a scoring model:

| Signal | Points | Source |
|--------|--------|--------|
| Series B+ funding | +20 | Crunchbase via enrichment |
| Hiring for target role | +15 | LinkedIn / Apollo |
| Using competitor | +25 | BuiltWith / G2 |
| Revenue $10M-100M | +10 | Apollo / company data |
| Recent leadership change | +15 | LinkedIn / news |

Total score determines tier. Tier 1 (70+) gets deep personalization. Tier 2 (40-69) gets segment-level personalization. Below 40, don't bother.

### Day 2-3: Build first segment of 50 accounts
Use Apollo to pull companies matching your ICP criteria. Enrich with additional data sources. Score each one. Your first segment should be your best 50 accounts — the ones where you have the highest probability of winning.

### Day 3-4: Enrich via API
Build `scripts/enrich.py`. It should:
1. Read a CSV of target accounts
2. Call Apollo for contact data (emails, titles, company info)
3. Call Exa for recent news, blog posts, job listings
4. Merge everything into a single enriched record
5. Output enriched CSV + per-account research summaries

### Day 5: Write personalized sequence
Use attack angles from `messaging/attack-angles.md` and per-account research to write a 4-5 email sequence. For Tier 1 accounts, personalize the opening paragraph per account using `scripts/personalize.py`. For Tier 2, use segment-level personalization.

### Day 6-7: Launch
Load sequences into your sending tool. Set daily send limits (25-50/day to start). Monitor deliverability. Track opens, replies, and bounces.

## Key Scripts

### Enrichment Pipeline (`scripts/enrich.py`)
- Input: CSV with company names/domains
- Process: Apollo API for contacts, Exa API for research
- Output: Enriched CSV + `data/enriched/` files
- Run weekly to keep data fresh

### Account Research (`scripts/research.py`)
- Input: Company domain
- Process: Exa search for recent news, blog posts, job listings, tech stack
- Output: One-page research brief per account in `data/research/`
- Run for Tier 1 accounts before personalization

### Email Personalization (`scripts/personalize.py`)
- Input: Account research brief + attack angle + email template
- Process: Claude API generates personalized opening paragraph
- Output: Ready-to-send email copy
- Human reviews before sending — always

## Metrics That Matter

| Metric | Target | Why |
|--------|--------|-----|
| Reply rate (Tier 1) | >15% | Deep personalization should earn replies |
| Reply rate (Tier 2) | >5% | Segment personalization baseline |
| Positive reply rate | >40% of replies | Not just "take me off your list" |
| Meetings from outbound | Track weekly | The number that matters |
| Pipeline $ per 100 emails | Track monthly | Efficiency metric |

If Tier 1 reply rates are below 10%, your research or personalization isn't working. If Tier 2 is below 3%, your attack angle is off.

## Learning Path

Read these chapters in this order:

1. **Chapter 07** — Target Lists and Enrichment (your core workflow)
2. **Chapter 08** — Campaign Execution (running and measuring)
3. **Chapter 04** — Tool Integration (connecting enrichment + CRM + sequencing)
4. **Chapter 06** — Feedback Loops (improving over time)
5. **Chapter 05** — Workflow Automation (scaling what works)

---

*ABM isn't a strategy. It's a discipline. The system either produces relevant, timely, personalized outreach — or it produces noise. Build the system that produces relevance.*
