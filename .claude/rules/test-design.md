---
paths:
  - "tests/**/*.{ts,md}"
  - "src/pages/**/*.ts"
  - "src/fixtures/**/*.ts"
  - "src/builders/**/*.ts"
---

# Test Design Rules

- Start with the smallest layer that can prove the behavior.
- Use boundary value analysis and equivalence partitioning for inputs.
- Keep one business intent per test.
- Prefer fixtures and builders over inline data.
- UI and E2E tests must avoid `waitForTimeout`, `.only`, and selector chains tied to layout.
- UI tests should prove rendering and interaction only when API coverage would miss the user risk.
- E2E tests should validate one critical journey without re-proving every contract already covered in API tests.
- Assertions must focus on outcome, not implementation detail.
