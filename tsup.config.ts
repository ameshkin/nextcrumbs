import { defineConfig } from "tsup";

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
  target: "es2020",
  external: ["react", "react-dom", "@mui/material", "@mui/icons-material"]
});
