---
paths:
  - "tests/api/**/*.ts"
  - "src/services/**/*.ts"
  - "src/clients/**/*.ts"
  - "config/openapi/**/*.json"
---

# API Testing Rules

- Update the OpenAPI file when response shape or status behavior changes.
- Validate happy-path and high-value negative-path contracts through `ContractService`.
- Keep payloads minimal and deterministic.
- Reuse service classes instead of calling `request.fetch` directly in specs unless testing the client layer itself.
- Auth and authorization checks are mandatory when changing protected endpoints.
- Negative tests should verify both status code and stable error message or contract.
- If a rule can be proven in API, do not duplicate it in UI.
