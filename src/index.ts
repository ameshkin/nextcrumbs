// Primary export as NextCrumb
export { default as NextCrumb } from "./Breadcrumbs"
// Alias for backward compatibility
export { default as Breadcrumbs } from "./Breadcrumbs"
export type {
  BreadcrumbsProps,
  BreadcrumbItem,
  BreadcrumbLinkProp,
  BreadcrumbSize,
} from "./Breadcrumbs"

export { usePathBreadcrumbs } from "./hooks/usePathBreadcrumbs"
export type { PathCrumbOptions, PathBreadcrumb } from "./hooks/usePathBreadcrumbs"

// RSC-safe pure helper (also available at @ameshkin/nextcrumbs/utils/buildPathBreadcrumbs)
export { buildPathBreadcrumbs } from "./utils/buildPathBreadcrumbs"

// React Router hook lives on a subpath so the main entry does not require
// the optional peer `react-router-dom`:
//   import { useReactRouterBreadcrumbs } from "@ameshkin/nextcrumbs/hooks/useReactRouterBreadcrumbs"

export { toJsonLd, BreadcrumbJsonLd, breadcrumbsToJsonLd } from "./utils/jsonld"
export type { JsonLdBreadcrumb, JsonLdOptions } from "./utils/jsonld"
