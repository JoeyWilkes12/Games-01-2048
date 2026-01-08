// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright configuration for Game Hub
 * Configured for testing, demo recording, and parallel split demos
 * 
 * Environment Variables:
 *   DEMO_SPEED - Speed multiplier for demos (e.g., 2.0 = 2x faster)
 *   HEADLESS   - Set to 'false' for headed mode
 */
module.exports = defineConfig({
  testDir: './',

  // Global timeout for tests (2 minutes default)
  timeout: 120000,

  // Expect timeout
  expect: {
    timeout: 10000
  },

  // Run tests in files in parallel (controlled per-project)
  fullyParallel: false,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Default workers (can be overridden per project)
  workers: 1,

  // Reporter to use
  reporter: [
    ['list'],
    ['html', { outputFolder: './playwright-report', open: 'never' }]
  ],

  use: {
    // Base URL for local file access
    baseURL: `file://${__dirname}`,

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Video recording settings for demos
    video: {
      mode: 'on',
      size: { width: 1280, height: 720 }
    },

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Slow down actions for better visibility in demos
    launchOptions: {
      slowMo: 100
    }
  },

  // Configure projects
  projects: [
    // Full demo recording (sequential, single worker)
    {
      name: 'demo',
      testMatch: /demo-recording\.spec\.js$/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        video: {
          mode: 'on',
          size: { width: 1280, height: 720 }
        },
        launchOptions: {
          slowMo: 300 // Slower for demo recordings
        }
      },
      timeout: 300000, // 5 minutes for full demo
    },

    // Split demo tests (parallel capable)
    {
      name: 'split-demos',
      testDir: './tests',
      testMatch: /demo-.*\.spec\.js$/,
      fullyParallel: true,
      workers: 3, // Run game demos in parallel
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        video: {
          mode: 'on',
          size: { width: 1280, height: 720 }
        },
        launchOptions: {
          slowMo: 150
        }
      },
      timeout: 180000, // 3 minutes per split demo
    },

    // Unit/seeded tests (fast, no video)
    {
      name: 'tests',
      testMatch: /.*\.spec\.js$/,
      testIgnore: [/demo-recording\.spec\.js$/, /tests\/demo-.*\.spec\.js$/],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        video: 'off',
        launchOptions: {
          slowMo: 50
        }
      },
    },
  ],

  // Output folder for test artifacts
  outputDir: './test-results/',
});
