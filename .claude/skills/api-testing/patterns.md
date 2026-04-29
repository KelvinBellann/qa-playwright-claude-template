# API Testing Patterns

## Best applications

- Contract drift: update OpenAPI and assert response through `ContractService`
- Business validation: use a builder to shape the smallest payload that proves the rule
- Auth coverage: validate unauthorized and authorized flows with explicit status checks
- Service evolution: extend `src/services/` before adding direct request logic inside specs

## Anti-patterns

- duplicating UI assertions in API tests
- hardcoding large payloads inline
- testing every field in every test when the contract already proves the shape
