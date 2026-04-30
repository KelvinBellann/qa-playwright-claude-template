# QA Playwright Claude Template

This repository is a lean QA automation template for Playwright, OpenAPI contract validation, lightweight performance checks, and Claude-assisted workflows.

## System under test

The included target application is a minimal finance payment flow used to demonstrate:

- browser login and protected navigation
- payment creation and balance changes
- OpenAPI-based contract validation
- auth and security baseline checks
- deterministic performance smoke validation

The mock target exists only to make the repository runnable without external infrastructure. Teams can replace it with a real system while preserving the testing architecture.

## QA strategy

- UI proves critical screen behavior only.
- API proves business rules and contracts first.
- E2E proves only the business journey that crosses layers.
- Security proves baseline auth, header, and unsafe-input protection.
- Performance proves threshold health of critical endpoints, not synthetic bulk load by default.

This repository is intentionally biased toward fast feedback and low maintenance.

## Acceptance criteria

- Relevant targeted suite is executed.
- Tests remain independent and deterministic.
- New behavior is covered at the correct layer, not duplicated across all layers.
- OpenAPI stays aligned with protected endpoint behavior.
- README and Claude assets are updated when team workflow changes.
- No secret or machine-specific value is committed.

## Toolchain

- Playwright 1.59.1
- TypeScript
- Express mock target
- OpenAPI runtime schema validation
- Lightweight Node performance runner
- GitHub Actions
- Claude Code project memory, rules, commands, skills, agents, and hooks

## Repository map

- `tests/ui`: minimal browser checks
- `tests/api`: auth, contract, and rule validation
- `tests/e2e`: core user journeys
- `tests/security`: auth bypass, headers, unsafe input
- `tests/performance`: threshold-focused smoke/load/stress checks
- `src/pages`: browser abstractions
- `src/services`: domain-facing API layer
- `src/clients`: low-level HTTP wrapper
- `src/builders`: deterministic data builders
- `src/fixtures`: shared test fixtures
- `src/ai`: concise Claude prompt helpers
- `config/openapi`: source of truth for response contracts

## Working agreements

- Follow Gitflow: branch from `develop`, use `feature/*`, merge back into `develop`, and keep `main` release-oriented.
- Prefer updating existing fixtures, services, and builders over adding duplicate helpers.
- Do not add fixed waits, `.only`, or brittle selectors.
- Use `data-testid` or robust semantic locators.
- If API behavior changes, update `config/openapi/finance-api.json` and the affected API tests together.
- Keep prompts concise and deterministic. Reuse `src/ai/prompt-builder.ts` instead of embedding large instructions in tests or docs.

## Verification commands

- `npm run typecheck`
- `npm run test:api`
- `npm run test:security`
- `npm run test:ui`
- `npm run test:e2e`
- `npm run perf:smoke`
- `npm run ci`

## Claude operating model

- `CLAUDE.md`: project memory and non-negotiable working agreements
- `.claude/rules/`: small, scoped rules loaded only when path-relevant
- `.claude/commands/`: repeatable slash-command workflows
- `.claude/skills/`: deeper playbooks for API, security, and performance work
- `.claude/agents/`: specialized subagents for targeted review or implementation
- `.claude/hooks/`: lightweight automated quality gates and sync helpers
- `.mcp.json`: project-scoped MCP config, intentionally controlled by the team

## Local-only notes

- Copy `CLAUDE.local.example.md` to `CLAUDE.local.md` for personal instructions.
- Copy `.claude/settings.local.example.json` to `.claude/settings.local.json` for personal overrides.
- Both files are ignored by git on purpose.
