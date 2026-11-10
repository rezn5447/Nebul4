import { defineConfig, devices } from '@playwright/test'

const PORT = 3100

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'unit', testDir: './tests/unit' },
    { name: 'desktop', testDir: './e2e', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', testDir: './e2e', use: { ...devices['Pixel 7'] } },
  ],
  // Tests run against the production build, so `npm run build` must run first.
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      // Booking emails from tests go to Resend's test inbox, which accepts mail and delivers it nowhere.
      BOOKING_INBOX: 'delivered@resend.dev',
    },
  },
})
