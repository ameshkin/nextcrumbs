// Primary export as NextCrumb
export { default as NextCrumb } from "./Breadcrumbs"
// Alias for backward compatibility
export { default as Breadcrumbs } from "./Breadcrumbs"
export type { BreadcrumbsProps, BreadcrumbItem } from "./Breadcrumbs"

export { usePathBreadcrumbs } from "./hooks/usePathBreadcrumbs"
export type { PathCrumbOptions, PathBreadcrumb } from "./hooks/usePathBreadcrumbs"

// React Router hook lives on a subpath so the main entry does not require
// the optional peer `react-router-dom`:
//   import { useReactRouterBreadcrumbs } from "@ameshkin/nextcrumbs/hooks/useReactRouterBreadcrumbs"

export { toJsonLd, BreadcrumbJsonLd, breadcrumbsToJsonLd } from "./utils/jsonld"
export type { JsonLdBreadcrumb, JsonLdOptions } from "./utils/jsonld"
