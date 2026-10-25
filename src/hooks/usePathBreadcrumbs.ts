"use client";

import * as React from "react";
import {
  buildPathBreadcrumbs,
  type PathBreadcrumb,
  type PathCrumbOptions,
} from "../utils/buildPathBreadcrumbs";

export type { PathBreadcrumb, PathCrumbOptions };

/**
 * Converts a Next.js pathname into an array of breadcrumb items.
 * Thin client wrapper around the RSC-safe `buildPathBreadcrumbs` helper.
 *
 * @param pathname - Current pathname (e.g., from `usePathname()` in Next.js App Router)
 * @param options - Configuration options for customizing the breadcrumb generation
 * @returns Array of breadcrumb items with `label` and optional `href` properties
 *
 * @example
 * ```tsx
 * import { usePathname } from "next/navigation";
 * import { usePathBreadcrumbs } from "@ameshkin/nextcrumbs";
 *
 * function MyBreadcrumbs() {
 *   const pathname = usePathname();
 *   const items = usePathBreadcrumbs(pathname, {
 *     rootLabel: "Home",
 *     labelMap: { "products": "Products", "new": "Create New" },
 *     exclude: ["_private"]
 *   });
 *   return <Breadcrumbs items={items} />;
 * }
 * ```
 */
export function usePathBreadcrumbs(
  pathname: string,
  options: PathCrumbOptions = {}
): PathBreadcrumb[] {
  const {
    baseHref = "/",
    labelMap = {},
    exclude = [],
    decode = true,
    transformLabel,
    rootLabel = "Dashboard",
  } = options;

  const excludeKey = exclude.join("\0");
  const labelMapKey = JSON.stringify(labelMap);

  return React.useMemo(
    () =>
      buildPathBreadcrumbs(pathname, {
        baseHref,
        labelMap,
        exclude,
        decode,
        transformLabel,
        rootLabel,
      }),
    // labelMap / exclude compared via stable serialized keys
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname, baseHref, labelMapKey, excludeKey, decode, transformLabel, rootLabel]
  );
}
