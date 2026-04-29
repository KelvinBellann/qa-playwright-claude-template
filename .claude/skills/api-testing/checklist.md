# API Testing Checklist

- confirm endpoint ownership and business rule under change
- update service class if request flow changed
- update OpenAPI if status code or response body changed
- add happy-path test only if it proves new behavior
- add high-value negative path when risk is auth, validation, or contract drift
- keep payloads minimal
- validate contract through `ContractService`
- run `npm run test:api`
