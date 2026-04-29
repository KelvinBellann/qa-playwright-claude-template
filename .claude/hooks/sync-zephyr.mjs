import fs from 'node:fs';
import path from 'node:path';
import { normalizeToRepoPath, projectDir, readHookInput, runGit } from './shared.mjs';

const outputDirectory = path.join(projectDir(), '.claude', 'out');
fs.mkdirSync(outputDirectory, { recursive: true });

const input = readHookInput();
const changedFiles = runGit(['diff', '--name-only', 'HEAD']).stdout
  .split(/\r?\n/)
  .map((item) => item.trim())
  .filter(Boolean);

const payload = {
  generatedAt: new Date().toISOString(),
  source: 'claude-hook',
  event: input?.hook_event_name || 'manual',
  changedFiles,
  changedTestFiles: changedFiles.filter((file) => file.startsWith('tests/')),
  changedSpecFromHook: normalizeToRepoPath(input?.tool_input?.file_path),
  mode: process.env.TEST_MGMT_MODE || 'dry-run',
};

const filePath = path.join(outputDirectory, 'test-management-sync.json');
fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
process.stdout.write(`${filePath}\n`);
