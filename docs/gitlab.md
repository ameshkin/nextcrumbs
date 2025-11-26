## Using `@ameshkin/nextcrumbs` in GitLab projects

This package is published as a modern ESM bundle with tree-shakable entrypoints and subpath exports.

### Install

```bash
npm install @ameshkin/nextcrumbs
```

### Top-level (backward-compatible) imports

These continue to work and are the recommended default:

```ts
import {
  Breadcrumbs,
  NextCrumb, // alias of Breadcrumbs
  usePathBreadcrumbs,
  useReactRouterBreadcrumbs,
  toJsonLd,
  BreadcrumbJsonLd,
  breadcrumbsToJsonLd,
} from "@ameshkin/nextcrumbs";
```

### Tree-shakable subpath imports

For GitLab (and other) projects that prefer explicit per-feature imports, you can use the new subpath exports:

```ts
// Component only
import { Breadcrumbs } from "@ameshkin/nextcrumbs/breadcrumbs";

// Next.js App Router hook
import { usePathBreadcrumbs } from "@ameshkin/nextcrumbs/hooks/usePathBreadcrumbs";

// React Router hook
import useReactRouterBreadcrumbs, {
  ReactRouterBreadcrumbsOptions,
} from "@ameshkin/nextcrumbs/hooks/useReactRouterBreadcrumbs";

// JSON-LD helpers
import {
  toJsonLd,
  BreadcrumbJsonLd,
  breadcrumbsToJsonLd,
} from "@ameshkin/nextcrumbs/utils/jsonld";
```

All of these entrypoints are pure ESM and are safe for bundlers that perform tree shaking.


