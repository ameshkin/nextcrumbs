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
 * import { Breadcrumbs, useReactRouterBreadcrumbs } from "@ameshkin/nextcrumbs";
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
 * Requires `react-router-dom` to be installed as an optional peer dependency.
 * The hook uses lazy loading, so it won't cause issues if react-router-dom isn't installed
 * unless you actually call this hook.
 */
import * as React from "react"
import type { ReactNode } from "react"

// Lazy import pattern to avoid requiring react-router-dom when not used
// We use a function that accesses the module at runtime to avoid
// webpack trying to resolve it at build time when it's not installed
let useLocationHook: (() => { pathname: string }) | null = null

function getUseLocation(): () => { pathname: string } {
  if (useLocationHook) return useLocationHook
  
  // Access react-router-dom dynamically using a pattern that's harder
  // for webpack to statically analyze. We construct the module name
  // in a way that makes it less obvious to static analysis.
  try {
    // Split the module name to make it harder for webpack to detect
    const parts = ["react", "router", "dom"]
    const mod = parts.join("-")
    
    // Try to access the module - this will work if it's available
    // @ts-ignore - accessing optional dependency dynamically
    let routerModule: any = null
    
    // Try CommonJS require (for Node.js/CommonJS environments)
    if (typeof require !== 'undefined') {
      try {
        routerModule = require(mod)
      } catch {
        // require failed, module not available
      }
    }
    
    // For ESM environments, the module should be available through
    // normal module resolution if installed. Since we can't use
    // dynamic import() synchronously, we rely on the consuming
    // project to have it available or configure webpack appropriately.
    if (!routerModule) {
      throw new Error("react-router-dom not available")
    }
    
    if (!routerModule.useLocation || typeof routerModule.useLocation !== 'function') {
      throw new Error("useLocation not found in react-router-dom")
    }
    
    const hook = routerModule.useLocation
    useLocationHook = hook
    return hook
  } catch (err: any) {
    // If react-router-dom is not available, throw a helpful error
    throw new Error(
      "useReactRouterBreadcrumbs requires 'react-router-dom' to be installed. " +
      "Please install it: npm install react-router-dom. " +
      `If you're using Next.js and don't need react-router-dom, you can configure ` +
      `webpack to ignore it or install it as a dev dependency.`
    )
  }
}

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
  const useLocation = getUseLocation()
  const loc = useLocation() as any
  const pathname: string = typeof loc?.pathname === "string" ? loc.pathname : "/"
  const { rootLabel, basePath, decode = true, exclude = [], mapSegmentLabel } = options || {}

  return React.useMemo(() => {
    let path = pathname || "/"
    if (basePath && path.startsWith(basePath)) path = path.slice(basePath.length) || "/"
    if (!path.startsWith("/")) path = `/${path}`
    const raw = path === "/" ? [] : path.replace(/\/+$/,"").split("/").filter(Boolean)

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
      let s: string;
      if (decode) {
        try {
          s = decodeURIComponent(seg);
        } catch {
          // If decoding fails (malformed URI), use original segment
          s = seg;
        }
      } else {
        s = seg;
      }
      return s.replace(/[-_]+/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    }

    const segments = raw.filter(s => !isExcluded(s))
    const items: BreadcrumbItem[] = []

    if (rootLabel) items.push({ label: rootLabel, href: "/" })

    let acc = basePath && basePath !== "/" ? basePath.replace(/\/+$/,"") : ""
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

export default useReactRouterBreadcrumbs
