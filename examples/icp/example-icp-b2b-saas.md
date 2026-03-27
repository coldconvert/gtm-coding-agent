# Example ICP: DataSync (Fictional B2B SaaS)

This is a worked example of an ICP for a fictional company. Use it as a reference when building yours.

---

**Company:** DataSync — a data integration platform for mid-market SaaS companies.
**Product:** ETL pipeline builder with a visual UI. Connects SaaS tools to data warehouses.
**Price:** $500-2,000/mo depending on data volume.

---

## Company Characteristics
- **Industry:** B2B SaaS (selling to other software companies)
- **Company size:** 50-500 employees
- **Revenue range:** $5M-$50M ARR
- **Geography:** US and Western Europe (English-speaking for now)
- **Tech stack signals:** Uses Snowflake or BigQuery (they need a warehouse to pipe data into). Has 10+ SaaS tools (that's when manual data movement breaks).
- **Growth signals:** Just hired a Head of Data or Data Engineer. Series B+. Expanding analytics team.

## Buyer Personas

### Primary Buyer: VP of Engineering / Head of Data
- **Reports to:** CTO
- **Measured on:** Data pipeline reliability, time-to-insight, engineering team productivity
- **Day-to-day pain:** Engineers spend 30% of time maintaining custom data pipelines. Every new tool means another integration to build.
- **Strategic pain:** Can't move fast on analytics because the data layer is fragile. Board wants dashboards; team is debugging pipelines.
- **Trigger events:** New SaaS tool adopted (another integration needed), data incident (pipeline broke, bad data in dashboard), new data hire (fresh eyes on the mess).

### Champion: Senior Data Engineer
- **Why they care:** Tired of writing and maintaining custom ETL scripts. Wants to focus on modeling and analysis, not plumbing.
- **How they evaluate:** Wants a free trial. Will test with one pipeline. Needs to see it handle edge cases (schema changes, API rate limits). Cares about monitoring and alerts.

### Blocker: CTO
- **Their concern:** Security (where does data flow through?), cost (is this cheaper than the engineer hours we're spending?), vendor risk (what if DataSync goes down?).
- **How to address:** SOC2 Type II, architecture diagram showing data never stored (pass-through), ROI calculator comparing engineer hours vs. subscription cost.

## Disqualification Criteria
- No data warehouse (Snowflake, BigQuery, Redshift) — they're not ready for us
- Under $3M ARR — likely can't afford $500+/mo and have simpler data needs
- Only 2-3 SaaS tools — not enough pain yet
- Has a 5+ person data engineering team — they'll build in-house
- Currently in a build-vs-buy evaluation favoring build — come back in 6 months when the custom solution breaks

## Scoring

| Signal | Weight | Source |
|--------|--------|--------|
| Uses Snowflake or BigQuery | High | BuiltWith, job postings |
| Recently hired data engineer | High | LinkedIn job postings |
| Series B+ funding | Medium | Crunchbase |
| 10+ entries on StackShare/BuiltWith | Medium | BuiltWith |
| Posted about data pipeline issues | High | LinkedIn, Reddit, HN |
| Currently using Fivetran or Airbyte | Medium | BuiltWith (competitor signal — open to switching?) |
| Under 50 employees | Low (disqualify) | LinkedIn |

---

*This example shows the level of specificity you should aim for. Vague ICPs produce vague outreach. Specific ICPs produce relevant conversations.*
