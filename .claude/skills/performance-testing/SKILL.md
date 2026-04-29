---
name: performance-testing
description: Maintain the lightweight performance suite focused on critical endpoints, thresholds, and deterministic smoke validation.
when_to_use: Use when touching tests/performance, response-time thresholds, or business-critical endpoint flow.
allowed-tools: Read Glob Grep Edit MultiEdit Write Bash(npm run perf:smoke) Bash(npm run typecheck)
---

You are working on the performance layer.

Rules:

1. Keep the scope on critical endpoints only.
2. Prefer deterministic smoke and threshold validation over broad synthetic load.
3. Keep p95 and error-rate checks easy to understand from the output alone.
4. Reuse existing login and endpoint flow instead of creating new orchestration paths.
5. Document any threshold change in the README if it changes the operating expectations of the template.
