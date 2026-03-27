# Signal Mapping Prompt

Use this prompt to map buying signals to specific actions. The output goes into `gtm-os/demand/signals.md`.

---

## The Prompt

```
You are a demand generation strategist helping me map buying signals to actions. A signal without an action is just noise. Walk me through each category of signals, asking questions ONE AT A TIME. Wait for each answer.

### High-Intent Signals

These are signals that someone is actively evaluating or ready to buy.

1. What does a high-intent buyer look like for your product? What actions would they take if they were actively shopping? (e.g., visiting your pricing page, requesting a demo, downloading a comparison guide, asking about you on a community forum)

2. Where can you actually detect these signals? Be specific about the tool or data source. (e.g., website analytics shows pricing page visits, CRM shows demo requests, G2 shows category research)

3. For each signal you named: what should happen within 24 hours of detecting it? (e.g., SDR calls immediately, AE sends personalized email, auto-enroll in fast-track sequence)

### Trigger Events

These are external events that create a window of opportunity. The buyer may not be shopping yet, but something just changed that makes them more likely to need you.

4. What events at a target company would make them more likely to need your product? Think about: leadership changes, funding rounds, expansion, hiring patterns, competitor moves, regulatory changes, technology migrations.

5. Where can you monitor for these events? (e.g., LinkedIn for job changes, Crunchbase for funding, Google Alerts for news, job boards for hiring patterns, BuiltWith for tech changes)

6. For each trigger event: what's the playbook? How quickly do you need to respond, and with what message? (e.g., "New VP Sales hired → outbound within 2 weeks with 'first 90 days' angle")

### Negative Signals

These are signals that someone is NOT a good prospect right now. Detecting these saves time.

7. What signals tell you to walk away or deprioritize? (e.g., just signed a 2-year contract with a competitor, layoffs in the buying department, company is being acquired, no budget cycle for 6 months)

8. For each negative signal: is this a "walk away forever" or "come back in X months"? What goes in the CRM?

### Signal Sources

9. Categorize your signals by source:
   - **First-party** (your own data): website, email, product usage, support tickets
   - **Third-party** (external data): intent data providers, review sites, job boards, news
   - **Manual** (human observation): LinkedIn activity, conference attendance, community posts

---

After all questions are answered, produce the completed signal map in this exact format:

# Buying Signals

## High-Intent Signals
| Signal | Source | Action | Owner | SLA |
|--------|--------|--------|-------|-----|
| [signal] | [where detected] | [specific action] | [role] | [response time] |

## Trigger Events
| Event | Where to Monitor | Response Playbook | Timing |
|-------|-----------------|-------------------|--------|
| [event] | [monitoring source] | [specific response] | [how fast] |

## Negative Signals (Disqualify / Deprioritize)
| Signal | Meaning | Action |
|--------|---------|--------|
| [signal] | [what it means] | [walk away / nurture for X months / etc.] |

## Signal Sources
- **First-party:** [list with tools]
- **Third-party:** [list with providers]
- **Manual:** [list with processes]

## Automation Opportunities
[List any signals that could be detected and acted on automatically via scripts or tool integrations]

Every signal must have a specific action and owner. "Monitor" is not an action. "Send competitive positioning email within 48 hours" is an action.
```

## How to Use

1. Paste the prompt into Claude Code or any AI assistant.
2. Answer from experience. The best signals come from patterns you've already seen in won and lost deals.
3. Copy the output into `gtm-os/demand/signals.md`.
4. For each automation opportunity identified, create a task to build it (a Python script, a CRM workflow, or a Zapier automation).

## After the Workshop

Priority order for implementation:
1. Set up monitoring for your top 3 trigger events (even if it's just Google Alerts to start)
2. Build CRM workflows for high-intent signals (pricing page visits, demo requests)
3. Create templates for trigger event responses (so the response is fast and consistent)
4. Script what you can — `scripts/` folder in your GTM-OS is where automation lives
