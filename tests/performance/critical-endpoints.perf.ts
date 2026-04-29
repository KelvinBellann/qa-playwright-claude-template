import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { testEnv } from '../../config/test-config/env.js';

type Profile = 'smoke' | 'load' | 'stress';

interface Metrics {
  name: string;
  durations: number[];
  failures: number;
}

interface LoginPayload {
  token: string;
}

const profileSettings: Record<Profile, { iterations: number; maxP95Ms: number; maxErrorRate: number }> = {
  smoke: {
    iterations: Math.max(5, Math.min(testEnv.perfIterations, 10)),
    maxP95Ms: testEnv.perfP95Ms,
    maxErrorRate: testEnv.perfErrorRate,
  },
  load: {
    iterations: Math.max(testEnv.perfIterations * 2, 20),
    maxP95Ms: testEnv.perfP95Ms + 100,
    maxErrorRate: testEnv.perfErrorRate,
  },
  stress: {
    iterations: Math.max(testEnv.perfIterations * 3, 30),
    maxP95Ms: testEnv.perfP95Ms + 250,
    maxErrorRate: testEnv.perfErrorRate + 0.02,
  },
};

function percentile(values: number[], target: number): number {
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.max(0, Math.ceil(sorted.length * target) - 1);
  return sorted[index] ?? 0;
}

async function waitForHealth(baseUrl: string): Promise<void> {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) {
        return;
      }
    } catch {}

    await sleep(500);
  }

  throw new Error('Mock server did not become healthy.');
}

async function stopChildProcess(child: ReturnType<typeof spawn>): Promise<void> {
  if (child.exitCode !== null || child.pid === undefined) {
    return;
  }

  if (process.platform === 'win32') {
    await new Promise<void>((resolve) => {
      const killer = spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
        stdio: 'ignore',
      });

      killer.on('close', () => resolve());
      killer.on('error', () => resolve());
    });
    return;
  }

  child.kill('SIGTERM');
  await new Promise<void>((resolve) => {
    child.once('close', () => resolve());
    setTimeout(() => resolve(), 5_000);
  });
}

async function withMockServer<T>(callback: () => Promise<T>): Promise<T> {
  const command = process.platform === 'win32' ? 'cmd.exe' : 'npm';
  const args = process.platform === 'win32' ? ['/c', 'npm', 'run', 'mock:start:test'] : ['run', 'mock:start:test'];

  const child = spawn(command, args, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      TEST_MODE: 'true',
      NODE_ENV: 'test',
    },
    stdio: 'ignore',
  });

  try {
    await waitForHealth(testEnv.baseUrl);
    return await callback();
  } finally {
    await stopChildProcess(child);
  }
}

async function resetState(): Promise<void> {
  await fetch(`${testEnv.baseUrl}/test/reset`, {
    method: 'POST',
  });
}

async function login(): Promise<string> {
  const response = await fetch(`${testEnv.baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'operator@template.local',
      password: 'Template@123',
    }),
  });

  if (!response.ok) {
    throw new Error(`Login failed with ${response.status}.`);
  }

  const body = (await response.json()) as LoginPayload;
  return body.token;
}

async function measure(name: string, iterations: number, callback: () => Promise<void>): Promise<Metrics> {
  const durations: number[] = [];
  let failures = 0;

  for (let index = 0; index < iterations; index += 1) {
    const startedAt = performance.now();
    try {
      await callback();
    } catch {
      failures += 1;
    } finally {
      durations.push(Number((performance.now() - startedAt).toFixed(2)));
    }
  }

  return { name, durations, failures };
}

async function runProfile(profile: Profile): Promise<void> {
  const settings = profileSettings[profile];

  await withMockServer(async () => {
    const loginMetrics = await measure('login', settings.iterations, async () => {
      await resetState();
      await login();
    });

    const createMetrics = await measure('create-transaction', settings.iterations, async () => {
      await resetState();
      const token = await login();
      const response = await fetch(`${testEnv.baseUrl}/api/transactions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          beneficiaryAccount: 'US-ACCT-1002',
          amount: 150,
          currency: 'USD',
          note: 'Performance smoke payment',
        }),
      });

      if (!response.ok) {
        throw new Error(`Create failed with ${response.status}.`);
      }
    });

    const monthlyMetrics = await measure('list-transactions', settings.iterations, async () => {
      await resetState();
      const token = await login();
      const response = await fetch(`${testEnv.baseUrl}/api/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`List failed with ${response.status}.`);
      }
    });

    const summaryMetrics = await measure('summary', settings.iterations, async () => {
      await resetState();
      const token = await login();
      const response = await fetch(`${testEnv.baseUrl}/api/accounts/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Summary failed with ${response.status}.`);
      }
    });

    const report = [loginMetrics, createMetrics, monthlyMetrics, summaryMetrics].map((metric) => {
      const p95 = percentile(metric.durations, 0.95);
      const errorRate = metric.failures / metric.durations.length;
      return {
        endpoint: metric.name,
        iterations: metric.durations.length,
        p95,
        errorRate: Number(errorRate.toFixed(4)),
      };
    });

    const failures = report.filter(
      (metric) => metric.p95 > settings.maxP95Ms || metric.errorRate > settings.maxErrorRate,
    );

    console.table(report);

    if (failures.length > 0) {
      throw new Error(`Performance thresholds failed for profile ${profile}.`);
    }
  });
}

const requestedProfile = (process.env.PERF_PROFILE ?? 'smoke') as Profile;

runProfile(requestedProfile).catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
