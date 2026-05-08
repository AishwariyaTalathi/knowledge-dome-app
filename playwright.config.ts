import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  // Folder where all E2E test files live — kept separate from Vitest unit tests
  testDir: './e2e',

  // Run sequentially — concurrent Supabase auth requests from the same user cause flaky sessions
  fullyParallel: false,
  workers: 1,

  // Stop the whole test run on the first failure — useful during development
  // Set to false if you want to see all failures at once
  forbidOnly: !!process.env.CI,

  // Number of times to retry a failed test (useful in CI where flakiness can happen)
  retries: process.env.CI ? 2 : 0,

  // Per-test timeout — increased to account for Next.js dev compilation on first load
  timeout: 60000,

  // Default timeout for expect() assertions (e.g. toHaveURL, toBeVisible)
  expect: { timeout: 15000 },

  // Run tests without a visible browser window (set to false to watch them run)
  // You can override this by running: npx playwright test --headed
  use: {
    // The URL of your running Next.js app
    baseURL: 'http://localhost:3000',

    // How long to wait for a single action (click, fill, etc.)
    actionTimeout: 15000,

    // How long to wait for page navigation to complete
    navigationTimeout: 30000,

    // Captures a screenshot automatically when a test fails — helps with debugging
    screenshot: 'only-on-failure',

    // Records a video of the browser session when a test fails
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
