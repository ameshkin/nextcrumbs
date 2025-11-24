import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { toJsonLd, breadcrumbsToJsonLd, BreadcrumbJsonLd } from "./jsonld";
import type { BreadcrumbItem } from "../Breadcrumbs";

describe("toJsonLd", () => {
  it("converts breadcrumb items to JSON-LD format", () => {
    const crumbs = [
      { name: "Home", href: "/" },
      { name: "Products", href: "/products" },
      { name: "New Product" },
    ];

    const result = toJsonLd(crumbs, { origin: "https://example.com" });

    expect(result).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://example.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Products",
          item: "https://example.com/products",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "New Product",
        },
      ],
    });
  });

  it("uses default origin when not provided", () => {
    const crumbs = [{ name: "Home", href: "/" }];
    const result = toJsonLd(crumbs);

    expect(result.itemListElement[0].item).toBe("https://example.com/");
  });

  it("handles empty array", () => {
    const result = toJsonLd([]);
    expect(result.itemListElement).toEqual([]);
  });

  it("handles relative and absolute URLs correctly", () => {
    const crumbs = [
      { name: "Home", href: "/" },
      { name: "About", href: "https://other.com/about" },
    ];
    const result = toJsonLd(crumbs, { origin: "https://example.com" });

    expect(result.itemListElement[0].item).toBe("https://example.com/");
    expect(result.itemListElement[1].item).toBe("https://other.com/about");
  });
});

describe("breadcrumbsToJsonLd", () => {
  it("converts BreadcrumbItem array to JsonLdBreadcrumb format", () => {
    const items: BreadcrumbItem[] = [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "New Product" },
    ];

    const result = breadcrumbsToJsonLd(items);

    expect(result).toEqual([
      { name: "Home", href: "/" },
      { name: "Products", href: "/products" },
      { name: "New Product" },
    ]);
  });

  it("handles items with icons and titles (ignores them)", () => {
    const items: BreadcrumbItem[] = [
      { label: "Home", href: "/", icon: <span data-testid="icon" />, title: "Home page" },
      { label: "Products", external: true },
    ];

    const result = breadcrumbsToJsonLd(items);

    expect(result).toEqual([
      { name: "Home", href: "/" },
      { name: "Products" },
    ]);
  });

  it("handles empty array", () => {
    expect(breadcrumbsToJsonLd([])).toEqual([]);
  });
});

describe("BreadcrumbJsonLd", () => {
  it("renders script tag with JSON-LD", () => {
    const crumbs = [
      { name: "Home", href: "/" },
      { name: "Products" },
    ];

    const { container } = render(
      <BreadcrumbJsonLd crumbs={crumbs} origin="https://example.com" />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();

    const content = script?.textContent;
    expect(content).toBeTruthy();

    const parsed = JSON.parse(content!);
    expect(parsed["@type"]).toBe("BreadcrumbList");
    expect(parsed.itemListElement).toHaveLength(2);
  });

  it("uses default origin when not provided", () => {
    const crumbs = [{ name: "Home", href: "/" }];
    const { container } = render(<BreadcrumbJsonLd crumbs={crumbs} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed.itemListElement[0].item).toBe("https://example.com/");
  });

  it("memoizes JSON-LD output", () => {
    const crumbs = [{ name: "Home", href: "/" }];
    const { container, rerender } = render(
      <BreadcrumbJsonLd crumbs={crumbs} origin="https://example.com" />
    );

    const firstContent = container.querySelector('script')?.textContent;

    rerender(<BreadcrumbJsonLd crumbs={crumbs} origin="https://example.com" />);
    const secondContent = container.querySelector('script')?.textContent;

    expect(firstContent).toBe(secondContent);
  });
});

