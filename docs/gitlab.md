# Using `@ameshkin/nextcrumbs` in GitLab / CI projects

This package is published as ESM with tree-shakable entrypoints. Require **0.2.1+** (0.2.0 shipped broken `./public/*` exports).

## Install

```bash
npm install @ameshkin/nextcrumbs@^0.2.1

# peers
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled react react-dom
```

## Top-level imports (no React Router)

```ts
import {
  Breadcrumbs,
  NextCrumb, // alias of Breadcrumbs
  usePathBreadcrumbs,
  buildPathBreadcrumbs,
  getLinkRoutingProps,
  toJsonLd,
  BreadcrumbJsonLd,
  breadcrumbsToJsonLd,
} from "@ameshkin/nextcrumbs";
```

## Tree-shakable subpath imports

```ts
// Component only
import { Breadcrumbs } from "@ameshkin/nextcrumbs/breadcrumbs";

// Next.js App Router hook (client)
import { usePathBreadcrumbs } from "@ameshkin/nextcrumbs/hooks/usePathBreadcrumbs";

// RSC-safe pure path helper (no "use client")
import { buildPathBreadcrumbs } from "@ameshkin/nextcrumbs/utils/buildPathBreadcrumbs";

// React Router hook (optional peer: react-router-dom)
import {
  useReactRouterBreadcrumbs,
  useRRBreadcrumbs,
  type ReactRouterBreadcrumbsOptions,
} from "@ameshkin/nextcrumbs/hooks/useReactRouterBreadcrumbs";

// JSON-LD helpers (no "use client")
import {
  toJsonLd,
  BreadcrumbJsonLd,
  breadcrumbsToJsonLd,
} from "@ameshkin/nextcrumbs/utils/jsonld";
```

## What the package ships

| Field | Value |
| --- | --- |
| `main` / `module` / `types` | `./dist/...` |
| `files` | `dist`, `README.md`, `LICENSE` |
| `exports["."]` | `./dist/index.js` (+ types) |

CI for this repo: `.github/workflows/ci.yml` (Node 20.19 + 22, typecheck, tests, build, dist export guard, consumer install smoke).

## Lockfile tip

Pin the version in CI to avoid accidentally resolving the broken 0.2.0:

```json
{
  "dependencies": {
    "@ameshkin/nextcrumbs": "0.2.1"
  }
}
```
