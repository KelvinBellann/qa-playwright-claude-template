import { fail, runGit } from './shared.mjs';

const changedFilesResult = runGit(['diff', '--name-only', 'HEAD']);
const changedFiles = changedFilesResult.stdout
  .split(/\r?\n/)
  .map((item) => item.trim())
  .filter(Boolean);

if (changedFiles.length === 0) {
  process.exit(0);
}

const coverageRelevantSource = changedFiles.filter((file) =>
  /^(src\/(pages|services|clients|builders|fixtures)\/.*\.ts|src\/utils\/(mock-server|mock-store|openapi-loader|schema-validator|preflight)\.ts|config\/openapi\/.*\.json)$/.test(
    file,
  ),
);

if (coverageRelevantSource.length === 0) {
  process.exit(0);
}

const touchedTests = changedFiles.filter((file) => /^tests\/.*\.ts$/.test(file));

if (touchedTests.length === 0) {
  fail(
    `Coverage gate: source behavior changed in ${coverageRelevantSource.join(
      ', ',
    )} but no test file changed under tests/. Add or update targeted coverage before stopping.`,
  );
}
