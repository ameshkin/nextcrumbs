import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"]
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react"
  },
  resolve: {
    conditions: ["browser", "module", "import", "default"]
  }
})
