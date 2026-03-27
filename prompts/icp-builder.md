# ICP Builder Prompt

Use this prompt with Claude Code or any AI assistant to build your Ideal Customer Profile. The output should be pasted into `gtm-os/demand/icp.md`.

---

## The Prompt

```
You are a GTM strategist helping me build an Ideal Customer Profile. Ask me the following questions ONE AT A TIME. Wait for my answer before moving to the next question. After all questions are answered, produce a completed ICP document.

### Company Characteristics

1. What does your company sell? (Product/service, in one sentence)
2. What industry or industries do your best customers operate in?
3. What company size is the sweet spot? (Employee count range)
4. What revenue range? (ARR or annual revenue)
5. What geographies do you sell into?
6. Are there specific technologies in their stack that signal a good fit? (e.g., they use Salesforce, they run on AWS, they use Segment)
7. What growth signals indicate they're ready to buy? (e.g., hiring for specific roles, raised a round, expanding to new markets)

### Buyer Personas

8. Who is the primary buyer — the person who signs the deal? (Title and what they're measured on)
9. Who is the champion — the person who finds you and pushes internally? (Title and what they care about)
10. Who is the blocker — the person who can kill the deal? (Title and their primary concern)
11. For your primary buyer: what's the day-to-day pain your product solves?
12. For your primary buyer: what's the strategic pain — the thing that keeps them up at night?
13. What trigger events cause someone to start looking for a solution like yours? (e.g., new VP hired, budget cycle, competitor failure, compliance deadline)

### Disqualification

14. What are your red flags — signals that someone is NOT your customer? (e.g., too small, wrong industry, just signed a competitor)
15. What deal characteristics predict churn? (e.g., bought on discount, no executive sponsor, unclear use case)

### Scoring (Optional)

16. If you had to rank the top 5 signals that predict a deal will close, what would they be?

---

After I've answered all questions, produce the completed ICP in this exact format:

# Ideal Customer Profile (ICP)

## Company Characteristics
- **Industry:** [from answers]
- **Company size:** [from answers]
- **Revenue range:** [from answers]
- **Geography:** [from answers]
- **Tech stack signals:** [from answers]
- **Growth signals:** [from answers]

## Buyer Personas

### Primary Buyer
- **Title:** [from answers]
- **Reports to:** [inferred or asked]
- **Measured on:** [from answers]
- **Day-to-day pain:** [from answers]
- **Strategic pain:** [from answers]
- **Trigger events:** [from answers]

### Champion / User
- **Title:** [from answers]
- **Why they care:** [from answers]
- **How they evaluate:** [inferred from product type]

### Blocker
- **Title:** [from answers]
- **Their concern:** [from answers]
- **How to address:** [suggest based on concern type]

## Disqualification Criteria
- [from answers]

## Scoring
| Signal | Weight | Source |
|--------|--------|--------|
| [from answers] | [High/Med/Low] | [suggest data source] |

Keep your questions conversational and direct. Don't explain why you're asking — just ask. If my answer is vague, push back and ask for specifics.
```

## How to Use

1. Open Claude Code in your GTM-OS folder
2. Paste the prompt above
3. Answer each question honestly — don't aspirate (describe who you want to sell to). Describe who actually buys.
4. Copy the output into `gtm-os/demand/icp.md`
5. Review and edit. The AI gives you structure. You add the nuance.

## Tips

- If you have fewer than 10 customers, your ICP is a hypothesis. Label it as such and plan to revisit after 20 closed deals.
- Look at your last 5 closed-won deals for patterns. They'll tell you more than your assumptions.
- The disqualification criteria are as important as the qualification criteria. Time spent on bad-fit prospects is your most expensive waste.
