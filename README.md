# qa-playwright-claude-template

Production-ready QA automation template for lean UI, API, E2E, performance, and security coverage with Playwright, OpenAPI contracts, and concise Claude-oriented prompt helpers.

## Why this repository exists

This repository is designed for teams that want:

- small and deterministic suites
- contract-first API validation
- clean separation between UI, API, E2E, performance, and security
- prompt reuse with low token consumption
- a template that can scale without becoming noisy

## Architecture

| Area | Responsibility |
| --- | --- |
| `tests/ui` | narrow UI validation for critical screens only |
| `tests/api` | business rules and contract validation |
| `tests/e2e` | one-pass critical journeys without duplicating lower-level checks |
| `tests/security` | automated auth and header baseline |
| `tests/performance` | lightweight threshold checks for critical endpoints |
| `src/pages` | stable browser abstractions |
| `src/services` | business-facing API layer |
| `src/clients` | thin HTTP wrapper |
| `src/builders` | deterministic test data |
| `src/fixtures` | reusable Playwright fixtures |
| `src/ai` | concise prompt templates and builders |
| `config/openapi` | contract source for response validation |
| `config/environments` | environment-specific runtime values |
| `CLAUDE.md` + `.claude/` | Claude Code operating layer for project memory, rules, commands, skills, subagents, and hooks |

## Folder structure

```text
.
|-- .github/workflows
|-- config
|   |-- environments
|   |-- openapi
|   `-- test-config
|-- src
|   |-- ai
|   |-- builders
|   |-- clients
|   |-- fixtures
|   |-- pages
|   |-- services
|   `-- utils
`-- tests
    |-- api
    |-- e2e
    |-- performance
    |-- security
    `-- ui
```

## Stack

| Type | Tools |
| --- | --- |
| Runtime | Node.js 22, TypeScript |
| Functional automation | Playwright 1.59.1 |
| Contract validation | OpenAPI + lightweight schema validator |
| Performance | lightweight Node runner |
| Mock target | Express |
| CI | GitHub Actions |

## Core design decisions

| Decision | Reason |
| --- | --- |
| Small mock target inside the repo | keeps the template runnable without external infrastructure |
| OpenAPI loaded at runtime | enables shift-left contract checks without code generation overhead |
| Minimal HTTP client + services | keeps tests readable and change impact low |
| Page objects only for critical pages | avoids abstraction noise |
| Failure artifacts only on CI failure | keeps pipelines cheap and focused |
| Claude Code assets are versioned with the repo | gives the team shared prompts, rules, and QA operating standards without inflating main test code |

## Gitflow

This template now follows a Gitflow-friendly branch model:

| Branch | Purpose |
| --- | --- |
| `main` | stable release branch |
| `develop` | integration branch for ongoing work |
| `feature/*` | isolated feature or workflow changes |
| `release/*` | optional release hardening branch |
| `hotfix/*` | urgent production fix branch |

Recommended flow:

1. branch from `develop`
2. implement on `feature/*`
3. validate targeted suites
4. merge back into `develop`
5. promote `develop` into `main` when ready

## Claude optimization

Token usage is reduced in three ways:

1. Prompts are stored once in [prompt-templates.ts](./src/ai/prompt-templates.ts) and reused through [prompt-builder.ts](./src/ai/prompt-builder.ts).
2. Context is compacted, sorted, deduplicated, and clipped before prompt assembly.
3. The repository isolates intent by layer, so generated context can point only to the service, page, or test type that matters.

## Claude Code operating layer

The repository includes a project-scoped Claude Code structure based on the official Anthropic model for project memory, rules, skills, subagents, hooks, and MCP.

| Path | Purpose |
| --- | --- |
| [CLAUDE.md](./CLAUDE.md) | shared project memory and operating expectations |
| [CLAUDE.local.example.md](./CLAUDE.local.example.md) | starter for local-only instructions |
| [.mcp.json](./.mcp.json) | project-scoped MCP definition, intentionally empty until the team approves shared servers |
| [.claude/settings.json](./.claude/settings.json) | project permissions and hook configuration |
| [.claude/rules](./.claude/rules) | modular instructions loaded by path to reduce context noise |
| [.claude/commands/qa](./.claude/commands/qa) | slash-command prompts for test design, bug reporting, and regression decisions |
| [.claude/skills](./.claude/skills) | on-demand procedural playbooks plus checklists and patterns for API, security, and performance work |
| [.claude/agents](./.claude/agents) | custom subagents for review and implementation tasks |
| [.claude/hooks](./.claude/hooks) | automated quality gates, shell wrappers, and optional test-management sync |

Windows note:

- The inspirational `qa:command-name` naming style from many examples is adapted here as `.claude/commands/qa/*.md`, because `:` is not valid in Windows filenames.
- For local-only configuration, copy `CLAUDE.local.example.md` to `CLAUDE.local.md` and `.claude/settings.local.example.json` to `.claude/settings.local.json`.

## Shift-left implementation

| Capability | Implementation |
| --- | --- |
| Contract testing | [contract.service.ts](./src/services/contract.service.ts) loads [finance-api.json](./config/openapi/finance-api.json) and validates runtime responses |
| Schema validation | [schema-validator.ts](./src/utils/schema-validator.ts) |
| Pre-test validation | [preflight.ts](./src/utils/preflight.ts) auto-runs through fixtures |
| Deterministic data | builders + `/test/reset` state reset before every test |

## Shift-right implementation

| Capability | Implementation |
| --- | --- |
| Structured logging | [logger.ts](./src/utils/logger.ts) |
| Trace on failure only | [playwright.config.ts](./playwright.config.ts) |
| Feature flags | [feature-flags.ts](./src/utils/feature-flags.ts) + environment config |
| Environment-aware execution | [env.ts](./config/test-config/env.ts) |

## Install

```bash
npm ci
npx playwright install chromium firefox
```

## Run

```bash
npm run test:ui
npm run test:api
npm run test:e2e
npm run test:security
npm run perf:smoke
```

## Key scripts

| Script | Purpose |
| --- | --- |
| `npm run test:ui` | UI-only critical validation |
| `npm run test:api` | API rules + contracts |
| `npm run test:e2e` | core business journey |
| `npm run test:security` | baseline security checks |
| `npm run perf:smoke` | quick response-time threshold run |
| `npm run perf:load` | higher iteration threshold run |
| `npm run perf:stress` | upper-bound confidence run |
| `npm run ci` | local CI-equivalent command |

## CI

Two workflows are included:

- [ci.yml](./.github/workflows/ci.yml): parallel quality jobs with fail-fast strategy and failure-only artifacts
- [performance.yml](./.github/workflows/performance.yml): on-demand smoke/load/stress execution

## Example coverage

| Layer | Example |
| --- | --- |
| UI | [login.ui.spec.ts](./tests/ui/login.ui.spec.ts) |
| API | [transactions.api.spec.ts](./tests/api/transactions.api.spec.ts) |
| E2E | [critical-payment-journey.e2e.spec.ts](./tests/e2e/critical-payment-journey.e2e.spec.ts) |
| Security | [api-security.spec.ts](./tests/security/api-security.spec.ts) |
| Performance | [critical-endpoints.perf.ts](./tests/performance/critical-endpoints.perf.ts) |

## Next extensions

- plug a real service under the same contracts
- swap the mock store for seeded database fixtures
- add feature-level tags for selective CI execution
- connect prompt output to a governed review flow
