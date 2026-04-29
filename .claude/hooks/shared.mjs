import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export function readHookInput() {
  const raw = fs.readFileSync(0, 'utf8').trim();
  return raw ? JSON.parse(raw) : {};
}

export function projectDir() {
  return process.env.CLAUDE_PROJECT_DIR || process.cwd();
}

export function normalizeToRepoPath(filePath) {
  if (!filePath) {
    return '';
  }

  return path.relative(projectDir(), filePath).replace(/\\/g, '/');
}

export function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

export function runGit(args) {
  const result = spawnSync('git', args, {
    cwd: projectDir(),
    encoding: 'utf8',
  });

  return {
    status: result.status ?? 1,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
  };
}

export function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(2);
}
