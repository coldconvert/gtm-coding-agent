# [Tool Name]

## Overview
- **Category:** [CRM / Enrichment / Sequencing / Research / Analytics / Content]
- **Integration type:** [OAuth / CLI / API]
- **Cost:** [Pricing tier you're on]
- **Documentation:** [Link to API docs]

## Authentication
- **Auth method:** [API key / OAuth / Token]
- **Where stored:** [e.g., .env, system keychain]
- **Key name:** `[ENV_VAR_NAME]`

## Common Operations

### [Operation 1 — e.g., "Search contacts"]
```bash
# CLI example or API call
curl -X GET "https://api.tool.com/v1/contacts" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json"
```

### [Operation 2 — e.g., "Enrich company"]
```python
# Python example
import requests

def enrich_company(domain):
    response = requests.get(
        "https://api.tool.com/v1/companies",
        params={"domain": domain},
        headers={"Authorization": f"Bearer {API_KEY}"}
    )
    return response.json()
```

## Rate Limits
- [Requests per minute/hour]
- [Daily quota]
- [How to handle rate limiting in scripts]

## Notes
- [Quirks, gotchas, known issues]
- [Best practices for this tool]
