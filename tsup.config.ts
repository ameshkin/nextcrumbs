import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "tsup";

/**
 * Library build for @ameshkin/nextcrumbs.
 * Output must match package.json exports (./dist/*). Do not emit to public/.
 */
const ENTRY_JS = [
  "index.js",
  "Breadcrumbs.js",
  "hooks/usePathBreadcrumbs.js",
  "hooks/useReactRouterBreadcrumbs.js",
  "utils/jsonld.js",
] as const;

function prependUseClient(outDir: string) {
  // esbuild drops source "use client" directives. Restore on published entry files
  // so Next.js App Router treats UI / hooks as client modules.
  for (const rel of ENTRY_JS) {
    const file = join(outDir, rel);
    const src = readFileSync(file, "utf8");
    if (src.startsWith('"use client"') || src.startsWith("'use client'")) continue;
    writeFileSync(file, `"use client";\n${src}`);
  }
}

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/Breadcrumbs.tsx",
    "src/hooks/usePathBreadcrumbs.ts",
    "src/hooks/useReactRouterBreadcrumbs.ts",
    "src/utils/jsonld.ts",
  ],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: true,
  target: "es2020",
  outDir: "dist",
  // Peers stay external so consumers resolve their own copies.
  external: [
    "react",
    "react-dom",
    "react-router-dom",
    "@mui/material",
    "@mui/icons-material",
    "@emotion/react",
    "@emotion/styled",
  ],
  async onSuccess() {
    prependUseClient("dist");
  },
});
