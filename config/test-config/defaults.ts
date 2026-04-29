export const tokenBudgetDefaults = {
  maxContextBullets: 6,
  maxContextChars: 1200,
  maxPromptChars: 900,
  maxAssertionHints: 5,
} as const;

export const testDefaults = {
  currency: 'USD',
  beneficiaryPrefix: 'US-ACCT-',
} as const;
