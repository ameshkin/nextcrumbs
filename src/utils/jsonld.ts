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
  /**
   * Base URL origin for resolving relative hrefs (for example `https://yoursite.com`).
   * Required to emit `item` URLs for relative paths. Absolute `http(s)` hrefs work without it.
   * There is no `example.com` default (avoids shipping bad SEO by accident).
   */
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
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [],
    });
  }
}

function isAbsoluteHttpUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function resolveItemUrl(href: string, origin?: string): string | undefined {
  try {
    if (isAbsoluteHttpUrl(href)) {
      return new URL(href).toString();
    }
    if (!origin) return undefined;
    return new URL(href, origin).toString();
  } catch {
    return undefined;
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
 * const jsonLd = toJsonLd(crumbs, { origin: "https://yoursite.com" });
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
  const { origin } = options;
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
        const resolved = resolveItemUrl(crumb.href, origin);
        if (resolved) item.item = resolved;
      }

      return item;
    }),
  };
}

function resolveClientOrigin(origin?: string): string | undefined {
  if (origin) return origin;
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return undefined;
}

/**
 * React component that renders a JSON-LD script tag for breadcrumb structured data.
 *
 * @param props.crumbs - Array of breadcrumb items with `name` and optional `href`
 * @param props.origin - Base URL origin for resolving relative hrefs.
 *   In the browser, falls back to `window.location.origin` when omitted.
 *   On the server, pass `origin` explicitly so relative URLs resolve.
 *
 * @example
 * ```tsx
 * import { BreadcrumbJsonLd } from "@ameshkin/nextcrumbs";
 *
 * <BreadcrumbJsonLd crumbs={crumbs} origin="https://yoursite.com" />
 * ```
 */
export function BreadcrumbJsonLd({
  crumbs,
  origin,
}: {
  crumbs: JsonLdBreadcrumb[] | unknown;
  origin?: string;
}): React.JSX.Element {
  const resolvedOrigin = resolveClientOrigin(origin);
  const json = toJsonLd(crumbs, { origin: resolvedOrigin });
  return React.createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: safeStringify(json) },
  });
}

/**
 * Helper function to convert `BreadcrumbItem` objects (from the Breadcrumbs component)
 * to `JsonLdBreadcrumb` format for JSON-LD generation.
 */
export function breadcrumbsToJsonLd(items: BreadcrumbItem[] | unknown): JsonLdBreadcrumb[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item): item is BreadcrumbItem => {
      return item != null && typeof item === "object" && typeof (item as BreadcrumbItem).label === "string";
    })
    .map((item) => ({
      name: item.label,
      href: item.href,
    }));
}
