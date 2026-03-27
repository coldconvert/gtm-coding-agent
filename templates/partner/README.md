# Partner / Client Folder Template

For agencies and consultants managing GTM for multiple clients. Each client gets their own folder with this structure.

## Setup

```
clients/
├── client-name/
│   ├── CLAUDE.md          # Client-specific AI instructions
│   ├── icp.md             # Their ideal customer profile
│   ├── positioning.md     # Their positioning
│   └── campaigns/         # Active campaign tracking
│       └── active/
```

## How to Use

1. Copy this template folder for each new client
2. Fill in `CLAUDE.md` with client context (see template below)
3. Open Claude Code in the client's folder — it automatically loads their context
4. Each client is an isolated context. No cross-contamination.

## Client CLAUDE.md Template

```markdown
# [Client Name] — GTM Operating Instructions

## Client Overview
- **Company:** [Name]
- **Product:** [What they sell]
- **ICP:** [One-line description]
- **Our scope:** [What we're doing for them]
- **Contract:** [Retainer / project / performance]
- **Primary contact:** [Name + role]

## Active Workstreams
- [ ] [Workstream 1]
- [ ] [Workstream 2]

## Tools (their stack)
- CRM: [Tool]
- Sequencing: [Tool]
- Enrichment: [Tool]

## Rules
- Never mix this client's data with other clients
- All content must be approved before publishing
- Use their brand voice, not yours
- Report format: [weekly email / shared doc / dashboard]
```

## Billing / Tracking (Optional)
Track hours or deliverables in a `tracking.md` file per client:

```markdown
# [Client Name] — Tracking

## March 2026
| Date | Hours | Deliverable |
|------|-------|------------|
| 03-01 | 2.0 | ICP workshop |
| 03-03 | 1.5 | Email sequence v1 |
```
