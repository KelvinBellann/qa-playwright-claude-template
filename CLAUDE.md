# QA Playwright Claude Template

This repository is a lean QA automation template for Playwright, OpenAPI contract validation, lightweight performance checks, and Claude-assisted workflows.

## Project intent

- Keep tests deterministic, fast, and low-noise.
- Use UI tests only for critical screen validation.
- Use API tests for business rules and contract checks.
- Use E2E tests only for end-to-end journeys that matter.
- Keep Claude context small. Put always-needed facts here, scoped instructions in `.claude/rules/`, and procedural workflows in `.claude/skills/`.

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

## Acceptance criteria for changes

- Relevant targeted suite is executed.
- Tests remain independent and deterministic.
- New business logic has coverage at the correct layer, not all layers.
- README and Claude artifacts are updated when workflow or architecture changes.
- No secret or machine-specific value is committed.

## Claude structure

- Root `CLAUDE.md`: shared project memory
- `.claude/rules/`: scoped instructions loaded by path
- `.claude/commands/`: slash command prompts for repeatable QA tasks
- `.claude/skills/`: procedural workflows loaded on demand
- `.claude/agents/`: specialized subagents for review and analysis
- `.claude/hooks/`: automated quality gates and sync helpers
- `.mcp.json`: project-scoped MCP config, intentionally empty until the team approves shared servers

## Local-only notes

- Copy `CLAUDE.local.example.md` to `CLAUDE.local.md` for personal instructions.
- Copy `.claude/settings.local.example.json` to `.claude/settings.local.json` for personal overrides.
- Both files are ignored by git on purpose.
