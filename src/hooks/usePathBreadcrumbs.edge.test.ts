/**
 * Tests for usePathBreadcrumbs edge cases and error scenarios
 */

import { renderHook } from "@testing-library/react";
import { usePathBreadcrumbs } from "./usePathBreadcrumbs";

describe("usePathBreadcrumbs edge cases", () => {
  it("handles pathname with multiple slashes", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("///products///new///", {
        baseHref: "/",
      })
    );

    expect(result.current).toEqual([
      { label: "Dashboard", href: "/" },
      { label: "Products", href: "/products" },
      { label: "New" },
    ]);
  });

  it("handles pathname with only slashes", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("///", {
        baseHref: "/",
      })
    );

    expect(result.current).toEqual([
      { label: "Dashboard" },
    ]);
  });

  it("handles pathname with encoded special characters", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/my%20product%20name", {
        decode: true,
      })
    );

    expect(result.current).toEqual([
      { label: "Dashboard", href: "/" },
      { label: "Products", href: "/products" },
      { label: "My Product Name" },
    ]);
  });

  it("handles pathname with unicode characters", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/café", {
        decode: true,
      })
    );

    expect(result.current[2].label).toContain("Café");
  });

  it("handles labelMap overriding transformLabel", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/new", {
        labelMap: { new: "Create" },
        transformLabel: (seg) => seg.toUpperCase(),
      })
    );

    // labelMap should take precedence over transformLabel
    const items = result.current;
    expect(items[0].label).toBe("Dashboard");
    // "products" is not in labelMap, so transformLabel applies -> "PRODUCTS"
    expect(items[1].label).toBe("PRODUCTS");
    // "new" is in labelMap, so labelMap takes precedence -> "Create"
    expect(items[2].label).toBe("Create");
  });

  it("handles exclude with multiple segments", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/_internal/_private/new", {
        exclude: ["_internal", "_private"],
      })
    );

    expect(result.current).toEqual([
      { label: "Dashboard", href: "/" },
      { label: "Products", href: "/products" },
      { label: "New" },
    ]);
  });

  it("handles exclude with segments that don't exist", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/new", {
        exclude: ["_nonexistent"],
      })
    );

    expect(result.current).toEqual([
      { label: "Dashboard", href: "/" },
      { label: "Products", href: "/products" },
      { label: "New" },
    ]);
  });

  it("handles transformLabel returning empty string", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/new", {
        transformLabel: () => "",
      })
    );

    const items = result.current;
    expect(items[2].label).toBe(""); // Empty string is allowed
  });

  it("handles very long pathname", () => {
    const longPath = "/" + "a".repeat(100) + "/" + "b".repeat(100);
    const { result } = renderHook(() =>
      usePathBreadcrumbs(longPath, {
        baseHref: "/",
      })
    );

    expect(result.current.length).toBe(3); // Dashboard + 2 segments
    // Labels are formatted: replace - with space, then capitalize first letter of each word
    // So "aaaa..." becomes "Aaaaa..." (only first letter capitalized)
    expect(result.current[1].label).toMatch(/^A[a]+$/); // First letter capitalized, rest lowercase
    expect(result.current[2].label).toMatch(/^B[b]+$/); // First letter capitalized, rest lowercase
  });

  it("handles pathname with hash", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/new#section", {
        baseHref: "/",
      })
    );

    // Hash should be included in the segment
    expect(result.current[2].label).toContain("New");
  });

  it("handles baseHref as empty string", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/new", {
        baseHref: "",
      })
    );

    const items = result.current;
    // Empty string baseHref is used as-is for root, but normalized for children
    expect(items[0].href).toBe(""); // Uses baseHref as-is for root
    expect(items[1].href).toBe("/products"); // Normalized for children
  });

  it("handles baseHref with query string", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/new", {
        baseHref: "/app?version=1",
      })
    );

    const items = result.current;
    expect(items[0].href).toBe("/app?version=1"); // Query string preserved in baseHref
  });

  it("handles labelMap with partial matches", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/new-item", {
        labelMap: { "new-item": "New Item" },
      })
    );

    expect(result.current).toEqual([
      { label: "Dashboard", href: "/" },
      { label: "Products", href: "/products" },
      { label: "New Item" },
    ]);
  });

  it("handles transformLabel with index context (should work with segment)", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/a/b/c", {
        transformLabel: (seg) => seg.toUpperCase(),
      })
    );

    expect(result.current[1].label).toBe("A");
    expect(result.current[2].label).toBe("B");
    expect(result.current[3].label).toBe("C");
  });

  it("handles pathname starting without slash", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("products/new", {
        baseHref: "/",
      })
    );

    expect(result.current).toEqual([
      { label: "Dashboard", href: "/" },
      { label: "Products", href: "/products" },
      { label: "New" },
    ]);
  });

  it("handles rootLabel with special characters", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products", {
        rootLabel: "Home & Dashboard",
      })
    );

    expect(result.current[0].label).toBe("Home & Dashboard");
  });

  it("handles rootLabel as empty string", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products", {
        rootLabel: "",
      })
    );

    expect(result.current[0].label).toBe("");
  });
});

