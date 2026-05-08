import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'https://instant-rent-six.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    storageState: {
      cookies: [],
      origins: [{
        origin: 'https://instant-rent-six.vercel.app',
        localStorage: [{ name: 'cookies_accepted', value: 'true' }],
      }],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
