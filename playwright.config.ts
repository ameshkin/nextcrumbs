import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e/ui",
  fullyParallel: true,
  use: {
    viewport: { width: 1280, height: 720 },
  },
});


