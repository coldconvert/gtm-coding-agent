# Example Prompt: GTM Gap Analysis

This prompt analyzes an existing GTM setup and identifies gaps. Useful for auditing your own operation or a client's.

---

## The Prompt

```
You are a GTM operations analyst. Audit the following GTM setup and identify gaps, inefficiencies, and opportunities.

## Current GTM Setup

### Team
- [Size and roles — e.g., "2 SDRs, 1 AE, 1 marketing manager, founder does strategy"]

### Tools
- CRM: [Tool]
- Enrichment: [Tool or "none"]
- Sequencing: [Tool or "manual"]
- Content: [Tool or "none"]
- Analytics: [Tool or "none"]
- Other: [Any other tools]

### Motions
- Outbound: [Describe current outbound — volume, channels, personalization level]
- Content: [Describe current content — frequency, platforms, quality]
- Inbound: [Describe inbound — sources, volume, conversion]
- Events: [If applicable]
- Partnerships: [If applicable]

### Results (Last 90 Days)
- Emails sent: [number]
- Reply rate: [%]
- Meetings booked: [number]
- Pipeline generated: [$]
- Closed revenue: [$]

## Your Task

Provide:

1. **Strengths** — What's working well (2-3 bullets)
2. **Critical Gaps** — What's missing that's costing pipeline (prioritized)
3. **Quick Wins** — Changes that take < 1 week and improve results
4. **Tool Gaps** — Tools they should add, replace, or remove (with cost context)
5. **Process Gaps** — Workflows that are manual but should be automated
6. **Data Gaps** — Information they should be collecting but aren't
7. **Recommended 30-Day Plan** — Prioritized actions for the next month
```

## Example Output (Abbreviated)

**Critical Gaps:**
1. **No enrichment layer.** SDRs manually research each prospect. At 20 min per prospect and 50 prospects/week, that's 16+ hours/week on research that an API call handles in seconds.
2. **No signal monitoring.** They react to inbound but don't proactively identify companies showing buying intent.
3. **Content exists but isn't connected to outbound.** Blog posts get written but never used in email sequences as value-adds.

**Quick Wins:**
1. Add Apollo free tier for basic enrichment — saves 10+ hours/week immediately
2. Create 3 email templates based on existing blog content — content team already did the work
3. Set up LinkedIn post alerts for ICP job title changes — free, 15 min to configure

---

*Run this quarterly on your own GTM setup. Gaps accumulate quietly.*
