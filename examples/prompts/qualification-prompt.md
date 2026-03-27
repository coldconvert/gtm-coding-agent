# Example Prompt: Account Qualification

This is an anonymized example of a prompt used to qualify whether a target account fits the ICP. Adapt it to your own ICP criteria.

---

## The Prompt

```
You are a GTM research analyst. Your job is to evaluate whether a company fits our ICP and provide a qualification score.

## Our ICP Criteria
- Industry: B2B SaaS
- Size: 50-500 employees
- Revenue: $5M-$50M ARR (estimate from headcount if not public)
- Must use: a data warehouse (Snowflake, BigQuery, or Redshift)
- Must have: 10+ SaaS tools in their stack
- Bonus signals: recently hired data engineers, Series B+ funded, posted about data challenges

## Disqualifiers
- Under 50 employees
- No data warehouse detected
- 5+ person data engineering team (they'll build in-house)

## Your Task
Research the following company and provide:

1. **Company Overview** (2-3 sentences)
2. **ICP Fit Score** (1-10 with reasoning)
3. **Signals Found** (list each signal and source)
4. **Disqualifiers Found** (if any)
5. **Recommended Action:** Pursue / Nurture / Disqualify
6. **Recommended Attack Angle** (which pain point to lead with)
7. **Key Person to Contact** (name, title, and why them)

Company to evaluate: [COMPANY NAME OR DOMAIN]
```

## Example Output

**Company:** Acme Analytics (acmeanalytics.com)

1. **Overview:** Acme Analytics is a Series B analytics platform with ~120 employees. They help e-commerce brands track marketing attribution. Based in Austin, TX.

2. **ICP Fit Score:** 8/10 — Strong fit. Right size, right stage, data-intensive product.

3. **Signals Found:**
   - Uses Snowflake (confirmed via job posting for "Snowflake Admin")
   - 15+ tools on BuiltWith (Salesforce, Marketo, Segment, Amplitude, etc.)
   - Hired 2 data engineers in last 3 months (LinkedIn)
   - Series B: $25M raised 8 months ago (Crunchbase)
   - CTO posted on LinkedIn about "the hidden cost of maintaining internal ETL"

4. **Disqualifiers:** None found.

5. **Recommended Action:** Pursue — high priority.

6. **Attack Angle:** The CTO's own LinkedIn post about ETL maintenance cost. Lead with "saw your post about ETL costs — we hear this from every Series B data company."

7. **Key Person:** Sarah Kim, VP of Engineering. She oversees the data team and would feel the pipeline maintenance pain daily. CTO (James Adler) is the economic buyer but Sarah is the champion.

---

*Adapt the ICP criteria section to match your actual ICP. The output structure stays the same.*
