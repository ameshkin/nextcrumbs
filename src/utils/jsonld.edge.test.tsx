/**
 * Tests for JSON-LD utilities edge cases
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { toJsonLd, breadcrumbsToJsonLd, BreadcrumbJsonLd } from "./jsonld";
import type { BreadcrumbItem } from "../Breadcrumbs";

describe("toJsonLd edge cases", () => {
  it("handles crumbs with empty name", () => {
    const crumbs = [
      { name: "", href: "/" },
      { name: "Products" },
    ];
    const result = toJsonLd(crumbs);
    expect(result.itemListElement[0].name).toBe("");
  });

  it("handles crumbs with invalid URLs", () => {
    const crumbs = [
      { name: "Home", href: "not-a-url" },
    ];
    // Should not throw, but URL constructor might handle it
    expect(() => toJsonLd(crumbs, { origin: "https://example.com" })).not.toThrow();
  });

  it("handles origin with trailing slash", () => {
    const crumbs = [{ name: "Home", href: "/" }];
    const result = toJsonLd(crumbs, { origin: "https://example.com/" });
    expect(result.itemListElement[0].item).toBe("https://example.com/");
  });

  it("handles origin without protocol", () => {
    const crumbs = [{ name: "Home", href: "/" }];
    // URL constructor will throw for invalid URLs, but we now catch and handle gracefully
    // The item property will be omitted if URL construction fails
    const result = toJsonLd(crumbs, { origin: "example.com" });
    expect(result.itemListElement[0].name).toBe("Home");
    // item should be omitted due to invalid origin
    expect(result.itemListElement[0].item).toBeUndefined();
  });

  it("handles very long item URLs", () => {
    const longPath = "/" + "a".repeat(200);
    const crumbs = [{ name: "Long", href: longPath }];
    const result = toJsonLd(crumbs, { origin: "https://example.com" });
    expect(result.itemListElement[0].item).toContain(longPath);
  });

  it("handles special characters in name", () => {
    const crumbs = [
      { name: "Product & Services < > \" '", href: "/products" },
    ];
    const result = toJsonLd(crumbs);
    expect(result.itemListElement[0].name).toBe("Product & Services < > \" '");
  });

  it("handles unicode characters in name", () => {
    const crumbs = [
      { name: "Café & Résumé", href: "/cafe" },
    ];
    const result = toJsonLd(crumbs);
    expect(result.itemListElement[0].name).toBe("Café & Résumé");
  });

  it("handles item with hash fragment", () => {
    const crumbs = [
      { name: "Section", href: "/page#section" },
    ];
    const result = toJsonLd(crumbs, { origin: "https://example.com" });
    expect(result.itemListElement[0].item).toBe("https://example.com/page#section");
  });

  it("handles item with query string", () => {
    const crumbs = [
      { name: "Search", href: "/search?q=test" },
    ];
    const result = toJsonLd(crumbs, { origin: "https://example.com" });
    expect(result.itemListElement[0].item).toBe("https://example.com/search?q=test");
  });

  it("handles very large array of crumbs", () => {
    const crumbs = Array.from({ length: 100 }, (_, i) => ({
      name: `Item ${i}`,
      href: `/item-${i}`,
    }));
    const result = toJsonLd(crumbs);
    expect(result.itemListElement).toHaveLength(100);
    expect(result.itemListElement[99].position).toBe(100);
  });
});

describe("breadcrumbsToJsonLd edge cases", () => {
  it("handles items with empty label", () => {
    const items: BreadcrumbItem[] = [
      { label: "", href: "/" },
      { label: "Products" },
    ];
    const result = breadcrumbsToJsonLd(items);
    expect(result[0].name).toBe("");
  });

  it("handles items with null/undefined href", () => {
    const items: BreadcrumbItem[] = [
      { label: "Home", href: undefined },
      { label: "Products" },
    ];
    const result = breadcrumbsToJsonLd(items);
    expect(result[0].item).toBeUndefined();
    expect(result[1].item).toBeUndefined();
  });

  it("handles items with very long labels", () => {
    const longLabel = "A".repeat(1000);
    const items: BreadcrumbItem[] = [
      { label: longLabel, href: "/long" },
    ];
    const result = breadcrumbsToJsonLd(items);
    expect(result[0].name).toBe(longLabel);
  });

  it("handles items with special characters in href", () => {
    const items: BreadcrumbItem[] = [
      { label: "Search", href: "/search?q=test&sort=date" },
    ];
    const result = breadcrumbsToJsonLd(items);
    // breadcrumbsToJsonLd converts to { name, href } format
    expect(result[0].href).toBe("/search?q=test&sort=date");
  });
});

describe("BreadcrumbJsonLd edge cases", () => {
  it("handles crumbs prop changing", () => {
    const crumbs1 = [{ name: "Home", item: "/" }];
    const crumbs2 = [{ name: "Home", item: "/" }, { name: "Products" }];

    const { container, rerender } = render(
      <BreadcrumbJsonLd crumbs={crumbs1} origin="https://example.com" />
    );

    const firstContent = container.querySelector('script')?.textContent;

    rerender(<BreadcrumbJsonLd crumbs={crumbs2} origin="https://example.com" />);

    const secondContent = container.querySelector('script')?.textContent;
    expect(secondContent).not.toBe(firstContent);
    const parsed = JSON.parse(secondContent!);
    expect(parsed.itemListElement).toHaveLength(2);
  });

  it("handles origin prop changing", () => {
    const crumbs = [{ name: "Home", href: "/" }];

    const { container, rerender } = render(
      <BreadcrumbJsonLd crumbs={crumbs} origin="https://example.com" />
    );

    const firstContent = container.querySelector('script')?.textContent;
    const firstParsed = JSON.parse(firstContent!);
    expect(firstParsed.itemListElement[0].item).toBe("https://example.com/");

    rerender(<BreadcrumbJsonLd crumbs={crumbs} origin="https://other.com" />);

    const secondContent = container.querySelector('script')?.textContent;
    const secondParsed = JSON.parse(secondContent!);
    // Origin changed, so item URL should change (memoization should update)
    expect(secondParsed.itemListElement[0].item).toBe("https://other.com/");
  });

  it("handles missing origin prop", () => {
    const crumbs = [{ name: "Home", href: "/" }];
    const { container } = render(<BreadcrumbJsonLd crumbs={crumbs} />);
    const script = container.querySelector('script');
    expect(script).toBeTruthy();
    const parsed = JSON.parse(script!.textContent!);
    // When origin is missing, it defaults to "https://example.com"
    expect(parsed.itemListElement[0].item).toBe("https://example.com/");
  });

  it("handles empty crumbs array", () => {
    const { container } = render(
      <BreadcrumbJsonLd crumbs={[]} origin="https://example.com" />
    );
    const script = container.querySelector('script');
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed.itemListElement).toEqual([]);
  });
});

