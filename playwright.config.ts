import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  workers: 2,
  timeout: 45000,
  expect: { timeout: 8000 },
  reporter: [['list'], ['json', { outputFile: 'artifacts/test-results.json' }]],
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:4321',
    headless: true,
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
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
