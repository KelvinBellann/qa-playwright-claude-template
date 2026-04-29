# Defect Taxonomy

Use this taxonomy when triaging failures, writing bug reports, or proposing new tests.

- Access control: auth bypass, tenant isolation, role leakage
- Contract drift: response shape, status code, field type, schema mismatch
- Data integrity: wrong totals, stale state, non-idempotent behavior, precision loss
- Workflow regression: broken critical path, invalid state transition, missing blocking rule
- Observability gap: failure with poor evidence, missing trace, weak error message
- Performance regression: p95 drift, error-rate increase, endpoint saturation
- Test architecture issue: flaky selector, fixed wait, hidden shared state, noisy fixture

When reporting a defect, always name the most relevant category first and keep the report tied to business impact.
