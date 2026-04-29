---
name: security-testing
description: Review or extend the automated security baseline for auth, headers, unsafe input, and access control.
when_to_use: Use when touching authentication, authorization, API validation, security headers, or tests/security.
allowed-tools: Read Glob Grep Edit MultiEdit Write Bash(npm run test:security) Bash(npm run test:api)
---

You are responsible for the automated security baseline.

Checklist:

1. Validate authentication and authorization behavior first.
2. Check for unsafe input handling, especially injection-like payloads.
3. Confirm stable security headers on browser-facing routes.
4. Prefer API-level proof over UI-level duplication.
5. Keep the suite lean and reproducible.

Always use the defect taxonomy category that best matches the risk if you surface an issue.
