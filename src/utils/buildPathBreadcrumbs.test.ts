import { describe, it, expect } from "vitest";
import { buildPathBreadcrumbs } from "./buildPathBreadcrumbs";

describe("buildPathBreadcrumbs", () => {
  it("builds a trail from a pathname", () => {
    expect(
      buildPathBreadcrumbs("/products/new", {
        rootLabel: "Home",
        labelMap: { new: "Create" },
      })
    ).toEqual([
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Create" },
    ]);
  });

  it("returns a current-only root crumb at /", () => {
    expect(buildPathBreadcrumbs("/", { rootLabel: "Home" })).toEqual([{ label: "Home" }]);
  });

  it("excludes segments", () => {
    expect(
      buildPathBreadcrumbs("/a/_skip/b", { exclude: ["_skip"], rootLabel: "Root" })
    ).toEqual([
      { label: "Root", href: "/" },
      { label: "A", href: "/a" },
      { label: "B" },
    ]);
  });
});
