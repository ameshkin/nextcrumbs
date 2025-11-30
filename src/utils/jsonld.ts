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

const DANGEROUS_PROPERTY_NAMES = new Set(["__proto__", "constructor", "prototype"]);

function isSafeName(name: unknown): name is string {
  return typeof name === "string" && !DANGEROUS_PROPERTY_NAMES.has(name);
}

function safeCrumbs(input: unknown): JsonLdBreadcrumb[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((c): c is JsonLdBreadcrumb => !!c && typeof c === "object" && isSafeName((c as any).name))
    .map((c) => ({
      name: (c as any).name as string,
      href: typeof (c as any).href === "string" ? (c as any).href : undefined,
    }));
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    // Fallback to an empty BreadcrumbList if something goes wrong
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [],
    });
  }
}

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
  crumbs: JsonLdBreadcrumb[] | unknown,
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

  const safe = safeCrumbs(crumbs);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: safe.map((crumb, index) => {
      const item: {
        "@type": "ListItem";
        position: number;
        name: string;
        item?: string;
      } = {
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
      };
      
      if (crumb.href) {
        try {
          item.item = new URL(crumb.href, origin).toString();
        } catch {
          // If URL construction fails, skip the item property
          // This prevents DoS attacks from malformed URLs
        }
      }
      
      return item;
    }),
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
  crumbs: JsonLdBreadcrumb[] | unknown;
  origin?: string;
}): React.JSX.Element {
  // BUG-028: useMemo depends on crumbs array reference - callers should memoize crumbs array
  // to avoid unnecessary recalculations when array reference changes but content is the same
  const json = React.useMemo(() => toJsonLd(crumbs, { origin }), [crumbs, origin]);
  return React.createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: safeStringify(json) },
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
export function breadcrumbsToJsonLd(items: BreadcrumbItem[] | unknown): JsonLdBreadcrumb[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item): item is BreadcrumbItem => {
      // Filter out items with invalid or missing labels
      // Note: Empty string labels are intentionally allowed (see BUG-027)
      return item != null && typeof item === "object" && typeof (item as BreadcrumbItem).label === "string";
    })
    .map((item) => ({
      name: item.label, // label is guaranteed to be string after filter (empty strings allowed)
      href: item.href,
    }));
}

