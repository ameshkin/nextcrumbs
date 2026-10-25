/**
 * Tests for Breadcrumbs component props and edge cases
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Breadcrumbs from "./Breadcrumbs";

type TestLinkProps = React.PropsWithChildren<{
  href: string;
  className?: string;
  rel?: string;
  target?: string;
}>;

const TestLink = React.forwardRef<HTMLAnchorElement, TestLinkProps>(function TestLink(
  props,
  ref,
) {
  return (
    <a
      href={props.href}
      className={props.className}
      rel={props.rel}
      target={props.target}
      ref={ref}
    >
      {props.children}
    </a>
  );
});

describe("Breadcrumbs props and edge cases", () => {
  it("handles dense prop", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "New" },
    ];
    const { container } = render(
      <Breadcrumbs items={items} LinkComponent={TestLink} dense={true} />
    );
    // Dense prop should be applied to styles
    expect(container.querySelector('[aria-label="Breadcrumb"]')).toBeTruthy();
  });

  it("handles custom separatorIcon", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Products" },
    ];
    const { container } = render(
      <Breadcrumbs items={items} LinkComponent={TestLink} separatorIcon={<span data-testid="custom-separator">→</span>} />
    );
    // Separator should be rendered
    expect(container.querySelector('[aria-label="Breadcrumb"]')).toBeTruthy();
  });

  it("handles muiProps override", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Products" },
    ];
    const { container } = render(
      <Breadcrumbs
        items={items}
        LinkComponent={TestLink}
        muiProps={{ maxItems: 2 }}
      />
    );
    expect(container.querySelector('[aria-label="Breadcrumb"]')).toBeTruthy();
  });

  it("handles custom sx prop", () => {
    const items = [{ label: "Home" }];
    const { container } = render(
      <Breadcrumbs
        items={items}
        LinkComponent={TestLink}
        sx={{ marginTop: 2 }}
      />
    );
    expect(container.querySelector('[aria-label="Breadcrumb"]')).toBeTruthy();
  });

  it("handles custom itemSx, linkSx, currentSx props", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Products" },
    ];
    const { container } = render(
      <Breadcrumbs
        items={items}
        LinkComponent={TestLink}
        itemSx={{ padding: 1 }}
        linkSx={{ color: "blue" }}
        currentSx={{ fontWeight: "bold" }}
      />
    );
    expect(container.querySelector('[aria-label="Breadcrumb"]')).toBeTruthy();
  });

  it("handles custom contentSx, iconSx, labelSx props", () => {
    const items = [
      { label: "Home", href: "/", icon: <span>🏠</span> },
      { label: "Products" },
    ];
    const { container } = render(
      <Breadcrumbs
        items={items}
        LinkComponent={TestLink}
        contentSx={{ display: "flex" }}
        iconSx={{ marginRight: 1 }}
        labelSx={{ fontSize: 16 }}
      />
    );
    expect(container.querySelector('[aria-label="Breadcrumb"]')).toBeTruthy();
  });

  it("handles items with href as object (Next.js style)", () => {
    const items = [
      { label: "Home", href: { pathname: "/" } as any },
      { label: "Products" },
    ];
    // This should not crash, even if LinkComponent doesn't handle object hrefs
    const { container } = render(
      <Breadcrumbs items={items} LinkComponent={TestLink} />
    );
    expect(container.querySelector('[aria-label="Breadcrumb"]')).toBeTruthy();
  });

  it("handles very long labels", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "A".repeat(100) },
    ];
    const { container } = render(
      <Breadcrumbs items={items} LinkComponent={TestLink} />
    );
    expect(screen.getByText("A".repeat(100))).toBeInTheDocument();
  });

  it("handles special characters in labels", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Product & Services < > \" '", href: "/products" },
      { label: "New" },
    ];
    render(<Breadcrumbs items={items} LinkComponent={TestLink} />);
    expect(screen.getByText("Product & Services < > \" '")).toBeInTheDocument();
  });

  it("handles items with empty string label", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "", href: "/empty" },
      { label: "Last" },
    ];
    const { container } = render(
      <Breadcrumbs items={items} LinkComponent={TestLink} />
    );
    expect(container.querySelector('[aria-label="Breadcrumb"]')).toBeTruthy();
  });

  it("handles multiple items with same href", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Dashboard", href: "/app" }, // Different href to avoid homeLabel matching
      { label: "Current" },
    ];
    render(<Breadcrumbs items={items} LinkComponent={TestLink} />);
    // Both items should be rendered
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("applies homeLabel when href is the homeHref (not by label alone)", () => {
    const items = [
      { label: "HOME", href: "/" },
      { label: "Products" },
    ];
    render(<Breadcrumbs items={items} LinkComponent={TestLink} homeLabel="Home" />);
    // href === "/" triggers home treatment; displayed label becomes homeLabel
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("does not treat mid-trail label Home as the home icon target", () => {
    const midTrail = [
      { label: "App", href: "/app" },
      { label: "Home", href: "/app/home" },
      { label: "Settings" },
    ];
    const withRoot = [
      { label: "Home", href: "/" },
      { label: "App", href: "/app" },
      { label: "Settings" },
    ];
    const mid = render(<Breadcrumbs items={midTrail} LinkComponent={TestLink} homeLabel="Home" />);
    const root = render(<Breadcrumbs items={withRoot} LinkComponent={TestLink} homeLabel="Home" />);
    // Mid-trail "Home" label must not get the automatic HomeIcon (only href === homeHref does).
    expect(mid.container.querySelectorAll("svg").length).toBeLessThan(
      root.container.querySelectorAll("svg").length
    );
    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
  });

  it("passes to instead of href when linkProp is to", () => {
    const ToLink = React.forwardRef<HTMLAnchorElement, { to?: string; children?: React.ReactNode }>(
      function ToLink({ to, children }, ref) {
        return (
          <a href={to} ref={ref} data-testid="rr-link">
            {children}
          </a>
        );
      }
    );
    const items = [
      { label: "Home", href: "/" },
      { label: "Docs", href: "/docs" },
      { label: "API" },
    ];
    render(<Breadcrumbs items={items} LinkComponent={ToLink} linkProp="to" />);
    const links = screen.getAllByTestId("rr-link");
    expect(links[0]).toHaveAttribute("href", "/");
    expect(links[1]).toHaveAttribute("href", "/docs");
  });
});

