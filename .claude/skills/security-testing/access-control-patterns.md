# Access Control Patterns

## Best applications

- prove protected endpoints reject missing and forged tokens
- prove role or tenant checks at API level before UI level
- validate that protected pages fail safe when auth context is absent

## Common misses

- asserting only UI redirect without checking backend protection
- treating 401 and 403 interchangeably without intent
- missing negative-path contract validation for error responses
