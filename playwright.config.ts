import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3200';
const isCI = Boolean(process.env.CI);
const traceMode = process.env.TRACE_MODE ?? 'retain-on-failure';

const browserProjects = [
  {
    name: 'chromium',
    testMatch: /tests[\\/]+(ui|e2e)[\\/].*\.spec\.ts/,
    use: {
      ...devices['Desktop Chrome'],
      baseURL,
    },
  },
  ...(isCI
    ? [
        {
          name: 'firefox',
          testMatch: /tests[\\/]+(ui|e2e)[\\/].*\.spec\.ts/,
          use: {
            ...devices['Desktop Firefox'],
            baseURL,
          },
        },
      ]
    : []),
];

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : 1,
  timeout: 45_000,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL,
    headless: process.env.HEADLESS !== 'false',
    testIdAttribute: 'data-testid',
    screenshot: 'only-on-failure',
    trace: traceMode as 'retain-on-failure' | 'off' | 'on',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  webServer: {
    command: 'npm run mock:start:test',
    url: `${baseURL}/health`,
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
  projects: [
    ...browserProjects,
    {
      name: 'api',
      testMatch: /tests[\\/]+api[\\/].*\.spec\.ts/,
      use: {
        baseURL,
      },
    },
    {
      name: 'security',
      testMatch: /tests[\\/]+security[\\/].*\.spec\.ts/,
      use: {
        baseURL,
      },
    },
  ],
});
