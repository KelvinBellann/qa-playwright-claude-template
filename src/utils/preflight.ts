import fs from 'node:fs';
import { testEnv } from '../../config/test-config/env.js';

export function runPreflightChecks(): void {
  if (!testEnv.baseUrl) {
    throw new Error('BASE_URL is required.');
  }

  if (!fs.existsSync(testEnv.openApiPath)) {
    throw new Error(`OpenAPI file not found at ${testEnv.openApiPath}.`);
  }
}
