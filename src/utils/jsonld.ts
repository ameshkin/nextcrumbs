import * as React from "react";
import type { BreadcrumbItem } from "../Breadcrumbs";

/**
 * Type for breadcrumb items used in JSON-LD generation.
 * Compatible with both `BreadcrumbItem` and simpler `{ name, href? }` objects.
 */
export type JsonLdBreadcrumb = {
  name: string;
  href?: string;
};

/**
 * Options for generating JSON-LD structured data.
 */
export type JsonLdOptions = {
  /** Base URL origin for resolving relative hrefs (default: "https://example.com") */
  origin?: string;
};

/**
 * Converts an array of breadcrumb items into JSON-LD structured data
 * following the schema.org BreadcrumbList specification.
 *
 * @param crumbs - Array of breadcrumb items with `name` and optional `href`
 * @param options - Configuration options for JSON-LD generation
 * @returns JSON-LD object ready for serialization
 *
 * @example
 * ```tsx
 * import { toJsonLd } from "@ameshkin/nextcrumbs";
 *
 * const crumbs = [
 *   { name: "Home", href: "/" },
 *   { name: "Products", href: "/products" },
 *   { name: "New Product" }
 * ];
 *
 * const jsonLd = toJsonLd(crumbs, { origin: "https://example.com" });
 * // Use with: <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
 * ```
 */
export function toJsonLd(
  crumbs: JsonLdBreadcrumb[],
  options: JsonLdOptions = {}
): {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
} {
  const { origin = "https://example.com" } = options;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(crumb.href ? { item: new URL(crumb.href, origin).toString() } : {}),
    })),
  };
}

/**
 * React component that renders a JSON-LD script tag for breadcrumb structured data.
 *
 * @param props - Component props
 * @param props.crumbs - Array of breadcrumb items with `name` and optional `href`
 * @param props.origin - Base URL origin for resolving relative hrefs (default: "https://example.com")
 *
 * @example
 * ```tsx
 * import { BreadcrumbJsonLd } from "@ameshkin/nextcrumbs";
 *
 * function MyPage() {
 *   const crumbs = [
 *     { name: "Home", href: "/" },
 *     { name: "Products", href: "/products" },
 *     { name: "New Product" }
 *   ];
 *
 *   return (
 *     <>
 *       <BreadcrumbJsonLd crumbs={crumbs} origin="https://example.com" />
 *       <Breadcrumbs items={crumbs.map(c => ({ label: c.name, href: c.href }))} />
 *     </>
 *   );
 * }
 * ```
 */
export function BreadcrumbJsonLd({
  crumbs,
  origin = "https://example.com",
}: {
  crumbs: JsonLdBreadcrumb[];
  origin?: string;
}): React.JSX.Element {
  const json = React.useMemo(() => toJsonLd(crumbs, { origin }), [crumbs, origin]);
  return React.createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(json) },
  });
}

/**
 * Helper function to convert `BreadcrumbItem` objects (from the Breadcrumbs component)
 * to `JsonLdBreadcrumb` format for JSON-LD generation.
 *
 * @param items - Array of `BreadcrumbItem` objects from the Breadcrumbs component
 * @returns Array of `JsonLdBreadcrumb` objects suitable for JSON-LD
 *
 * @example
 * ```tsx
 * import { Breadcrumbs, breadcrumbsToJsonLd, BreadcrumbJsonLd } from "@ameshkin/nextcrumbs";
 *
 * function MyPage() {
 *   const items = [
 *     { label: "Home", href: "/" },
 *     { label: "Products", href: "/products" },
 *     { label: "New Product" }
 *   ];
 *
 *   return (
 *     <>
 *       <BreadcrumbJsonLd crumbs={breadcrumbsToJsonLd(items)} origin="https://example.com" />
 *       <Breadcrumbs items={items} />
 *     </>
 *   );
 * }
 * ```
 */
export function breadcrumbsToJsonLd(items: BreadcrumbItem[]): JsonLdBreadcrumb[] {
  return items.map((item) => ({
    name: item.label,
    href: item.href,
  }));
}

