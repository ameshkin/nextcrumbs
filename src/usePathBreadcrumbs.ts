"use client";

import * as React from "react";

export type PathBreadcrumb = {
  label: string;
  href?: string;
};

export type PathCrumbOptions = {
  baseHref?: string;
  labelMap?: Record<string, string>;
  exclude?: string[];
  decode?: boolean;
  transformLabel?: (segment: string) => string;
};

/**
 * usePathBreadcrumbs
 *
 * Converts a Next.js pathname into an array of breadcrumb items.
 *
 * @param pathname - Current pathname (e.g. from usePathname()).
 * @param options - Configuration options:
 *   - baseHref: Starting path prefix (default "/")
 *   - labelMap: Custom label overrides per segment
 *   - exclude: Segment values to omit from trail
 *   - decode: Whether to decode URI segments (default true)
 *   - transformLabel: Optional custom label formatter
 *
 * @returns Array of { label, href? } objects to be consumed by <Breadcrumbs />
 */
export function usePathBreadcrumbs(
  pathname: string,
  {
    baseHref = "/",
    labelMap = {},
    exclude = [],
    decode = true,
    transformLabel,
  }: PathCrumbOptions = {}
): PathBreadcrumb[] {
  const parts = React.useMemo(() => {
    return pathname
      .replace(/^\/+/, "")
      .split("/")
      .filter(Boolean)
      .filter((seg) => !exclude.includes(seg));
  }, [pathname, exclude]);

  return React.useMemo(() => {
    const items: PathBreadcrumb[] = [];

    let href = baseHref.replace(/\/+$/, "");
    if (!href.startsWith("/")) href = "/" + href;

    if (!parts.length) {
      return baseHref === "/"
        ? [{ label: "Dashboard" }]
        : [{ label: "Dashboard", href: baseHref }];
    }

    items.push({ label: "Dashboard", href: baseHref });

    parts.forEach((seg, i) => {
      href += `/${seg}`;
      href = href.replace(/\/+/g, "/");

      const raw = decode ? decodeURIComponent(seg) : seg;
      const label =
        labelMap[seg] ??
        transformLabel?.(raw) ??
        raw.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

      items.push({
        label,
        href: i < parts.length - 1 ? href : undefined,
      });
    });

    return items;
  }, [parts, baseHref, labelMap, decode, transformLabel]);
}
