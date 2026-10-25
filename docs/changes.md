## Docs & API Changes

### Bug hunt fixes + features (still 0.2.1, unpublished)

- **BH-01 / `linkProp`:** `linkProp="href" | "to"` so React Router `Link` works without an adapter. When `"to"`, native `href` is still set (right-click / open in new tab / middle-click).
- **BH-02:** Default root margin is `mb: 0` (set margin via `sx`).
- **BH-03:** Home icon is `href === homeHref` only (not label match). New `homeHref` prop.
- **BH-04:** React Router at `/` returns `{ label }` with no self-link `href`.
- **BH-05:** JSON-LD no longer defaults to `https://example.com`. Relative URLs need `origin`; `BreadcrumbJsonLd` falls back to `window.location.origin` in the browser.
- **BH-06:** Crumb content renderer hoisted outside render.
- **BH-07:** `"use client"` is not stamped on `utils/jsonld` or `utils/buildPathBreadcrumbs`.
- **New:** `maxItems` / collapse props, `size`, `truncate`, `jsonLdOrigin` on `<Breadcrumbs>`.
- **New:** RSC-safe `buildPathBreadcrumbs` (+ subpath export).
- **New:** `.github/workflows/publish.yml` for npm Trusted Publishing (OIDC).

### Documentation refresh (0.2.1)

- Root README rewritten for 0.2.1: version warning, Emotion peers, subpath table, full prop list (`dense`, `ariaLabel`, sx slots), troubleshooting for broken 0.2.0 and MUI peer conflicts.
- Guides updated: `docs/next-router.md`, `docs/react-router.md` (subpath-only), `docs/vanilla-json.md` (package JSON-LD helpers), `docs/gitlab.md` (dist exports + pin 0.2.1).
- Added `docs/README.md` index.
- Removed outdated claims (lazy-loading React Router, installing RR as a Next.js workaround, `>=7` MUI peers).

### 0.2.1 - package fix (do not use 0.2.0)

- **Dev toolchain upgrades:** React 19, Vitest 5, tsup 9, TypeScript 6, Cucumber 13, Playwright 1.64, Testing Library jest-dom 7, jsdom 28, react-router-dom 7.18, MUI 7.3.11 (still peer `^7`).
- **Not upgraded on purpose:** MUI 8/9 (peers stay `^7`), TypeScript 7 (tsup DTS needs the classic compiler API), jsdom 30 (needs Node `^22.22.2` / `^24.15`, beyond current engines).

- **Fixed:** `main` / `module` / `types` / `exports` now point at `./dist/*` (0.2.0 incorrectly pointed at `./public/*`, which is not shipped).
- **Fixed:** MUI peers tightened from `>=7` to `^7.0.0` so installs cannot resolve MUI 8/9 against this package.
- **Fixed:** Emotion peers tightened to `^11.0.0`.
- **Confirmed:** `react-router-dom` remains an optional peer (`peerDependenciesMeta.optional`).
- **Fixed:** `useReactRouterBreadcrumbs` uses a normal `react-router-dom` import (the old dynamic `require` failed under ESM / Vitest).
- **Breaking (intentional):** React Router hooks are **not** re-exported from the main `@ameshkin/nextcrumbs` entry. Import from `@ameshkin/nextcrumbs/hooks/useReactRouterBreadcrumbs` (also exports `useRRBreadcrumbs`). This keeps the optional peer truly optional for Next.js.
- **Removed:** stale `workspaces: ["packages/*"]` (no workspace packages in this repo).
- **Removed:** unpublished `@ameshkin/jira-mate` from `devDependencies` (404 on npm registry).
- **Build:** `tsup` `outDir` is `dist`; `react-router-dom` and Emotion are external.
- **CI:** single `.github/workflows/ci.yml` (main + dev). Node 20.19 / 22 matrix, `npm ci`, typecheck, tests, build, dist export guard, consumer install smoke. Removed duplicate `ci-main.yml` / `ci-dev.yml`.

### Export layout & tree shaking

- **New:** multiple ESM entrypoints are now built:
  - `src/index.ts`
  - `src/Breadcrumbs.tsx`
  - `src/hooks/usePathBreadcrumbs.ts`
  - `src/hooks/useReactRouterBreadcrumbs.ts`
  - `src/utils/jsonld.ts`
- **New:** subpath exports in `package.json`:
  - `@ameshkin/nextcrumbs/breadcrumbs`
  - `@ameshkin/nextcrumbs/hooks/usePathBreadcrumbs`
  - `@ameshkin/nextcrumbs/hooks/useReactRouterBreadcrumbs`
  - `@ameshkin/nextcrumbs/utils/jsonld`
- **Unchanged (backward compatible):**
  - Top-level exports from `@ameshkin/nextcrumbs`:
    - `Breadcrumbs`, `NextCrumb`
    - `usePathBreadcrumbs`
    - `toJsonLd`, `BreadcrumbJsonLd`, `breadcrumbsToJsonLd`
    - related types (Breadcrumbs / path / JSON-LD)
  - React Router exports (subpath only):
    - `useReactRouterBreadcrumbs`, `useRRBreadcrumbs`
    - `ReactRouterBreadcrumbsOptions`

### Dependency cleanup

- **Removed:** runtime dependency on `@ameshkin/orchestrator` from `@ameshkin/nextcrumbs`.
  - This avoids install issues in external projects and keeps the public package focused on breadcrumbs only.


