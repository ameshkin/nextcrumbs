import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    include: ["src/**/*.test.ts?(x)"], // adjust to your structure
  },
  resolve: {
    alias: {
      // point next/link to your test mock
      "next/link": fileURLToPath(new URL("./mocks/link.ts", import.meta.url)),
    },
  },
});
