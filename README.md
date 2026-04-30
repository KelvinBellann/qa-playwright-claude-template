# qa-playwright-claude-template

Production-ready QA automation template combining Playwright, OpenAPI contract validation, lightweight performance checks, and Claude-assisted workflows. Designed for lean, deterministic, and maintainable test suites at scale.

## Why this repository exists

Teams that want to automate quality without accumulating noise need a framework that:

- keeps suites small and deterministic
- validates contracts before they drift
- separates UI, API, E2E, security, and performance concerns cleanly
- ships shared QA standards through version-controlled Claude Code assets
- stays runnable without external infrastructure dependencies

This template provides all of that out of the box, backed by a running mock server so every test works from a fresh clone.

---

## Architecture

```
tests/
  ui/           — critical screen validation only
  api/          — contract + business rule + boundary checks
  e2e/          — one-pass critical journeys
  security/     — auth bypass, header baseline, injection detection
  performance/  — p95 threshold smoke and load checks

src/
  pages/        — stable browser page objects (data-testid only)
  services/     — business-facing API layer
  clients/      — thin HTTP wrapper
  builders/     — deterministic, fluent test data builders
  fixtures/     — reusable Playwright fixtures
  ai/           — concise prompt templates and builder
  utils/        — mock server, schema validator, logger, feature flags

config/
  openapi/      — OpenAPI contract source of truth
  environments/ — runtime environment values
  test-config/  — defaults, token budgets, env loading

.claude/
  rules/        — modular QA instructions loaded by path
  commands/qa/  — slash-command prompts for repeatable QA tasks
  skills/       — procedural playbooks for API, security, performance
  agents/       — custom subagents for review and implementation
  hooks/        — automated quality gates (format + coverage)
```

---

## Test layer responsibilities

| Layer | What it proves | What it does not repeat |
| --- | --- | --- |
| `tests/ui` | Critical screens render and interact correctly | Business rules already covered at API layer |
| `tests/api` | Contracts, business rules, boundary values, negative paths | UI rendering details |
| `tests/e2e` | End-to-end critical journey works from UI to data | Every API rule (trusts API suite) |
| `tests/security` | Auth, token validation, security headers, injection rejection | Business logic |
| `tests/performance` | p95 thresholds and error rates on critical endpoints | Functional correctness |

---

## Test tagging

Tests are annotated with semantic tags for selective execution:

| Tag | Meaning |
| --- | --- |
| `@smoke` | fast pre-deploy gate — run on every push |
| `@critical` | core business path — must never regress |
| `@regression` | full regression coverage — run before release |
| `@boundary` | boundary value and equivalence partition tests |
| `@contract` | OpenAPI contract shape and status validation |
| `@security` | auth, token, header, and injection checks |

---

## Stack

| Area | Tool |
| --- | --- |
| Runtime | Node.js 22, TypeScript (strict, ESM) |
| Functional automation | Playwright 1.59.1 |
| Contract validation | OpenAPI JSON + lightweight schema validator |
| Performance | Node runner with p95 and error rate thresholds |
| Mock server | Express 5 with in-memory state and security headers |
| CI | GitHub Actions (parallel jobs, failure-only artifacts) |
| QA assistant | Claude Code with versioned rules, skills, and subagents |

---

## Core design decisions

| Decision | Reason |
| --- | --- |
| Mock server inside the repo | Runnable from a fresh clone, no external dependencies |
| OpenAPI loaded at runtime | Shift-left contract checks without code-generation overhead |
| State reset before every test | Deterministic — no inter-test pollution |
| Builders over inline data | Readable, reusable, change-resilient |
| Page objects only for critical pages | Avoids abstraction noise on low-risk screens |
| Failure artifacts only on CI failure | Cheap pipelines, focused diagnostics |
| Claude assets versioned with code | Shared prompts, rules, and QA standards for the whole team |

---

## Shift-left implementation

| Capability | Implementation |
| --- | --- |
| Contract testing | [contract.service.ts](./src/services/contract.service.ts) validates runtime responses against [finance-api.json](./config/openapi/finance-api.json) |
| Schema validation | [schema-validator.ts](./src/utils/schema-validator.ts) — recursive property and array validation |
| Pre-test validation | [preflight.ts](./src/utils/preflight.ts) — checks BASE_URL and OpenAPI file before any test runs |
| Deterministic data | Builders + `/test/reset` endpoint resets in-memory state before every test |
| Input validation | Mock server rejects SQL/script injection at the API boundary |

---

## Shift-right implementation

| Capability | Implementation |
| --- | --- |
| Structured logging | [logger.ts](./src/utils/logger.ts) — JSON events with level, event name, and duration |
| Trace on failure only | [playwright.config.ts](./playwright.config.ts) — `retain-on-failure` |
| Feature flags | [feature-flags.ts](./src/utils/feature-flags.ts) + [environments/](./config/environments/) |
| Environment-aware execution | [env.ts](./config/test-config/env.ts) — runtime env loading with defaults |
| Performance thresholds | [critical-endpoints.perf.ts](./tests/performance/critical-endpoints.perf.ts) — p95, error rate, 3 profiles |

---

## Gitflow

| Branch | Purpose |
| --- | --- |
| `main` | stable release branch |
| `develop` | integration branch for ongoing work |
| `feature/*` | isolated feature or workflow changes |
| `release/*` | optional release hardening branch |
| `hotfix/*` | urgent production fix branch |

**Recommended flow:**

```bash
git checkout develop
git checkout -b feature/my-change
# implement + validate targeted suite
git push origin feature/my-change
# open PR → develop
# promote develop → main when ready
```

---

## Claude Code operating layer

| Path | Purpose |
| --- | --- |
| [CLAUDE.md](./CLAUDE.md) | Shared project memory and operating expectations |
| [CLAUDE.local.example.md](./CLAUDE.local.example.md) | Starter for personal-only instructions |
| [.mcp.json](./.mcp.json) | Project-scoped MCP definition (intentionally empty until the team approves shared servers) |
| [.claude/settings.json](./.claude/settings.json) | Project permissions and hook configuration |
| [.claude/rules/](./.claude/rules/) | Modular instructions loaded by path to reduce context noise |
| [.claude/commands/qa/](./.claude/commands/qa/) | Slash-command prompts for test design, bug reporting, and regression decisions |
| [.claude/skills/](./.claude/skills/) | On-demand procedural playbooks for API, security, and performance work |
| [.claude/agents/](./.claude/agents/) | Custom subagents for review and implementation tasks |
| [.claude/hooks/](./.claude/hooks/) | Automated quality gates: format validation and coverage checks |

Claude prompt token usage is reduced in three ways:

1. Prompts are stored once in [prompt-templates.ts](./src/ai/prompt-templates.ts) and reused through [prompt-builder.ts](./src/ai/prompt-builder.ts).
2. Context is compacted, sorted, deduplicated, and clipped before assembly.
3. Rules and skills are loaded only when the path matches, so Claude sees only what matters.

---

## Install

```bash
npm ci
npx playwright install chromium firefox
```

---

## Run

### By layer

```bash
npm run test:ui          # critical screen validation
npm run test:api         # contracts + business rules + boundaries
npm run test:e2e         # end-to-end critical journey
npm run test:security    # auth, headers, injection baseline
npm run perf:smoke       # p95 threshold quick check
```

### By tag

```bash
npm run test:smoke       # @smoke — fast pre-deploy gate across all layers
npm run test:regression  # @regression — full regression before release
```

Or pass any tag directly:

```bash
npx playwright test --grep @boundary
npx playwright test --grep @contract
npx playwright test --grep @security
```

### All at once

```bash
npm run ci               # clean → typecheck → all tests → perf:smoke
```

---

## Key scripts

| Script | Purpose |
| --- | --- |
| `npm run test:ui` | UI-only critical validation |
| `npm run test:api` | API contracts + rules + boundary values |
| `npm run test:e2e` | Core business journey |
| `npm run test:security` | Baseline security checks |
| `npm run test:smoke` | All `@smoke`-tagged tests across layers |
| `npm run test:regression` | All `@regression`-tagged tests across layers |
| `npm run perf:smoke` | Quick p95 threshold run (5–10 iterations) |
| `npm run perf:load` | Higher-iteration threshold run (20+ iterations) |
| `npm run perf:stress` | Upper-bound confidence run (30+ iterations) |
| `npm run ci` | Full local CI-equivalent command |

---

## CI

Two workflows are included:

- [ci.yml](./.github/workflows/ci.yml) — parallel quality jobs (typecheck, api+security, ui+e2e) with failure-only artifact upload
- [performance.yml](./.github/workflows/performance.yml) — on-demand smoke/load/stress execution

---

## Test coverage

| Layer | File | Tags |
| --- | --- | --- |
| UI | [login.ui.spec.ts](./tests/ui/login.ui.spec.ts) | `@smoke` `@critical` `@regression` |
| UI | [payments.ui.spec.ts](./tests/ui/payments.ui.spec.ts) | `@smoke` `@critical` `@regression` `@boundary` |
| API | [transactions.api.spec.ts](./tests/api/transactions.api.spec.ts) | `@smoke` `@critical` `@contract` `@regression` `@security` |
| API | [auth.api.spec.ts](./tests/api/auth.api.spec.ts) | `@smoke` `@contract` `@regression` `@security` |
| API | [business-rules.api.spec.ts](./tests/api/business-rules.api.spec.ts) | `@smoke` `@regression` `@boundary` `@contract` |
| E2E | [critical-payment-journey.e2e.spec.ts](./tests/e2e/critical-payment-journey.e2e.spec.ts) | `@smoke` `@critical` `@regression` `@boundary` |
| Security | [api-security.spec.ts](./tests/security/api-security.spec.ts) | `@smoke` `@security` `@contract` `@regression` |
| Performance | [critical-endpoints.perf.ts](./tests/performance/critical-endpoints.perf.ts) | — |

---

## Contributing

1. Branch from `develop` using the `feature/*` prefix.
2. Run the relevant targeted suite before opening a PR:
   - API change → `npm run test:api`
   - UI change → `npm run test:ui`
   - Security-relevant change → `npm run test:security`
   - Critical path → `npm run test:smoke`
3. If you change a service, page, builder, or OpenAPI contract, update the corresponding test.
4. Do not introduce `waitForTimeout`, `.only`, or selector chains tied to layout.
5. Keep one business intent per test. Boundary cases belong in [business-rules.api.spec.ts](./tests/api/business-rules.api.spec.ts).
6. For local-only config, copy `CLAUDE.local.example.md` → `CLAUDE.local.md` and `.claude/settings.local.example.json` → `.claude/settings.local.json`. Both are git-ignored.

---

## Next extensions

- Plug a real service under the same OpenAPI contracts by replacing the mock server
- Swap the mock store for seeded database fixtures for integration-mode runs
- Connect `prompt-builder.ts` output to a governed AI review flow
- Add feature-level tags (e.g., `@payments`, `@auth`) for more granular CI filtering
