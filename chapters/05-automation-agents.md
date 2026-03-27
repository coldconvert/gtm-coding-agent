# Chapter 05: Automation Agents

**The difference between a GTM operator who works 60 hours a week and one who works 20 isn't talent — it's automation. Every manual task you repeat is a script you haven't written yet.**

---

## The Automation Spectrum

Not everything needs to be automated, and not everything needs a fancy platform. The trick is knowing where your workflow sits on the spectrum and picking the right tool for that level.

```
Manual          Scheduled         Event-Driven       Always-On
─────────────────────────────────────────────────────────────
You do it       Script runs        Webhook fires       Agent watches
every time      on a timer         and triggers         continuously
                                   a workflow

Cost:  $0       Cost: $0           Cost: $0-25/mo      Cost: $25-200/mo
Setup: None     Setup: 10 min      Setup: 1-2 hours    Setup: Half day
```

Most GTM operators jump straight to "always-on" platforms because that's what vendors sell. In reality, 80% of GTM automation is just scheduled scripts. Start at the left and move right only when you need to.

---

## Level 1: cron and launchd — Free, Simple, Powerful

`cron` (Linux) and `launchd` (macOS) are built-in task schedulers. They run scripts at times you specify. No servers. No platforms. No monthly bill.

If your Mac is on, your scripts run. That's it.

**What GTM tasks work with scheduled scripts:**

- **Daily enrichment:** Pull new contacts from your CRM at 6am, enrich them with Apollo, push results back by 7am.
- **Weekly reports:** Every Monday at 8am, query your database, generate a pipeline report, email it to yourself.
- **Scheduled outbound:** Send email sequences at optimal times. (Your script calls the Instantly or Smartlead API.)
- **Content publishing:** Draft posts during the week, auto-publish on a schedule.
- **Data hygiene:** Every night, deduplicate contacts, flag stale records, update lead scores.

**Example: A daily enrichment script scheduled with cron.**

```bash
# Edit your crontab
crontab -e

# Run enrichment every day at 6:00 AM
0 6 * * * cd /Users/you/gtm-os && python3 scripts/daily_enrich.py >> logs/enrich.log 2>&1
```

That's a complete automation. The script runs at 6am, enriches new contacts, logs the output. If it fails, you check the log. No platform needed.

**cron schedule cheat sheet:**

```
┌───────────── minute (0-59)
│ ┌─────────── hour (0-23)
│ │ ┌───────── day of month (1-31)
│ │ │ ┌─────── month (1-12)
│ │ │ │ ┌───── day of week (0-6, Sunday=0)
│ │ │ │ │
* * * * *

0 6 * * *      → Every day at 6:00 AM
0 */4 * * *    → Every 4 hours
0 8 * * 1      → Every Monday at 8:00 AM
0 9 1 * *      → First of every month at 9:00 AM
*/15 * * * *   → Every 15 minutes
```

On macOS, `launchd` is the preferred scheduler (Chapter 06 covers it in detail). But if you know cron, the concepts are identical.

---

## Level 2: n8n — Visual Workflows, Self-Hosted

When cron breaks down — when you need branching logic, error handling across steps, or webhook triggers — n8n is the next step.

n8n is a self-hosted workflow automation platform. Think Zapier, but you own it. It runs on your machine or a $5/month VPS, and you build workflows with a visual drag-and-drop interface.

**When to reach for n8n:**

- You need to process inbound webhooks (a form submission triggers enrichment + CRM update + Slack notification)
- Your workflow has conditional branches ("if lead score > 80, add to sequence A; else, add to sequence B")
- You want visual debugging — see exactly where a workflow failed
- Non-technical team members need to understand or modify the workflow

**Example n8n GTM workflow:**

```
New form submission (webhook)
  → Enrich contact (Apollo API)
  → Score the lead (custom logic)
  → Branch:
      Score > 80 → Add to HubSpot "hot leads" list + Slack alert
      Score 50-80 → Add to nurture sequence
      Score < 50 → Log and skip
```

Building this in n8n takes about an hour. Building it in pure Python scripts takes longer and is harder to debug visually.

**Cost:** Free if self-hosted on your Mac. $5/month if you run it on a VPS. Compare that to Zapier at $50-200/month.

**Install:**

```bash
# Run n8n locally with Docker
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n

# Open http://localhost:5678
```

---

## Level 3: Trigger.dev — Code-First Automation

Trigger.dev sits between "write everything from scratch" and "use a visual platform." It's a code-first automation framework built on TypeScript. You define workflows in code, version control them with git, test them locally, and deploy to their cloud.

**When to reach for Trigger.dev:**

- You want your automation logic in version-controlled code, not locked in a platform
- You're building complex TypeScript workflows with typed data flowing between steps
- You need built-in retry logic, scheduling, and observability
- You want to test automations locally before deploying

**Example: A Trigger.dev GTM workflow.**

```typescript
import { task, schedules } from "@trigger.dev/sdk/v3";

export const dailyEnrichment = schedules.task({
  id: "daily-enrichment",
  cron: "0 6 * * *",  // 6 AM daily
  run: async () => {
    // Pull new contacts from CRM
    const newContacts = await fetchNewContacts();

    // Enrich each one
    const enriched = await Promise.all(
      newContacts.map(contact => enrichContact(contact.email))
    );

    // Update CRM with enriched data
    await updateCRM(enriched);

    return { processed: enriched.length };
  },
});
```

**Cost:** Free tier handles most GTM use cases. Paid starts at $25/month for higher volume.

---

## When cron Is Enough (Most of the Time)

Here's the honest truth: for 80% of GTM automation, cron is enough. Let me prove it.

| GTM Task | Needs Webhooks? | Needs Branching? | cron Works? |
|----------|----------------|-------------------|-------------|
| Daily list pull from CRM | No | No | Yes |
| Weekly pipeline report | No | No | Yes |
| Scheduled email sequences | No | No | Yes |
| Lead scoring batch job | No | Simple scoring logic lives in the script | Yes |
| Content publishing on schedule | No | No | Yes |
| Database cleanup / dedup | No | No | Yes |
| Enrichment of new contacts | No | No | Yes |

All of these are "run a script at a time." Cron does that perfectly.

**When cron breaks down:**

- **Real-time webhook processing:** A form submission or Stripe payment needs to trigger something immediately. Cron doesn't do "when X happens." It does "at time Y."
- **Complex branching with visual debugging:** When your workflow has 5+ conditional paths and you need to see where a specific record went wrong.
- **Retry logic with backoff:** Your enrichment API is flaky and you need automatic retries with exponential backoff. You can build this in Python, but platforms give it to you for free.
- **Team collaboration:** Non-technical team members need to see, understand, or modify the workflow.

If none of these apply, stick with cron. Seriously. Every platform you add is another thing to maintain, another login, another potential point of failure.

---

## Cost Comparison

| Solution | Monthly Cost | Setup Time | Best For |
|----------|-------------|------------|----------|
| cron / launchd | $0 | 10 minutes | Scheduled scripts, batch jobs |
| n8n (self-hosted) | $0-5/mo | 1-2 hours | Webhook flows, visual branching |
| Trigger.dev | $0-25/mo | 2-3 hours | Code-first workflows, TypeScript |
| Zapier | $50-200/mo | 30 minutes | Non-technical users, quick prototypes |
| Make (Integromat) | $15-65/mo | 30 minutes | Visual workflows, cheaper than Zapier |

The pattern is clear: the more you can code, the less you pay. A GTM operator who can write Python scripts and schedule them with cron replaces $200/month in Zapier automations with $0.

---

## The Graduation Path

Start simple. Graduate when something breaks.

**Stage 1: cron + Python scripts**

You write scripts. They run on a schedule. Output goes to log files. You check logs when something seems off. This handles daily enrichment, weekly reports, scheduled sends, data cleanup.

**Stage 2: Add error notifications**

Your cron scripts now send you a Slack message or email when they fail. Still cron, but now you know immediately when something breaks instead of discovering it three days later.

```python
# At the end of your script
try:
    run_enrichment()
except Exception as e:
    send_slack_alert(f"Enrichment failed: {e}")
    raise
```

**Stage 3: Move webhook-triggered flows to n8n or Trigger.dev**

When you have a flow that must respond to an event in real time — a form submission, a payment, a CRM status change — that's when you move that specific flow to a platform. The rest stays in cron.

**Stage 4: Always-on agent (rarely needed)**

An always-on agent monitors something continuously — a Slack channel for questions, an email inbox for replies, a CRM for status changes. This is the most expensive and complex option. Most GTM operators never need it. When you do, you'll know — because you'll be checking something manually every 30 minutes and wishing it were automated.

---

## Exercise: Audit Your Manual GTM Tasks

List every GTM task you do manually on a recurring basis. For each one, answer:

1. Does it run on a schedule or in response to an event?
2. Does it need complex branching logic?
3. Does a non-technical person need to modify it?

| Task | Schedule or Event? | Branching? | Non-tech? | Solution |
|------|-------------------|------------|-----------|----------|
| _Example: Weekly report_ | Schedule (Monday) | No | No | cron |
| _Example: Form → CRM_ | Event (form submit) | Yes (scoring) | Yes | n8n |
| | | | | |
| | | | | |
| | | | | |

Fill in your tasks. You'll likely find that most of them are "schedule, no, no" — which means cron. The few that need more will tell you exactly which platform to reach for.

---

## Key Takeaways

- Start with cron. It's free, it's reliable, and it handles 80% of GTM automation.
- cron for schedules, n8n for webhooks + branching, Trigger.dev for code-first workflows.
- Zapier is $200/month for what a Python script and cron job do for free. Pay for platforms only when scripts genuinely can't do the job.
- The graduation path is real: cron → cron with error alerts → platform for webhook flows → always-on (maybe never).

---

**Next:** [Chapter 06 - Local-First GTM](./06-local-first-gtm.md) — Turn your Mac into a GTM server that runs 24/7 with launchd, SQLite, and git.
