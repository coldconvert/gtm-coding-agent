# Agency Mode

**For:** Running GTM for multiple clients. Each client is a separate context, separate ICP, separate voice.

---

## Philosophy

Systems that replicate. Build once, deploy per client. Templates are everything.

The difference between an agency that scales and one that drowns is whether you're rebuilding from scratch for every client or stamping out a proven structure and customizing the 20% that matters. This mode is about building that stamp.

## Recommended Stack

| Tool | Purpose | Notes |
|------|---------|-------|
| Claude Code | Per-client GTM operating system | Open in client folder for instant context |
| Python | Enrichment, automation, reporting | Reusable scripts across clients |
| Per-client CRM | HubSpot, Salesforce, etc. | Whatever the client uses |
| Apollo / Clay | Enrichment | Multi-account or agency plans |
| Sequencing tool | Outreach, Instantly, Apollo | Per-client accounts |

Key constraint: most enrichment and sequencing tools charge per seat or per account. Plan your tool stack around multi-client access from day one, or you'll burn money on duplicate subscriptions.

## Folder Structure

```
clients/
  _template/              ← Master template. Copy for each new client.
    gtm-os/
      CLAUDE.md           ← Client-specific agent instructions
      demand/
        icp.md
        positioning.md
        competitors.md
        signals.md
      messaging/
        attack-angles.md
      segments/
        segment-01.md
      engine/
        README.md
      campaigns/
        active/
      status.md
      log.md
    scripts/               ← Client-specific automation
    reports/               ← Deliverables and reporting
      weekly-template.md

  acme-corp/              ← Client 1 (copied from _template/)
    gtm-os/
      CLAUDE.md           ← "You are the GTM agent for Acme Corp..."
      ...

  globex-inc/             ← Client 2
    gtm-os/
      CLAUDE.md
      ...

shared/
  prompts/                ← Reusable prompts across all clients
  scripts/                ← Shared Python scripts
  templates/              ← Report templates, onboarding checklists
```

The critical pattern: each client folder has its own `CLAUDE.md`. When you open Claude Code in `clients/acme-corp/`, the agent loads Acme's context — their ICP, their positioning, their voice. No context bleeding between clients. No "wait, which client are we talking about?"

## The Context-Switching Problem

This is the biggest challenge in agency GTM. You're context-switching between clients all day. The solution:

1. **Each client folder is self-contained.** Everything the agent needs is inside that folder.
2. **Open Claude Code in the client folder.** `cd clients/acme-corp && claude` — now you're in Acme's world.
3. **Never reference one client's files from another client's folder.** If something is shared, put it in `shared/`.
4. **Client CLAUDE.md includes identity.** The agent should know: company name, product, ICP summary, voice notes, active campaigns.

## First Week Priorities

### Day 1-2: Build the client template
Create `clients/_template/` with every file a new client needs. Fill in placeholder text that makes it obvious what to replace. This template is your most valuable asset.

### Day 3-4: Onboard first client using the template
Copy `_template/` to `clients/client-name/`. Fill in their specifics. Run through ICP, positioning, and attack angles with the client. This tests your template and reveals gaps.

### Day 5: Build reusable prompt library
Move prompts that work across clients into `shared/prompts/`. ICP builder, email sequence builder, competitor analysis — these should work for any client with minimal customization.

### Day 6-7: Create reporting template
Build `shared/templates/weekly-report.md` — a standard report format you deliver to every client. Include: emails sent, replies, meetings booked, pipeline generated, next week's plan.

## Client Onboarding Checklist

For each new client:

1. Copy `clients/_template/` to `clients/[client-name]/`
2. Fill in client CLAUDE.md (company, product, ICP summary)
3. Complete ICP workshop (use `prompts/icp-builder.md`)
4. Complete positioning workshop (use `prompts/positioning-workshop.md`)
5. Write 3 attack angles with client input
6. Document their tool stack in `engine/`
7. Build first segment
8. Write first email sequence
9. Launch first campaign
10. Set up reporting cadence

## Learning Path

Read these chapters in this order:

1. **Chapter 02** — Context Engineering (the foundation of per-client agent context)
2. **Chapter 04** — Tool Integration (you'll integrate many tools across clients)
3. **Chapter 07** — Target Lists and Enrichment (core deliverable for most clients)
4. **Chapter 08** — Campaign Execution (running the campaigns)
5. **Chapter 05** — Workflow Automation (scale what's working)

---

*The agency that wins is the one with the best systems, not the most clients. Build the template. Trust the template. Improve the template.*
