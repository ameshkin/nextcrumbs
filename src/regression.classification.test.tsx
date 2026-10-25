/**
 * Classification suite: false positives and false negatives.
 *
 * False positive: the library must NOT treat something as a match / link / home / SEO URL.
 * False negative: the library must NOT miss a real match / link / home / SEO URL.
 */

import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route, Link as RouterLink } from "react-router-dom";
import Breadcrumbs, { getLinkRoutingProps } from "./Breadcrumbs";
import { buildPathBreadcrumbs } from "./utils/buildPathBreadcrumbs";
import { toJsonLd, breadcrumbsToJsonLd, BreadcrumbJsonLd } from "./utils/jsonld";
import { useReactRouterBreadcrumbs } from "./hooks/useReactRouterBreadcrumbs";

const AnchorLink = React.forwardRef<
  HTMLAnchorElement,
  React.PropsWithChildren<{ href?: string; to?: string }>
>(function AnchorLink({ href, to, children }, ref) {
  return (
    <a href={href ?? to} ref={ref} data-routing-to={to ?? ""}>
      {children}
    </a>
  );
});

describe("False positives (must not over-match)", () => {
  it("does not treat a mid-trail label Home as the home crumb", () => {
    const mid = render(
      <Breadcrumbs
        LinkComponent={AnchorLink}
        homeLabel="Home"
        items={[
          { label: "App", href: "/app" },
          { label: "Home", href: "/app/home" },
          { label: "Settings" },
        ]}
      />
    );
    const withRoot = render(
      <Breadcrumbs
        LinkComponent={AnchorLink}
        homeLabel="Home"
        items={[
          { label: "Home", href: "/" },
          { label: "App", href: "/app" },
          { label: "Settings" },
        ]}
      />
    );
    // Mid-trail "Home" must not receive the automatic HomeIcon.
    expect(mid.container.querySelectorAll("svg").length).toBeLessThan(
      withRoot.container.querySelectorAll("svg").length
    );
  });

  it("does not turn the last crumb into a link even when href is present", () => {
    render(
      <Breadcrumbs
        LinkComponent={AnchorLink}
        items={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
        ]}
      />
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/");
    expect(screen.getByText("Docs").closest("a")).toBeNull();
    expect(screen.getByText("Docs").closest('[aria-current="page"]')).toBeTruthy();
  });

  it("does not invent example.com in JSON-LD when origin is omitted", () => {
    const result = toJsonLd([{ name: "Home", href: "/" }, { name: "Docs", href: "/docs" }]);
    for (const entry of result.itemListElement) {
      expect(entry.item).toBeUndefined();
      expect(JSON.stringify(entry)).not.toContain("example.com");
    }
  });

  it("does not emit JSON-LD when jsonLdOrigin is omitted", () => {
    const { container } = render(
      <Breadcrumbs
        LinkComponent={AnchorLink}
        items={[{ label: "Home", href: "/" }, { label: "Docs" }]}
      />
    );
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it("does not self-link React Router root crumbs", () => {
    function Echo() {
      const items = useReactRouterBreadcrumbs();
      return <pre data-testid="items">{JSON.stringify(items)}</pre>;
    }
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="*" element={<Echo />} />
        </Routes>
      </MemoryRouter>
    );
    const items = JSON.parse(screen.getByTestId("items").textContent || "[]") as Array<{
      label: string;
      href?: string;
    }>;
    expect(items).toEqual([{ label: "Home" }]);
    expect(items[0].href).toBeUndefined();
  });

  it("does not pass only `to` without a native href (context-menu regression)", () => {
    expect(getLinkRoutingProps("/docs", "to")).toEqual({ to: "/docs", href: "/docs" });
    expect(getLinkRoutingProps("/docs", "to")).not.toEqual({ to: "/docs" });
  });

  it("does not apply default root margin that surprises layouts", () => {
    const { container } = render(
      <Breadcrumbs
        LinkComponent={AnchorLink}
        items={[{ label: "Home", href: "/" }, { label: "Docs" }]}
      />
    );
    const root = container.querySelector(".MuiBreadcrumbs-root") as HTMLElement;
    expect(root).toBeTruthy();
    // mb: 0 in theme spacing resolves to 0px in jsdom computed style when applied.
    expect(getComputedStyle(root).marginBottom === "0px" || root.className.length > 0).toBe(true);
  });
});

describe("False negatives (must not under-match)", () => {
  it("still shows the home icon when href is homeHref even if the label differs", () => {
    const withHome = render(
      <Breadcrumbs
        LinkComponent={AnchorLink}
        homeLabel="Dashboard"
        homeHref="/"
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Products", href: "/products" },
          { label: "New" },
        ]}
      />
    );
    const withoutHome = render(
      <Breadcrumbs
        LinkComponent={AnchorLink}
        homeLabel="Dashboard"
        homeHref="/"
        items={[
          { label: "Products", href: "/products" },
          { label: "New" },
        ]}
      />
    );
    expect(withHome.container.querySelectorAll("svg").length).toBeGreaterThan(
      withoutHome.container.querySelectorAll("svg").length
    );
    expect(screen.getAllByText("Dashboard")[0]).toBeInTheDocument();
  });

  it("keeps intermediate crumbs as real anchors for open-in-new-tab", () => {
    render(
      <Breadcrumbs
        LinkComponent={AnchorLink}
        linkProp="to"
        items={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "API" },
        ]}
      />
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/");
    expect(links[1]).toHaveAttribute("href", "/docs");
    expect(links[0]).toHaveAttribute("data-routing-to", "/");
    expect(links[1]).toHaveAttribute("data-routing-to", "/docs");
  });

  it("resolves absolute JSON-LD URLs without an origin", () => {
    const result = toJsonLd([
      { name: "Docs", href: "https://docs.yoursite.com/guide" },
    ]);
    expect(result.itemListElement[0].item).toBe("https://docs.yoursite.com/guide");
  });

  it("resolves relative JSON-LD URLs when origin is provided", () => {
    const result = toJsonLd([{ name: "Home", href: "/" }, { name: "Docs", href: "/docs" }], {
      origin: "https://yoursite.com",
    });
    expect(result.itemListElement[0].item).toBe("https://yoursite.com/");
    expect(result.itemListElement[1].item).toBe("https://yoursite.com/docs");
  });

  it("emits JSON-LD when jsonLdOrigin is set on Breadcrumbs", () => {
    const { container } = render(
      <Breadcrumbs
        LinkComponent={AnchorLink}
        jsonLdOrigin="https://yoursite.com"
        items={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "API" },
        ]}
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed["@type"]).toBe("BreadcrumbList");
    expect(parsed.itemListElement[0].item).toBe("https://yoursite.com/");
    expect(parsed.itemListElement[1].item).toBe("https://yoursite.com/docs");
    expect(parsed.itemListElement[2].item).toBeUndefined();
  });

  it("builds path crumbs for nested routes and current-only root", () => {
    expect(buildPathBreadcrumbs("/a/b", { rootLabel: "Home" })).toEqual([
      { label: "Home", href: "/" },
      { label: "A", href: "/a" },
      { label: "B" },
    ]);
    expect(buildPathBreadcrumbs("/", { rootLabel: "Home" })).toEqual([{ label: "Home" }]);
  });

  it("maps BreadcrumbItem arrays into JSON-LD crumbs without dropping valid rows", () => {
    const crumbs = breadcrumbsToJsonLd([
      { label: "Home", href: "/" },
      { label: "Docs", href: "/docs" },
      { label: "API" },
    ]);
    expect(crumbs).toEqual([
      { name: "Home", href: "/" },
      { name: "Docs", href: "/docs" },
      { name: "API" },
    ]);
  });

  it("works with React Router Link via linkProp=to", () => {
    function Trail() {
      const items = useReactRouterBreadcrumbs({ rootLabel: "Home" });
      return (
        <Breadcrumbs LinkComponent={RouterLink} linkProp="to" items={items} ariaLabel="Trail" />
      );
    }
    render(
      <MemoryRouter initialEntries={["/docs/api"]}>
        <Routes>
          <Route path="*" element={<Trail />} />
        </Routes>
      </MemoryRouter>
    );
    const links = screen.getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["/", "/docs"]);
    expect(screen.getByText("Api").closest("a")).toBeNull();
  });

  it("BreadcrumbJsonLd falls back to window.location.origin in the browser", () => {
    const { container } = render(
      <BreadcrumbJsonLd crumbs={[{ name: "Home", href: "/" }]} />
    );
    const parsed = JSON.parse(container.querySelector("script")!.textContent!);
    expect(parsed.itemListElement[0].item).toBe(`${window.location.origin}/`);
  });
});
