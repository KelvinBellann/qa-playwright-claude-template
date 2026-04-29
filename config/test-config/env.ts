import fs from 'node:fs';
import path from 'node:path';

interface EnvironmentFile {
  baseUrl: string;
  timeouts: {
    default: number;
    navigation: number;
  };
  flags: {
    paymentsEnabled: boolean;
  };
}

function readEnvironmentFile(targetEnv: string): EnvironmentFile {
  const filePath = path.resolve(process.cwd(), 'config', 'environments', `${targetEnv}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as EnvironmentFile;
}

const targetEnv = process.env.TARGET_ENV ?? 'local';
const environmentFile = readEnvironmentFile(targetEnv);

export const testEnv = {
  targetEnv,
  baseUrl: process.env.BASE_URL ?? environmentFile.baseUrl,
  timeouts: environmentFile.timeouts,
  flags: {
    paymentsEnabled: process.env.FEATURE_PAYMENTS
      ? process.env.FEATURE_PAYMENTS === 'true'
      : environmentFile.flags.paymentsEnabled,
  },
  openApiPath: path.resolve(process.cwd(), process.env.OPENAPI_PATH ?? 'config/openapi/finance-api.json'),
  perfIterations: Number(process.env.PERF_ITERATIONS ?? 12),
  perfP95Ms: Number(process.env.PERF_P95_MS ?? 600),
  perfErrorRate: Number(process.env.PERF_ERROR_RATE ?? 0.01),
};
