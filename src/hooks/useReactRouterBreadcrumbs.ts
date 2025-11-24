/**
 * useReactRouterBreadcrumbs
 * Derives NextCrumbs-compatible breadcrumb items from React Router's current location.
 * Keeps the last segment as the current (non-link) item and builds cumulative hrefs for prior segments.
 * Options:
 *  - rootLabel: optional first crumb label (links to "/")
 *  - basePath: strip a leading base path from the URL when building crumbs
 *  - decode: decodeURIComponent on segments (default: true)
 *  - exclude: array of strings/regexes to skip specific segments
 *  - mapSegmentLabel: map a segment to a custom label or return null to hide it
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

export type BreadcrumbItem = {
  label: string
  href?: string
  icon?: ReactNode
  title?: string
  external?: boolean
}

export type ReactRouterBreadcrumbsOptions = {
  rootLabel?: string
  basePath?: string
  decode?: boolean
  exclude?: (string | RegExp)[]
  mapSegmentLabel?: (segment: string, index: number, segments: string[]) => string | null
}

export function useReactRouterBreadcrumbs(options?: ReactRouterBreadcrumbsOptions): BreadcrumbItem[] {
  const useLocation = getUseLocation()
  const { pathname } = useLocation()
  const { rootLabel, basePath, decode = true, exclude = [], mapSegmentLabel } = options || {}

  return React.useMemo(() => {
    let path = pathname || "/"
    if (basePath && path.startsWith(basePath)) path = path.slice(basePath.length) || "/"
    if (!path.startsWith("/")) path = `/${path}`
    const raw = path === "/" ? [] : path.replace(/\/+$/,"").split("/").filter(Boolean)

    const isExcluded = (seg: string) =>
      exclude.some(x => (typeof x === "string" ? x === seg : x.test(seg)))

    const format = (seg: string) => {
      const s = decode ? decodeURIComponent(seg) : seg
      return s.replace(/[-_]+/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    }

    const segments = raw.filter(s => !isExcluded(s))
    const items: BreadcrumbItem[] = []

    if (rootLabel) items.push({ label: rootLabel, href: "/" })

    let acc = basePath && basePath !== "/" ? basePath.replace(/\/+$/,"") : ""
    segments.forEach((seg, i) => {
      acc += `/${seg}`
      const label = mapSegmentLabel ? mapSegmentLabel(seg, i, segments) : format(seg)
      if (label === null) return
      const isLast = i === segments.length - 1
      items.push(isLast ? { label } : { label, href: acc || "/" })
    })

    if (!rootLabel && items.length === 0) items.push({ label: "Home", href: "/" })
    return items
  }, [pathname, rootLabel, basePath, decode, JSON.stringify(exclude), mapSegmentLabel])
}

export default useReactRouterBreadcrumbs
