import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  workers: 2,
  timeout: 45000,
  expect: { timeout: 8000 },
  reporter: [
    ['list'],
    ...(process.env.CI ? ([['github']] as const) : []),
    ['json', { outputFile: 'artifacts/test-results.json' }],
  ],
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:4321',
    headless: true,
    launchOptions: {
      // CI uses the Chromium revision installed by Playwright; local setups may
      // continue using their existing system Chromium installation.
      executablePath:
        process.env.CHROMIUM_PATH ||
        (process.env.CI ? undefined : '/usr/bin/chromium'),
      args: ['--no-sandbox'],
    },
    trace: 'retain-on-failure',
  },
  webServer: process.env.TEST_BASE_URL
    ? undefined
    : {
        command: 'npm run preview -- --port 4321 --ignore-lock',
        url: 'http://127.0.0.1:4321',
        reuseExistingServer: !process.env.CI,
      },
})
