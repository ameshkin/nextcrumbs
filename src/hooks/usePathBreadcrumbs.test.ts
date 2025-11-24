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
});
