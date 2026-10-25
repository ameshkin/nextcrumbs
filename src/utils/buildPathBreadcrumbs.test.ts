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

  it("excludes segments without leaving holes in hrefs", () => {
    expect(
      buildPathBreadcrumbs("/a/_skip/b", { exclude: ["_skip"], rootLabel: "Root" })
    ).toEqual([
      { label: "Root", href: "/" },
      { label: "A", href: "/a" },
      { label: "B" },
    ]);
  });

  it("does not treat empty or non-string pathnames as nested trails", () => {
    expect(buildPathBreadcrumbs("", { rootLabel: "Home" })).toEqual([{ label: "Home" }]);
    expect(buildPathBreadcrumbs(undefined as unknown as string, { rootLabel: "Home" })).toEqual([
      { label: "Home" },
    ]);
  });

  it("title-cases hyphenated segments when labelMap misses", () => {
    expect(buildPathBreadcrumbs("/user-settings/api-keys", { rootLabel: "Home" })).toEqual([
      { label: "Home", href: "/" },
      { label: "User Settings", href: "/user-settings" },
      { label: "Api Keys" },
    ]);
  });

  it("falls back safely when transformLabel throws", () => {
    expect(
      buildPathBreadcrumbs("/broken", {
        rootLabel: "Home",
        transformLabel: () => {
          throw new Error("boom");
        },
      })
    ).toEqual([{ label: "Home", href: "/" }, { label: "Broken" }]);
  });

  it("keeps undecoded segments when decode is false", () => {
    expect(
      buildPathBreadcrumbs("/hello%20world", { rootLabel: "Home", decode: false })
    ).toEqual([{ label: "Home", href: "/" }, { label: "Hello%20world" }]);
  });

  it("supports a non-root baseHref", () => {
    expect(
      buildPathBreadcrumbs("/child", { baseHref: "/app", rootLabel: "App" })
    ).toEqual([
      { label: "App", href: "/app" },
      { label: "Child" },
    ]);
  });
});
