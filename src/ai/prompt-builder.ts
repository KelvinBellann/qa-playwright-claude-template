import { tokenBudgetDefaults } from '../../config/test-config/defaults.js';
import { promptTemplates, type PromptTemplateId } from './prompt-templates.js';

export interface PromptBuildInput {
  goal: string;
  context?: Record<string, unknown>;
  constraints?: string[];
}

function clip(value: string, maxChars: number): string {
  return value.length <= maxChars ? value : `${value.slice(0, maxChars - 3)}...`;
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => sortValue(entry));
  }

  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((accumulator, key) => {
        accumulator[key] = sortValue((value as Record<string, unknown>)[key]);
        return accumulator;
      }, {});
  }

  return value;
}

function compactContext(context?: Record<string, unknown>): string {
  if (!context || Object.keys(context).length === 0) {
    return '';
  }

  return clip(JSON.stringify(sortValue(context)), tokenBudgetDefaults.maxContextChars);
}

function compactConstraints(constraints?: string[]): string {
  if (!constraints || constraints.length === 0) {
    return '';
  }

  const uniqueValues = [...new Set(constraints.map((item) => item.trim()).filter(Boolean))];
  return clip(uniqueValues.join(' | '), tokenBudgetDefaults.maxPromptChars);
}

export function buildClaudePrompt(templateId: PromptTemplateId, input: PromptBuildInput): string {
  const sections = [
    promptTemplates[templateId],
    `Goal: ${clip(input.goal.trim(), tokenBudgetDefaults.maxPromptChars)}`,
    compactContext(input.context) ? `Context: ${compactContext(input.context)}` : '',
    compactConstraints(input.constraints) ? `Constraints: ${compactConstraints(input.constraints)}` : '',
  ].filter(Boolean);

  return sections.join('\n');
}
