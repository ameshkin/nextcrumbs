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
import { useLocation } from "react-router-dom"

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
