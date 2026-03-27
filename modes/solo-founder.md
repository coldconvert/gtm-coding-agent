# Solo Founder Mode

**For:** One person doing all GTM. Probably also doing product, hiring, fundraising, and putting out fires.

---

## Philosophy

Maximum leverage, minimum setup. You don't need a complex system — you need a focused one. Every hour you spend on GTM infrastructure is an hour you're not selling, building, or talking to customers. So the system has to earn its keep fast.

Your advantage: you know your product and customer better than anyone. Your constraint: you have maybe 5-10 hours a week for GTM. This mode is built around that reality.

## Recommended Stack

| Tool | Purpose | Cost |
|------|---------|------|
| Claude Code | Your GTM operating system | Included in subscription |
| Python | Scripts for enrichment, automation | Free |
| HubSpot (free tier) | CRM — track deals and contacts | Free |
| Apollo (free tier) | Prospecting — find emails, build lists | Free (50 credits/mo) |
| LinkedIn (manual) | Research, warm outreach, content | Free |

That's it. Resist the urge to add tools. Every new tool is a new context switch, a new login, a new thing to maintain. You can add more later when you have traction and know what's actually bottlenecked.

## Folder Structure

Create a simplified GTM-OS. You don't need every folder — just the ones that matter week one:

```
gtm-os/
  demand/
    icp.md              ← Your target buyer. Fill this first.
    positioning.md      ← How you're different. Fill this second.
  messaging/
    attack-angles.md    ← Your opening moves. 3 angles minimum.
  segments/
    segment-01.md       ← Your first 100-person target list.
  engine/
    hubspot.md          ← CRM setup notes
    apollo.md           ← Prospecting tool notes
  content/              ← Only if you're doing content marketing.
    ideas.md
  status.md
  log.md
  CLAUDE.md
```

Skip `campaigns/active/`, skip multi-segment complexity, skip tool integrations beyond HubSpot and Apollo. You'll add those when you need them.

## First Week Priorities

Do these in order. Don't skip ahead.

### Day 1-2: Fill in your ICP
Open `gtm-os/demand/icp.md` and fill in every field. If you can't answer a field, that's a signal — you need to talk to more customers. Use the `prompts/icp-builder.md` prompt to help.

### Day 3: Write 3 attack angles
Open `gtm-os/messaging/attack-angles.md`. Each angle targets a specific pain point for a specific persona. Don't write what you think sounds good — write what your last 3 customers actually complained about before they bought.

### Day 4-5: Build a 100-person target list
Use Apollo's free tier to find 100 people who match your ICP. Export to CSV. Load into your segment file. Quality over quantity — 100 well-targeted prospects beats 1,000 random ones.

### Day 6-7: Write an email sequence
Use the `prompts/email-sequence.md` prompt. Write a 4-email sequence for your best attack angle. Send to your first 25 prospects. Track opens and replies manually if needed.

## What to Skip

- Complex automation pipelines (you don't have enough volume to justify them yet)
- Multi-segment campaigns (focus on one segment until you get traction)
- Tool integrations beyond 2-3 core tools (each integration is maintenance)
- Scoring models (you're sending 25-50 emails a week, not 500)
- Content repurposing workflows (unless content is your primary GTM motion)

## When to Graduate

You've outgrown Solo Founder Mode when:
- You're sending more than 100 emails per week and need automation
- You have a repeatable ICP and want to build multiple segments
- You're hiring someone to help with GTM
- You're spending more time on manual tasks than on strategy

At that point, move to **Single Client Mode** and build out the full GTM-OS.

## Learning Path

Read these chapters in this order:

1. **Chapter 01** — Coding Agents vs Editors (understand your tools)
2. **Chapter 02** — Context Engineering (build your workspace right)
3. **Chapter 07** — Target Lists and Enrichment (build better lists)
4. **Chapter 09** — Voice DNA (if you're doing content)

Skip the rest until you need them. You'll know when you do.

---

*The best GTM system for a solo founder is one that actually gets used. Keep it simple. Ship emails. Talk to customers. Iterate.*
