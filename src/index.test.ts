/**
 * Test that main-entry exports are available and correctly typed.
 * React Router hooks are intentionally NOT on the main entry (optional peer).
 */

import { describe, it, expect } from "vitest";
import {
  NextCrumb,
  Breadcrumbs,
  usePathBreadcrumbs,
  buildPathBreadcrumbs,
  getLinkRoutingProps,
  toJsonLd,
  BreadcrumbJsonLd,
  breadcrumbsToJsonLd,
  type BreadcrumbsProps,
  type BreadcrumbItem,
  type PathCrumbOptions,
  type PathBreadcrumb,
  type JsonLdBreadcrumb,
  type JsonLdOptions,
} from "./index";

describe("index exports", () => {
  it("exports NextCrumb component", () => {
    expect(NextCrumb).toBeDefined();
    expect(typeof NextCrumb).toBe("function");
  });

  it("exports Breadcrumbs component (alias)", () => {
    expect(Breadcrumbs).toBeDefined();
    expect(typeof Breadcrumbs).toBe("function");
  });

  it("NextCrumb and Breadcrumbs are the same component", () => {
    expect(NextCrumb).toBe(Breadcrumbs);
  });

  it("exports usePathBreadcrumbs hook", () => {
    expect(usePathBreadcrumbs).toBeDefined();
    expect(typeof usePathBreadcrumbs).toBe("function");
  });

  it("exports buildPathBreadcrumbs pure helper", () => {
    expect(buildPathBreadcrumbs).toBeDefined();
    expect(typeof buildPathBreadcrumbs).toBe("function");
    expect(buildPathBreadcrumbs("/a/b", { rootLabel: "Home" })).toEqual([
      { label: "Home", href: "/" },
      { label: "A", href: "/a" },
      { label: "B" },
    ]);
  });

  it("exports getLinkRoutingProps helper", () => {
    expect(getLinkRoutingProps("/x", "to")).toEqual({ to: "/x", href: "/x" });
  });

  it("does not export React Router hooks from the main entry", async () => {
    const mod = await import("./index.js");
    expect(mod).not.toHaveProperty("useReactRouterBreadcrumbs");
    expect(mod).not.toHaveProperty("useRRBreadcrumbs");
  });

  it("exports toJsonLd function", () => {
    expect(toJsonLd).toBeDefined();
    expect(typeof toJsonLd).toBe("function");
  });

  it("exports BreadcrumbJsonLd component", () => {
    expect(BreadcrumbJsonLd).toBeDefined();
    expect(typeof BreadcrumbJsonLd).toBe("function");
  });

  it("exports breadcrumbsToJsonLd function", () => {
    expect(breadcrumbsToJsonLd).toBeDefined();
    expect(typeof breadcrumbsToJsonLd).toBe("function");
  });

  it("exports all type definitions", () => {
    const _types: {
      BreadcrumbsProps: BreadcrumbsProps;
      BreadcrumbItem: BreadcrumbItem;
      PathCrumbOptions: PathCrumbOptions;
      PathBreadcrumb: PathBreadcrumb;
      JsonLdBreadcrumb: JsonLdBreadcrumb;
      JsonLdOptions: JsonLdOptions;
    } = {} as any;
    expect(_types).toBeDefined();
  });
});
