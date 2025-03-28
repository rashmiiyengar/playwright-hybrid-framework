import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from "dotenv";
import path from "path";
import { Config, SiteType } from "./src/framework/config";

dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  testDir: "./src/tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    screenshot: "on-first-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "sauce",
      use: {
        baseURL: Config.getBaseUrl("sauce"),
        browserName: "chromium",
        headless: true,
        storageState: Config.getAuthConfig("sauce").storageStateFile,
      },
    },
    {
      name: "second",
      use: {
        baseURL: Config.getBaseUrl("second"),
        browserName: "firefox",
        headless: true,
        storageState: Config.getAuthConfig("second").storageStateFile,
      },
    },
    {
      name: "third",
      use: {
        baseURL: Config.getBaseUrl("third"),
        browserName: "webkit",
        headless: true,
        storageState: Config.getAuthConfig("third").storageStateFile,
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
