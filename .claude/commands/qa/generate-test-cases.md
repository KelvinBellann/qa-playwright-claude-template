---
description: Generate lean QA test cases for a feature, story, or changed file set.
disable-model-invocation: true
argument-hint: "[feature-or-story]"
allowed-tools: Read Glob Grep Bash(git status *) Bash(git diff --name-only *)
---

Design a compact, high-signal test set for: $ARGUMENTS

Workflow:

1. Read `CLAUDE.md` and the relevant files.
2. Apply `.claude/rules/test-design.md` and `.claude/rules/api-testing-rules.md` when applicable.
3. Avoid duplicate coverage across UI, API, E2E, security, and performance.
4. Prefer the minimum set that proves the main business risks.

Output format:

- Assumptions
- Risk table with columns: `Risk`, `Layer`, `Why this layer`, `Priority`
- Final test list with short titles and coverage notes
- Explicit exclusions to show what is intentionally not being tested
