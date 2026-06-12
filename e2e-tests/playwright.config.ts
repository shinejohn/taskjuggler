import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 * ALLPAGES.md lists every route per app — all-pages tests use this config.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Run one app at a time to avoid port conflicts
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Sequential: apps may share ports when not all running
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'taskjuggler-web',
      use: { ...devices['Desktop Chrome'], baseURL: process.env.TASKJUGGLER_URL || 'http://localhost:5173' },
      testMatch: /tests\/(all-pages\/taskjuggler-web|auth\/taskjuggler|taskjuggler|homepage|integration|mobile|accessibility).*\.spec\.ts/,
    },
    {
      name: 'coordinator-web',
      use: { ...devices['Desktop Chrome'], baseURL: process.env.COORDINATOR_URL || 'http://localhost:3003' },
      testMatch: /tests\/(all-pages\/coordinator-web|coordinator).*\.spec\.ts/,
    },
    {
      name: 'ideacircuit-web',
      use: { ...devices['Desktop Chrome'], baseURL: process.env.IDEACIRCUIT_URL || 'http://localhost:3004' },
      testMatch: /tests\/(all-pages\/ideacircuit-web|ideacircuit).*\.spec\.ts/,
    },
    {
      name: 'official-notice-web',
      use: { ...devices['Desktop Chrome'], baseURL: process.env.OFFICIAL_NOTICE_URL || 'http://localhost:5175' },
      testMatch: /tests\/(all-pages\/official-notice-web|official-notice).*\.spec\.ts/,
    },
    {
      name: 'process-web',
      use: { ...devices['Desktop Chrome'], baseURL: process.env.PROCESS_URL || 'http://localhost:3001' },
      testMatch: /tests\/(all-pages\/process-web|auth\/process|process).*\.spec\.ts/,
    },
    {
      name: 'projects-web',
      use: { ...devices['Desktop Chrome'], baseURL: process.env.PROJECTS_URL || 'http://localhost:3002' },
      testMatch: /tests\/(all-pages\/projects-web|auth\/projects|projects).*\.spec\.ts/,
    },
    {
      name: 'scanner-web',
      use: { ...devices['Desktop Chrome'], baseURL: process.env.SCANNER_URL || 'http://localhost:3005' },
      testMatch: /tests\/(all-pages\/scanner-web|scanner).*\.spec\.ts/,
    },
    {
      name: 'urpa-web',
      use: { ...devices['Desktop Chrome'], baseURL: process.env.URPA_URL || 'http://localhost:3006' },
      testMatch: /tests\/(all-pages\/urpa-web|urpa).*\.spec\.ts/,
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: /.*mobile.*\.spec\.ts/,
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      testMatch: /.*mobile.*\.spec\.ts/,
    },
  ],
});
