---
description: Recommend the smallest regression suite that still protects the changed scope.
disable-model-invocation: true
argument-hint: "[optional-scope]"
allowed-tools: Read Glob Grep Bash(git status *) Bash(git diff --name-only *) Bash(git diff --name-only HEAD)
---

Build a regression recommendation for: $ARGUMENTS

Rules:

- Read current changes first.
- Use the repository layer model: UI, API, E2E, security, performance.
- Recommend the minimum executable suite that covers the observed risk.
- Call out what can stay out of regression and why.

Output format:

- Changed scope
- Recommended suites
- Order of execution
- Risk if skipped
- Optional extended suite
