## Docs & API Changes

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
  - Top-level exports from `@ameshkin/nextcrumbs` still include:
    - `Breadcrumbs`, `NextCrumb`
    - `usePathBreadcrumbs`
    - `useReactRouterBreadcrumbs` and `useRRBreadcrumbs`
    - `toJsonLd`, `BreadcrumbJsonLd`, `breadcrumbsToJsonLd`
    - `BreadcrumbsProps`, `BreadcrumbItem`, `PathCrumbOptions`, `PathBreadcrumb`, `ReactRouterBreadcrumbsOptions`, `JsonLdBreadcrumb`, `JsonLdOptions`

### Dependency cleanup

- **Removed:** runtime dependency on `@ameshkin/orchestrator` from `@ameshkin/nextcrumbs`.
  - This avoids install issues in external projects and keeps the public package focused on breadcrumbs only.


