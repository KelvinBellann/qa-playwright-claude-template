# Claude Code Layout

This folder keeps Claude Code behavior modular so the assistant loads only the smallest necessary context.

## Structure

- `settings.json`: shared permissions and hook wiring
- `rules/`: short path-scoped rules
- `commands/`: slash-command prompts for repeatable QA tasks
- `skills/`: deeper workflows with checklists and patterns
- `agents/`: specialized subagents for review and implementation
- `hooks/`: lightweight quality gates and test-management sync helpers

## Operating principle

Keep permanent truth in `CLAUDE.md`, scoped rules in `rules/`, reusable workflows in `commands/`, and domain know-how in `skills/`. Avoid putting large static instructions into test files or service code.
