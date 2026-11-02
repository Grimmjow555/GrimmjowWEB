import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: true,
  retries: 1,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node tests/server.mjs",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
        permissions: ["clipboard-read", "clipboard-write"],
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
        permissions: ["clipboard-read", "clipboard-write"],
      },
    },
  ],
});
