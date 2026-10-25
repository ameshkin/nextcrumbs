/**
 * Pure, RSC-safe path → breadcrumb builder.
 * Prefer this from Server Components. The `usePathBreadcrumbs` hook is a thin client wrapper.
 */

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
 * Converts a pathname into breadcrumb items without React hooks.
 *
 * @param pathname - Current pathname (for example `/products/new`)
 * @param options - Configuration for labels, excludes, and root crumb
 * @returns Breadcrumb items with `label` and optional `href`
 *
 * @example
 * ```ts
 * import { buildPathBreadcrumbs } from "@ameshkin/nextcrumbs/utils/buildPathBreadcrumbs";
 *
 * const items = buildPathBreadcrumbs("/products/new", {
 *   rootLabel: "Home",
 *   labelMap: { new: "Create New" },
 * });
 * ```
 */
export function buildPathBreadcrumbs(
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
  const excludeSet = new Set(exclude);

  const parts =
    typeof pathname !== "string"
      ? ([] as string[])
      : pathname
          .replace(/^\/+/, "")
          .split("/")
          .filter(Boolean)
          .filter((seg) => !excludeSet.has(seg));

  let href = baseHref.replace(/\/+$/, "");
  if (!href.startsWith("/")) href = "/" + href;

  if (!parts.length) {
    return baseHref === "/"
      ? [{ label: rootLabel }]
      : [{ label: rootLabel, href: baseHref }];
  }

  const items: PathBreadcrumb[] = [{ label: rootLabel, href: baseHref }];

  parts.forEach((seg, i) => {
    href += `/${seg}`;
    href = href.replace(/\/+/g, "/");

    let raw: string;
    if (decode) {
      try {
        raw = decodeURIComponent(seg);
      } catch {
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
}
