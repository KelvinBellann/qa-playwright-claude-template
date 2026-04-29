# Performance Threshold Guidance

Use thresholds that teams can explain and defend:

- p95 should reflect user-facing responsiveness, not ideal lab speed
- error rate should stay near zero for smoke checks
- endpoint choice should map to business-critical actions

Change thresholds only when:

- the system behavior changed intentionally
- the environment profile changed materially
- the old threshold created noise without protecting risk
