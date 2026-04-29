import path from 'node:path';
import { fail, normalizeToRepoPath, projectDir, readHookInput, readText } from './shared.mjs';

const input = readHookInput();
const absolutePath = input?.tool_input?.file_path;
const repoPath = normalizeToRepoPath(absolutePath);

if (!repoPath || !repoPath.endsWith('.ts') || !repoPath.startsWith('tests/')) {
  process.exit(0);
}

const content = readText(path.resolve(projectDir(), repoPath));
const violations = [];

if (/\b(?:test|it|describe)\.only\s*\(|\bfit\s*\(|\bfdescribe\s*\(/.test(content)) {
  violations.push('Remove focused tests like .only, fit, or fdescribe.');
}

if (/waitForTimeout\s*\(/.test(content)) {
  violations.push('Remove fixed waits like waitForTimeout and use deterministic waits or assertions.');
}

if (/sleep\s*\(/.test(content)) {
  violations.push('Do not introduce sleep-based waits in tests.');
}

if (violations.length > 0) {
  fail(`QA format gate failed for ${repoPath}\n- ${violations.join('\n- ')}`);
}
