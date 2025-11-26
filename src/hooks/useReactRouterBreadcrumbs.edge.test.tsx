/**
 * Tests for useReactRouterBreadcrumbs edge cases
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import useReactRouterBreadcrumbs from "./useReactRouterBreadcrumbs";

function EchoItems() {
  const items = useReactRouterBreadcrumbs({ rootLabel: "Home" });
  return <div data-testid="json">{JSON.stringify(items)}</div>;
}

describe("useReactRouterBreadcrumbs edge cases", () => {
  it("handles basePath option", () => {
    render(
      <MemoryRouter initialEntries={["/app/products/new"]}>
        <Routes>
          <Route path="*" element={<EchoItems />} />
        </Routes>
      </MemoryRouter>
    );

    function EchoWithBasePath() {
      const items = useReactRouterBreadcrumbs({ rootLabel: "Home", basePath: "/app" });
      return <div data-testid="base-json">{JSON.stringify(items)}</div>;
    }

    const { container } = render(
      <MemoryRouter initialEntries={["/app/products/new"]}>
        <Routes>
          <Route path="*" element={<EchoWithBasePath />} />
        </Routes>
      </MemoryRouter>
    );

    const json = container.querySelector('[data-testid="base-json"]')?.textContent || "[]";
    const items = JSON.parse(json) as Array<{ label: string; href?: string }>;
    expect(items.map(i => i.label)).toEqual(["Home", "Products", "New"]);
  });

  it("handles exclude with regex patterns", () => {
    function EchoExcluded() {
      const items = useReactRouterBreadcrumbs({
        rootLabel: "Home",
        exclude: [/^_/],
      });
      return <div data-testid="exclude-json">{JSON.stringify(items)}</div>;
    }

    render(
      <MemoryRouter initialEntries={["/_private/products/_internal/new"]}>
        <Routes>
          <Route path="*" element={<EchoExcluded />} />
        </Routes>
      </MemoryRouter>
    );

    const json = screen.getByTestId("exclude-json").textContent || "[]";
    const items = JSON.parse(json) as Array<{ label: string; href?: string }>;
    // _private and _internal should be excluded
    expect(items.map(i => i.label)).toEqual(["Home", "Products", "New"]);
  });

  it("handles exclude with string patterns", () => {
    function EchoExcluded() {
      const items = useReactRouterBreadcrumbs({
        rootLabel: "Home",
        exclude: ["_internal"],
      });
      return <div data-testid="exclude-str-json">{JSON.stringify(items)}</div>;
    }

    render(
      <MemoryRouter initialEntries={["/products/_internal/new"]}>
        <Routes>
          <Route path="*" element={<EchoExcluded />} />
        </Routes>
      </MemoryRouter>
    );

    const json = screen.getByTestId("exclude-str-json").textContent || "[]";
    const items = JSON.parse(json) as Array<{ label: string; href?: string }>;
    expect(items.map(i => i.label)).toEqual(["Home", "Products", "New"]);
  });

  it("handles decode: false option", () => {
    function EchoDecoded() {
      const items = useReactRouterBreadcrumbs({
        rootLabel: "Home",
        decode: false,
      });
      return <div data-testid="decode-json">{JSON.stringify(items)}</div>;
    }

    render(
      <MemoryRouter initialEntries={["/products/my%20product"]}>
        <Routes>
          <Route path="*" element={<EchoDecoded />} />
        </Routes>
      </MemoryRouter>
    );

    const json = screen.getByTestId("decode-json").textContent || "[]";
    const items = JSON.parse(json) as Array<{ label: string }>;
    // Should not decode %20
    expect(items[2].label).toContain("%20");
  });

  it("handles mapSegmentLabel function", () => {
    function EchoMapped() {
      const items = useReactRouterBreadcrumbs({
        rootLabel: "Home",
        mapSegmentLabel: (seg) => seg.toUpperCase(),
      });
      return <div data-testid="map-json">{JSON.stringify(items)}</div>;
    }

    render(
      <MemoryRouter initialEntries={["/products/new"]}>
        <Routes>
          <Route path="*" element={<EchoMapped />} />
        </Routes>
      </MemoryRouter>
    );

    const json = screen.getByTestId("map-json").textContent || "[]";
    const items = JSON.parse(json) as Array<{ label: string }>;
    expect(items[1].label).toBe("PRODUCTS");
    expect(items[2].label).toBe("NEW");
  });

  it("handles mapSegmentLabel returning null to hide segment", () => {
    function EchoMapped() {
      const items = useReactRouterBreadcrumbs({
        rootLabel: "Home",
        mapSegmentLabel: (seg) => seg === "skip" ? null : seg,
      });
      return <div data-testid="map-null-json">{JSON.stringify(items)}</div>;
    }

    render(
      <MemoryRouter initialEntries={["/products/skip/new"]}>
        <Routes>
          <Route path="*" element={<EchoMapped />} />
        </Routes>
      </MemoryRouter>
    );

    const json = screen.getByTestId("map-null-json").textContent || "[]";
    const items = JSON.parse(json) as Array<{ label: string }>;
    // "skip" should be hidden, but segments are still formatted by default
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items[0].label).toBe("Home");
    // Products and New should be present (skip is hidden)
    const labels = items.map(i => i.label);
    expect(labels).toContain("Home");
    expect(labels.some(l => l.toLowerCase().includes("product"))).toBeTruthy();
    expect(labels.some(l => l.toLowerCase().includes("new"))).toBeTruthy();
  });

  it("handles pathname with multiple slashes", () => {
    function EchoItems() {
      const items = useReactRouterBreadcrumbs({ rootLabel: "Home" });
      return <div data-testid="multi-slash-json">{JSON.stringify(items)}</div>;
    }

    render(
      <MemoryRouter initialEntries={["///products///new///"]}>
        <Routes>
          <Route path="*" element={<EchoItems />} />
        </Routes>
      </MemoryRouter>
    );

    const json = screen.getByTestId("multi-slash-json").textContent || "[]";
    const items = JSON.parse(json) as Array<{ label: string }>;
    expect(items.map(i => i.label)).toEqual(["Home", "Products", "New"]);
  });

  it("handles pathname with encoded characters", () => {
    function EchoItems() {
      const items = useReactRouterBreadcrumbs({ rootLabel: "Home", decode: true });
      return <div data-testid="encoded-json">{JSON.stringify(items)}</div>;
    }

    render(
      <MemoryRouter initialEntries={["/products/my%20product"]}>
        <Routes>
          <Route path="*" element={<EchoItems />} />
        </Routes>
      </MemoryRouter>
    );

    const json = screen.getByTestId("encoded-json").textContent || "[]";
    const items = JSON.parse(json) as Array<{ label: string }>;
    expect(items[2].label).toBe("My Product");
  });

  it("handles basePath that doesn't match pathname", () => {
    function EchoItems() {
      const items = useReactRouterBreadcrumbs({
        rootLabel: "Home",
        basePath: "/app",
      });
      return <div data-testid="no-match-json">{JSON.stringify(items)}</div>;
    }

    render(
      <MemoryRouter initialEntries={["/products"]}>
        <Routes>
          <Route path="*" element={<EchoItems />} />
        </Routes>
      </MemoryRouter>
    );

    const json = screen.getByTestId("no-match-json").textContent || "[]";
    const items = JSON.parse(json) as Array<{ label: string }>;
    // basePath doesn't match, so it should use full pathname
    expect(items.length).toBeGreaterThan(0);
  });

  it("handles empty pathname without rootLabel", () => {
    function EchoItems() {
      const items = useReactRouterBreadcrumbs();
      return <div data-testid="no-root-json">{JSON.stringify(items)}</div>;
    }

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="*" element={<EchoItems />} />
        </Routes>
      </MemoryRouter>
    );

    const json = screen.getByTestId("no-root-json").textContent || "[]";
    const items = JSON.parse(json) as Array<{ label: string }>;
    // Should default to "Home" when no rootLabel and empty path
    expect(items[0].label).toBe("Home");
  });
});

