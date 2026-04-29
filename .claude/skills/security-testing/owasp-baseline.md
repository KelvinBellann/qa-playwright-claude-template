# Security Testing Baseline

Focus on automated checks that stay stable in CI:

- auth bypass and invalid token handling
- authorization leakage
- unsafe input rejection
- security headers on user-facing routes
- accidental exposure of local secrets or personal config files

Prefer concrete, automatable checks over broad theoretical lists.
