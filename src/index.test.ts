/**
 * Test that all exports are available and correctly typed
 */

import { describe, it, expect } from "vitest";
import {
  NextCrumb,
  Breadcrumbs,
  usePathBreadcrumbs,
  useReactRouterBreadcrumbs,
  useRRBreadcrumbs,
  toJsonLd,
  BreadcrumbJsonLd,
  breadcrumbsToJsonLd,
  type BreadcrumbsProps,
  type BreadcrumbItem,
  type PathCrumbOptions,
  type PathBreadcrumb,
  type ReactRouterBreadcrumbsOptions,
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

  it("exports useReactRouterBreadcrumbs hook", () => {
    expect(useReactRouterBreadcrumbs).toBeDefined();
    expect(typeof useReactRouterBreadcrumbs).toBe("function");
  });

  it("exports useRRBreadcrumbs alias", () => {
    expect(useRRBreadcrumbs).toBeDefined();
    expect(typeof useRRBreadcrumbs).toBe("function");
  });

  it("useRRBreadcrumbs and useReactRouterBreadcrumbs are the same", () => {
    expect(useRRBreadcrumbs).toBe(useReactRouterBreadcrumbs);
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
    // Type-only exports, just verify they're importable
    const _types: {
      BreadcrumbsProps: BreadcrumbsProps;
      BreadcrumbItem: BreadcrumbItem;
      PathCrumbOptions: PathCrumbOptions;
      PathBreadcrumb: PathBreadcrumb;
      ReactRouterBreadcrumbsOptions: ReactRouterBreadcrumbsOptions;
      JsonLdBreadcrumb: JsonLdBreadcrumb;
      JsonLdOptions: JsonLdOptions;
    } = {} as any;
    expect(_types).toBeDefined();
  });
});

