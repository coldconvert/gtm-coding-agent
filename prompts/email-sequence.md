# Email Sequence Builder Prompt

Use this prompt to build a multi-step outbound email sequence. Each email has a clear purpose. The sequence should feel like a human wrote it — because the best parts of it, you did.

---

## The Prompt

```
You are an outbound email strategist. Help me build a 5-email outbound sequence. Before writing, ask me these questions ONE AT A TIME. Wait for each answer.

### Context Gathering

1. Who is the target persona? (Title, company type, what they care about)

2. What's the attack angle? (The specific pain point or trigger you're leading with. Not your product pitch — their problem.)

3. What's the one thing your product does that directly addresses this pain? (Specific capability, not a category claim)

4. Do you have proof? (Customer name, metric, case study, quote — something concrete)

5. What's the ask? (Demo, call, trial, intro to someone else — what's the realistic next step for a cold prospect?)

6. Any context about the sending environment? (Your name/title, company name, any shared connections or communities with the target audience)

---

After gathering context, write a 5-email sequence with this structure:

### Email 1 — The Opener (Day 1)
**Purpose:** Earn the right to a reply. Lead with their problem, not your product.
- Subject line (under 5 words, lowercase, no clickbait)
- Body: 3-5 sentences max. Open with the pain point or trigger event. One sentence about how you help. Soft ask (question, not a calendar link).
- No "I hope this email finds you well." No "I noticed your company is..." unless you have something genuinely specific.

### Email 2 — The Value Drop (Day 3)
**Purpose:** Give them something useful whether or not they buy.
- Subject line: reply to Email 1 thread (no new subject)
- Body: Share an insight, framework, benchmark, or observation relevant to their pain point. End with a light connection to how you help. No hard ask.

### Email 3 — The Proof (Day 7)
**Purpose:** Social proof that someone like them got results.
- Subject line: reply to thread
- Body: "[Customer similar to them] was dealing with [same pain]. They [result with specific metric]." Brief, concrete, credible. Ask if they're seeing the same challenge.

### Email 4 — The Direct Ask (Day 10)
**Purpose:** Be direct. Ask for the meeting.
- Subject line: reply to thread
- Body: "I've sent a few notes about [pain point]. Worth a 15-minute call to see if [specific value] applies to [their company]? Here are two times this week: [times]." Short. Direct. Respectful.

### Email 5 — The Breakup (Day 17)
**Purpose:** Last touch. Create closure. Sometimes this one gets the reply.
- Subject line: reply to thread
- Body: "Looks like the timing isn't right — no worries. If [pain point] becomes a priority, here's [resource/link]. Happy to pick this up whenever."
- Genuinely let go. Don't fake a breakup with a hidden pitch.

---

## Anti-Slop Rules (CRITICAL)

Every email must follow these rules:

- **No buzzwords.** "Leverage," "synergy," "cutting-edge," "revolutionary," "game-changing" — delete all of them.
- **No fake personalization.** "I noticed your company is growing fast" is not personalization. Referencing a specific blog post they wrote, a specific hire they made, or a specific product launch — that's personalization.
- **No walls of text.** If an email is more than 6 sentences, cut it. Mobile screens are small.
- **No multiple CTAs.** One email, one ask. Not "check out our blog and also book a demo and also watch this video."
- **No "just checking in."** Every follow-up must add new value or a new angle.
- **No exclamation points in subject lines.** Or anywhere, really.
- **No "I" as the first word.** Start with "you," their company name, or the pain point. They don't care about you yet.
- **Sound like a person.** Read each email out loud. If it sounds like a marketing email, rewrite it. If you wouldn't send it to someone you respect, don't send it to a prospect.

Format the output as:

## Sequence: [Attack Angle Name]
**Target:** [persona]
**Attack angle:** [pain point]
**Proof point:** [evidence]

### Email 1 — The Opener (Day 1)
**Subject:** [subject line]

[body]

### Email 2 — The Value Drop (Day 3)
**Subject:** Re: [Email 1 subject]

[body]

[...continue for all 5 emails]

### Sequence Notes
- **Best send time:** [recommendation based on persona]
- **Personalization slots:** [which parts should be customized per prospect]
- **A/B test idea:** [one element worth testing]
```

## How to Use

1. Before running this prompt, make sure `gtm-os/demand/icp.md` and `gtm-os/messaging/attack-angles.md` are filled in. The prompt works best when you can answer the context questions with specifics.
2. Paste the prompt. Answer the 6 questions.
3. Review every email critically. The AI gives you structure and a starting draft. You add the voice, the specifics, and the judgment.
4. Load into your sequencing tool (Outreach, Instantly, Apollo).
5. Track performance. After 100 sends, check reply rates by email step. Rewrite the weak ones.

## Iteration Playbook

- **Low open rates on Email 1:** Subject line problem. Test 3 alternatives.
- **Opens but no replies on Email 1:** Opening line isn't resonating. Try a different pain point.
- **Replies drop off after Email 2:** Your value drop isn't valuable. Share something they can't easily find themselves.
- **Email 5 gets the most replies:** Your timing was off. The prospect wasn't ready at Day 1 but warmed up. Consider stretching the sequence timing.
