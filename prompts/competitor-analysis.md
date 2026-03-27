# Competitor Analysis Prompt

Use this prompt to analyze a competitor. Run it once per competitor, then paste the output into `gtm-os/demand/competitors.md` under a new section.

---

## The Prompt

```
You are a competitive intelligence analyst. I'm going to give you a competitor's name and website. Research them and help me fill out a competitive profile. Ask me clarifying questions where my firsthand knowledge would improve the analysis.

**Competitor:** [NAME]
**Website:** [URL]

Analyze this competitor across the following dimensions. For each one, use whatever you can determine from their website, pricing page, G2/Capterra reviews, and public information. Where you can't determine something, ask me — I probably have intel from deals.

### 1. What They Do
- One-sentence description of their product
- Primary use case
- Secondary use cases (if any)
- Who they're built for (their stated ICP)

### 2. Pricing
- Pricing model (per seat, per usage, flat rate, custom)
- Published price points (if available)
- Free tier? Trial?
- Known discounting behavior (ask me if you don't know)

### 3. Strengths
- What they genuinely do well (not what we wish they didn't)
- Where customers praise them (G2 reviews, testimonials)
- Market advantages (brand, funding, integrations, market share)

### 4. Weaknesses
- Known gaps or complaints (from reviews, churned customers)
- Where their product falls short
- Organizational weaknesses (slow shipping, poor support, etc.)

### 5. Their Ideal Customer
- Who gets the most value from their product
- What type of buyer loves them
- Where they win most often

### 6. How to Win Against Them
- Our advantages in head-to-head deals
- Positioning angles that work against them
- Questions to ask in a deal that expose their weaknesses
- Demo moments that highlight our differentiators

### 7. Common Objection and Response
- "Why not just use [COMPETITOR]?" — Draft a response that:
  - Acknowledges what they do well (credibility)
  - Pivots to where we're different (not "better" — different)
  - Ties it to what matters for this specific buyer
  - Ends with proof (customer story, metric, case study)

---

Format the output as:

### [Competitor Name]
- **What they do:** [one sentence]
- **Pricing:** [model and price points]
- **Strengths:** [bulleted list]
- **Weaknesses:** [bulleted list]
- **Their ideal customer:** [description]
- **How to win against them:** [bulleted list of tactics]
- **Common objection:** "Why not just use [Competitor]?"
- **Response:** [2-3 sentence response]

### Head-to-Head Comparison
| Dimension | Us | [Competitor] |
|-----------|-----|-------------|
| [key dimension 1] | | |
| [key dimension 2] | | |
| [key dimension 3] | | |
| [key dimension 4] | | |

### Kill Sheet (Quick Reference)
- **They win when:** [situation]
- **We win when:** [situation]
- **Best discovery question:** "[question that exposes their weakness]"
- **Proof point to use:** [specific customer story or metric]

Be direct. Don't soften the competitor's strengths or exaggerate their weaknesses. I need an honest assessment I can actually use in deals, not a pep talk.
```

## How to Use

1. Run this prompt once per major competitor (direct competitors first, then indirect).
2. Paste the output into `gtm-os/demand/competitors.md` under a new `###` section.
3. Update the competitive positioning matrix at the bottom of that file.
4. Revisit quarterly — competitors change, especially after funding rounds or product launches.

## Making It Better

- After running the prompt, add your own firsthand intel from lost deals. The AI can research public info, but you know what actually happened in the sales cycle.
- Ask your sales team: "When did we last lose to [Competitor]? What was the reason?" Those answers are worth more than any public analysis.
- If you have access to G2 reviews, Gartner reports, or competitor customer lists, feed those into the prompt for richer analysis.
