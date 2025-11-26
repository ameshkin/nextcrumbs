import { renderHook } from "@testing-library/react";
import { usePathBreadcrumbs } from "./usePathBreadcrumbs";

describe("usePathBreadcrumbs", () => {
  it("generates correct breadcrumbs from path", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/new", {
        baseHref: "/",
        labelMap: { new: "Create" },
      })
    );

    expect(result.current).toEqual([
      { label: "Dashboard", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Create" },
    ]);
  });

  it("excludes segments correctly", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/_internal/edit", {
        exclude: ["_internal"],
      })
    );

    expect(result.current).toEqual([
      { label: "Dashboard", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Edit" },
    ]);
  });

  it("uses custom rootLabel", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/new", {
        rootLabel: "Home",
      })
    );

    expect(result.current).toEqual([
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "New" },
    ]);
  });

  it("handles empty pathname with custom rootLabel", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/", {
        rootLabel: "Home",
      })
    );

    expect(result.current).toEqual([
      { label: "Home" },
    ]);
  });

  it("handles decode option", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/my%20product", {
        decode: true,
      })
    );

    expect(result.current).toEqual([
      { label: "Dashboard", href: "/" },
      { label: "Products", href: "/products" },
      { label: "My Product" }, // Last item has no href, and label is formatted
    ]);
  });

  it("handles decode: false option", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/my%20product", {
        decode: false,
      })
    );

    expect(result.current).toEqual([
      { label: "Dashboard", href: "/" },
      { label: "Products", href: "/products" },
      { label: "My%20product" }, // Last item has no href, label is formatted but not decoded
    ]);
  });

  it("handles transformLabel function", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/new-item", {
        transformLabel: (segment) => segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      })
    );

    expect(result.current).toEqual([
      { label: "Dashboard", href: "/" },
      { label: "Products", href: "/products" },
      { label: "New Item" },
    ]);
  });

  it("handles custom baseHref", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/new", {
        baseHref: "/app",
      })
    );

    expect(result.current).toEqual([
      { label: "Dashboard", href: "/app" },
      { label: "Products", href: "/app/products" },
      { label: "New" },
    ]);
  });

  it("handles baseHref without leading slash", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/new", {
        baseHref: "app",
      })
    );

    // The code uses baseHref directly for the root item (line 79), not the normalized href
    // So "app" stays as "app" for the root item, but gets normalized for child paths
    const items = result.current;
    expect(items[0].label).toBe("Dashboard");
    expect(items[0].href).toBe("app"); // Uses baseHref as-is for root
    expect(items[1].label).toBe("Products");
    expect(items[1].href).toBe("/app/products"); // Normalized href for children
    expect(items[2].label).toBe("New");
    expect(items[2].href).toBeUndefined();
  });

  it("handles baseHref with trailing slash", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/new", {
        baseHref: "/app/",
      })
    );

    // The code uses baseHref directly for the root item, so "/app/" stays as "/app/"
    const items = result.current;
    expect(items[0].label).toBe("Dashboard");
    expect(items[0].href).toBe("/app/"); // Uses baseHref as-is for root
    expect(items[1].label).toBe("Products");
    expect(items[1].href).toBe("/app/products"); // Normalized href for children
    expect(items[2].label).toBe("New");
    expect(items[2].href).toBeUndefined();
  });

  it("handles empty pathname at root", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("", {
        baseHref: "/",
      })
    );

    expect(result.current).toEqual([
      { label: "Dashboard" },
    ]);
  });

  it("handles pathname with query string", () => {
    const { result } = renderHook(() =>
      usePathBreadcrumbs("/products/new?filter=active", {
        baseHref: "/",
      })
    );

    // The code processes the full string including query, so "new?filter=active" becomes a segment
    // This is expected behavior - the caller should strip query strings before passing to the hook
    // The split("/") will create segments: ["products", "new?filter=active"]
    const items = result.current;
    expect(items[0].label).toBe("Dashboard");
    expect(items[0].href).toBe("/");
    expect(items[1].label).toBe("Products");
    expect(items[1].href).toBe("/products");
    // The last segment includes the query string and gets formatted
    expect(items[2].label).toMatch(/New.*filter.*active/i);
    expect(items[2].href).toBeUndefined();
  });
});
