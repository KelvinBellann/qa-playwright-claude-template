# Agents

Use subagents when the task is bounded and the output can be reviewed independently.

## Best routing

- `security-auditor`: auth, access control, unsafe input, secret exposure
- `performance-analyst`: thresholds, runner stability, endpoint performance risk
- `automation-engineer`: implementation in tests, fixtures, services, and page objects

Subagents should answer with findings or targeted patches, not broad redesigns.
