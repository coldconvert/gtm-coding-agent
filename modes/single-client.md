# Single Client / GTM Engineer Mode

**For:** GTM engineer or rev ops person at one company. Focused on one product, one ICP, one mission.

---

## Philosophy

Go deep. Build the full GTM-OS. Integrate every tool. Automate everything you can.

You have what solo founders don't: focus. You're not splitting time between fundraising, product, and hiring. GTM is your job. That means you can build proper automation, create feedback loops, and iterate on performance data — not just vibes.

## Recommended Stack

| Tool | Purpose | Notes |
|------|---------|-------|
| Claude Code | GTM operating system and automation | Your daily driver |
| Python | Scripts, pipelines, data processing | The glue between everything |
| Company CRM | HubSpot, Salesforce, Pipedrive | Whatever your company uses |
| Enrichment | Apollo, Clay, ZoomInfo, Clearbit | At least one, ideally two |
| Sequencing | Outreach, Instantly, Apollo, Salesloft | Automated email sequences |
| Research | Exa, Firecrawl, Perplexity API | Account research at scale |
| Analytics | CRM reporting, Metabase, custom dashboards | Track what matters |

You have the budget and focus to use the right tool for each job. Document every integration in `engine/` so the agent knows how to use them.

## Folder Structure

Build the full GTM-OS. Every section, every file:

```
gtm-os/
  CLAUDE.md               ← Your company context, rules, voice
  demand/
    icp.md                ← Complete ICP with scoring model
    positioning.md        ← Full positioning and messaging hierarchy
    competitors.md        ← Every competitor you encounter
    objections.md         ← Objection handling playbook
    signals.md            ← Buying signals mapped to actions
  messaging/
    attack-angles.md      ← 5+ tested angles with performance data
  segments/
    enterprise.md         ← Segment definitions with criteria
    mid-market.md
    [segment-name].md
  engine/
    hubspot.md            ← CRM integration docs
    apollo.md             ← Enrichment docs
    outreach.md           ← Sequencing docs
    exa.md                ← Research tool docs
    _tool-template.md     ← Template for adding new tools
    prompts/              ← GTM-specific prompts
  campaigns/
    active/
      q1-enterprise-push.md
      [campaign-name].md
  content/
    pipeline.md           ← Content calendar and ideas
    assets/               ← Reusable content pieces
  scripts/
    enrich.py             ← Enrichment pipeline
    sync.py               ← CRM sync scripts
    report.py             ← Reporting automation
  status.md               ← Current priorities and blockers
  log.md                  ← Decision log with dates and reasoning
```

## First Week Priorities

### Day 1-2: Audit current tools
Document every tool in your stack using `engine/_tool-template.md`. Include: what it does, how to authenticate, common API calls, rate limits, quirks. This is your agent's reference manual.

### Day 3-4: Fill in complete ICP
Don't just sketch it — complete every field in `demand/icp.md`. Add the scoring model. Include disqualification criteria. Talk to your sales team. Look at your last 20 closed-won deals for patterns.

### Day 5: Map buying signals
Open `demand/signals.md`. Map every signal you can detect to a specific action. High-intent signals get fast-tracked. Trigger events get outbound within 48 hours. Negative signals get deprioritized. Every signal should have an owner and a playbook.

### Day 6-7: Build first automated pipeline
Pick your highest-value manual process and automate it. Common first automations:
- Enrichment pipeline: CSV in, enriched CSV out
- New lead routing: trigger event detected, CRM updated, sequence started
- Weekly reporting: pull CRM data, calculate metrics, generate report

## What Makes This Mode Different

You have the time and focus to do what others can't:

- **Build feedback loops.** Track which attack angles get replies. Feed performance data back into your messaging. Iterate weekly, not quarterly.
- **Integrate tools properly.** Don't just use tools — connect them. CRM syncs with enrichment. Enrichment feeds sequencing. Sequencing reports feed back to strategy.
- **Automate the boring parts.** List building, enrichment, CRM data entry, reporting — these should run on scripts, not manual effort. Save your brain for strategy and personalization.
- **Go deep on accounts.** With research APIs like Exa, you can build rich account profiles automatically. Use that depth for better personalization, not just higher volume.

## Metrics to Track

Set these up in week two:

| Metric | Source | Cadence |
|--------|--------|---------|
| Emails sent | Sequencing tool | Weekly |
| Reply rate by attack angle | Sequencing + CRM | Weekly |
| Meetings booked | CRM | Weekly |
| Pipeline generated ($) | CRM | Monthly |
| Win rate by segment | CRM | Monthly |
| Cost per meeting | All tools | Monthly |

## Learning Path

Read these chapters in this order:

1. **Chapter 02** — Context Engineering (build a workspace the agent can actually use)
2. **Chapter 04** — Tool Integration (connect your stack)
3. **Chapter 06** — Feedback Loops (the thing that separates good from great)
4. **Chapter 07** — Target Lists and Enrichment (build better lists)
5. **Chapter 08** — Campaign Execution (run and measure campaigns)

---

*You're not just doing GTM — you're building a GTM engine. The difference is that an engine runs without you pushing it every day.*
