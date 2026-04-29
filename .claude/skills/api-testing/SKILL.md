---
name: api-testing
description: Add or review API tests using a contract-first approach with minimal payloads and explicit business-rule coverage.
when_to_use: Use when creating or updating tests in tests/api, changing services or clients, or editing config/openapi.
allowed-tools: Read Glob Grep Edit MultiEdit Write Bash(npm run test:api) Bash(npm run typecheck)
---

You are working on the API test layer of this repository.

Follow this sequence:

1. Read `CLAUDE.md`, `.claude/rules/api-testing-rules.md`, and the affected API files.
2. Update or verify the relevant service class under `src/services/` and the contract in `config/openapi/finance-api.json`.
3. Keep test data small, deterministic, and builder-driven.
4. Add or update only the targeted API tests needed for the business rule or contract drift.
5. Run `npm run test:api` and `npm run typecheck`.

Success conditions:

- contract checked
- negative path covered where risk exists
- no duplicated UI/E2E assertions
