export type PromptTemplateId = 'generate-test' | 'suggest-assertions' | 'summarize-failure';

export const promptTemplates: Record<PromptTemplateId, string> = {
  'generate-test': [
    'Role: senior qa.',
    'Task: generate one deterministic Playwright test.',
    'Rules: no prose, no comments, reuse existing builders/services, stable selectors only.',
    'Output: single TypeScript test body.',
  ].join('\n'),
  'suggest-assertions': [
    'Role: qa reviewer.',
    'Task: suggest up to five high-signal assertions.',
    'Rules: no duplicates, no low-value UI text checks, business outcome first.',
    'Output: flat bullet list.',
  ].join('\n'),
  'summarize-failure': [
    'Role: qa triage.',
    'Task: summarize failure in three lines.',
    'Rules: symptom, likely cause, next check. No filler.',
    'Output: plain text.',
  ].join('\n'),
};
