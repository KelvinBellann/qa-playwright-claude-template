---
description: Produce a concise QA bug report from failing evidence or observed behavior.
disable-model-invocation: true
argument-hint: "[failure-or-symptom]"
allowed-tools: Read Glob Grep Bash(git status *) Bash(git diff *) Bash(npm run test:api) Bash(npm run test:security) Bash(npm run test:ui) Bash(npm run test:e2e)
---

Create a professional QA defect report for: $ARGUMENTS

Use `.claude/rules/defect-taxonomy.md` to classify the issue.

Required sections:

- Title
- Category
- Business impact
- Preconditions
- Steps to reproduce
- Expected result
- Actual result
- Evidence
- Suspected layer
- Recommended follow-up

Keep the report factual, compact, and reproducible.
