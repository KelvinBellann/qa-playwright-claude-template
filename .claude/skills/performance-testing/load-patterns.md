# Load Patterns

## Best applications

- `smoke`: default developer and CI validation
- `load`: broaden confidence before merge or release
- `stress`: upper-bound confidence when tuning or investigating degradation

## Practical guidance

- keep login and target endpoint orchestration identical to real business flow
- do not create multiple performance runners for the same endpoint family
- prefer deterministic reset and small iteration counts for smoke validation
