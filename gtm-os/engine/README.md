# Engine — Tool Integrations

This folder documents the tools in your GTM stack and how they connect.

## Adding a Tool

Use `_tool-template.md` as your starting point. Each tool gets its own file.

## Integration Types (see Chapter 04)
- **OAuth / Native:** Tool has an MCP server or built-in integration
- **CLI:** Tool has a command-line interface you can script
- **API:** REST/GraphQL API you call from Python scripts

## Common Stack

| Category | Common Tools | Integration Type |
|----------|-------------|-----------------|
| CRM | HubSpot, Salesforce | OAuth / API |
| Enrichment | Apollo, Clay, Clearbit | API |
| Sequencing | Outreach, Apollo, Instantly | API |
| Research | Exa, Firecrawl, Perplexity | API |
| Analytics | PostHog, Mixpanel, GA4 | API |
| Content | WordPress, Ghost, Webflow | API / CLI |
