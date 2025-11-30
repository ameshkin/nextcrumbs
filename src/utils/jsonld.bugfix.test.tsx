/**
 * Tests to verify bug fixes from bug hunt
 * Tests BUG-023, BUG-027
 */

import { describe, it, expect } from "vitest";
import { breadcrumbsToJsonLd } from "./jsonld";
import type { BreadcrumbItem } from "../Breadcrumbs";

describe("BUG-023: breadcrumbsToJsonLd filters invalid/null labels", () => {
  it("filters out items with undefined label", () => {
    const items = [
      { label: undefined as any, href: "/" },
      { label: "Valid", href: "/valid" },
      { label: null as any, href: "/null" },
    ];
    const result = breadcrumbsToJsonLd(items);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Valid");
    expect(result[0].href).toBe("/valid");
  });

  it("filters out items with null label", () => {
    const items = [
      { label: null as any },
      { label: "Valid" },
    ];
    const result = breadcrumbsToJsonLd(items);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Valid");
  });

  it("filters out items with non-string label", () => {
    const items = [
      { label: 123 as any },
      { label: {} as any },
      { label: [] as any },
      { label: "Valid" },
    ];
    const result = breadcrumbsToJsonLd(items);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Valid");
  });

  it("allows empty string labels (BUG-027: intentional behavior)", () => {
    const items: BreadcrumbItem[] = [
      { label: "", href: "/" },
      { label: "Valid" },
    ];
    const result = breadcrumbsToJsonLd(items);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("");
    expect(result[1].name).toBe("Valid");
  });

  it("handles completely invalid input", () => {
    const items = [
      null,
      undefined,
      {},
      { label: 123 },
      { label: "Valid" },
    ] as any;
    const result = breadcrumbsToJsonLd(items);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Valid");
  });

  it("handles non-array input", () => {
    expect(breadcrumbsToJsonLd(null as any)).toEqual([]);
    expect(breadcrumbsToJsonLd(undefined as any)).toEqual([]);
    expect(breadcrumbsToJsonLd("not an array" as any)).toEqual([]);
    expect(breadcrumbsToJsonLd({} as any)).toEqual([]);
  });
});

