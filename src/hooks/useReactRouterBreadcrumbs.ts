/**
 * Derives breadcrumb items from React Router's current location.
 *
 * Automatically converts the current route pathname into breadcrumb items,
 * keeping the last segment as the current (non-link) item and building
 * cumulative hrefs for prior segments.
 *
 * @param options - Configuration options for breadcrumb generation
 * @param options.rootLabel - Optional first crumb label that links to "/"
 * @param options.basePath - Strip a leading base path from the URL when building crumbs
 * @param options.decode - Whether to decode URI segments using decodeURIComponent (default: true)
 * @param options.exclude - Array of strings or regexes to skip specific segments
 * @param options.mapSegmentLabel - Custom function to map a segment to a label or return null to hide it
 * @returns Array of breadcrumb items compatible with the `<Breadcrumbs />` component
 *
 * @example
 * ```tsx
 * import { BrowserRouter } from "react-router-dom";
 * import { Breadcrumbs } from "@ameshkin/nextcrumbs";
 * import { useReactRouterBreadcrumbs } from "@ameshkin/nextcrumbs/hooks/useReactRouterBreadcrumbs";
 *
 * function Trail() {
 *   const items = useReactRouterBreadcrumbs({
 *     rootLabel: "Home",
 *     exclude: [/^_/],
 *     mapSegmentLabel: (seg) => seg.replace(/-/g, " ").toUpperCase()
 *   });
 *   return <Breadcrumbs items={items} />;
 * }
 * ```
 *
 * @remarks
 * Requires `react-router-dom` as an optional peer dependency.
 * Import only from this subpath so the main `@ameshkin/nextcrumbs` entry
 * stays free of React Router for Next.js apps.
 */
import * as React from "react"
import type { ReactNode } from "react"
import { useLocation } from "react-router-dom"

/**
 * Breadcrumb item type compatible with the Breadcrumbs component.
 */
export type BreadcrumbItem = {
  /** Display label for the breadcrumb */
  label: string
  /** Optional href for the breadcrumb link (omit for current page) */
  href?: string
  /** Optional icon to display before the label */
  icon?: ReactNode
  /** Optional title/tooltip text for the breadcrumb */
  title?: string
  /** If true, adds `target="_blank"` and `rel="noopener noreferrer"` for external links */
  external?: boolean
}

/**
 * Configuration options for useReactRouterBreadcrumbs hook.
 */
export type ReactRouterBreadcrumbsOptions = {
  /** Optional first crumb label that links to "/" */
  rootLabel?: string
  /** Strip a leading base path from the URL when building crumbs */
  basePath?: string
  /** Whether to decode URI segments using decodeURIComponent (default: true) */
  decode?: boolean
  /** Array of strings or regexes to skip specific segments from the breadcrumb trail */
  exclude?: (string | RegExp)[]
  /** Custom function to map a segment to a label or return null to hide it */
  mapSegmentLabel?: (segment: string, index: number, segments: string[]) => string | null
}

export function useReactRouterBreadcrumbs(options?: ReactRouterBreadcrumbsOptions): BreadcrumbItem[] {
  const loc = useLocation() as { pathname?: string } | null | undefined
  const pathname: string = typeof loc?.pathname === "string" ? loc.pathname : "/"
  const { rootLabel, basePath, decode = true, exclude = [], mapSegmentLabel } = options || {}

  return React.useMemo(() => {
    let path = pathname || "/"
    if (basePath && path.startsWith(basePath)) path = path.slice(basePath.length) || "/"
    if (!path.startsWith("/")) path = `/${path}`
    const raw = path === "/" ? [] : path.replace(/\/+$/, "").split("/").filter(Boolean)

    const isExcluded = (seg: string) =>
      exclude.some((x) => {
        if (typeof x === "string") return x === seg
        try {
          return x.test(seg)
        } catch {
          // Treat invalid/mutated regex as non-matching
          return false
        }
      })

    const format = (seg: string) => {
      let s: string
      if (decode) {
        try {
          s = decodeURIComponent(seg)
        } catch {
          // If decoding fails (malformed URI), use original segment
          s = seg
        }
      } else {
        s = seg
      }
      return s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    }

    const segments = raw.filter((s) => !isExcluded(s))
    const items: BreadcrumbItem[] = []

    if (rootLabel) items.push({ label: rootLabel, href: "/" })

    let acc = basePath && basePath !== "/" ? basePath.replace(/\/+$/, "") : ""
    segments.forEach((seg, i) => {
      acc += `/${seg}`
      let label: string | null
      if (mapSegmentLabel) {
        try {
          label = mapSegmentLabel(seg, i, segments)
        } catch {
          // If user callback throws, fall back to default formatter
          label = format(seg)
        }
      } else {
        label = format(seg)
      }
      if (label === null) return
      const isLast = i === segments.length - 1
      items.push(isLast ? { label } : { label, href: acc || "/" })
    })

    if (!rootLabel && items.length === 0) items.push({ label: "Home", href: "/" })
    return items
  }, [pathname, rootLabel, basePath, decode, exclude, mapSegmentLabel])
}

/** Alias for `useReactRouterBreadcrumbs`. */
export const useRRBreadcrumbs = useReactRouterBreadcrumbs

export default useReactRouterBreadcrumbs
