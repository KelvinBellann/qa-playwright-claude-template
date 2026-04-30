# Hooks

Hooks act as lightweight quality gates.

## Current hooks

- `validate-test-format`: blocks `.only`, fixed waits, and sleep-based anti-patterns in `tests/`
- `check-coverage`: warns when source behavior changes without any test change
- `sync-zephyr`: writes a dry-run payload for optional test-management integration

## Wrappers

The executable logic lives in `.mjs` files for portability. Shell wrappers are also included so teams on Unix-style environments can mirror the folder style shown in common Claude Code examples.
