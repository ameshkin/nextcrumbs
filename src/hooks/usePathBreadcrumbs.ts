"use client";

import * as React from "react";

export type PathBreadcrumb = {
  label: string;
  href?: string;
};

export type PathCrumbOptions = {
  /** Starting path prefix for the first crumb (default: "/") */
  baseHref?: string;
  /** Custom label overrides per URL segment */
  labelMap?: Record<string, string>;
  /** Segment values to omit from the breadcrumb trail */
  exclude?: string[];
  /** Whether to decode URI segments using decodeURIComponent (default: true) */
  decode?: boolean;
  /** Optional custom label formatter function for each segment */
  transformLabel?: (segment: string) => string;
  /** Label for the root/home breadcrumb item (default: "Dashboard") */
  rootLabel?: string;
};

/**
 * Converts a Next.js pathname into an array of breadcrumb items.
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
  {
    baseHref = "/",
    labelMap = {},
    exclude = [],
    decode = true,
    transformLabel,
    rootLabel = "Dashboard",
  }: PathCrumbOptions = {}
): PathBreadcrumb[] {
  const excludeSet = React.useMemo(() => new Set(exclude), [exclude]);

  const parts = React.useMemo(() => {
    if (typeof pathname !== "string") return [] as string[];
    return pathname
      .replace(/^\/+/, "")
      .split("/")
      .filter(Boolean)
      .filter((seg) => !excludeSet.has(seg));
  }, [pathname, excludeSet]);

  return React.useMemo(() => {
    const items: PathBreadcrumb[] = [];

    let href = baseHref.replace(/\/+$/, "");
    if (!href.startsWith("/")) href = "/" + href;

    if (!parts.length) {
      return baseHref === "/"
        ? [{ label: rootLabel }]
        : [{ label: rootLabel, href: baseHref }];
    }

    items.push({ label: rootLabel, href: baseHref });

    parts.forEach((seg, i) => {
      href += `/${seg}`;
      href = href.replace(/\/+/g, "/");

      let raw: string;
      if (decode) {
        try {
          raw = decodeURIComponent(seg);
        } catch {
          // If decoding fails (malformed URI), use original segment
          raw = seg;
        }
      } else {
        raw = seg;
      }
      const fallback = raw.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
      let label: string;
      if (labelMap[seg] !== undefined) {
        label = labelMap[seg]!;
      } else if (transformLabel) {
        try {
          label = transformLabel(raw);
        } catch {
          // If user callback throws, fall back to safe formatting
          label = fallback;
        }
      } else {
        label = fallback;
      }

      items.push({
        label,
        href: i < parts.length - 1 ? href : undefined,
      });
    });

    return items;
  }, [parts, baseHref, labelMap, decode, transformLabel, rootLabel]);
}
