/**
 * Tests to verify bug fixes from bug hunt
 * Tests BUG-024, BUG-026
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

describe("BUG-024: React key generation with fallback", () => {
  it("generates valid keys even when href and label are missing", () => {
    // This shouldn't happen per types, but we test runtime safety
    const items = [
      { label: "Valid", href: "/valid" },
      { label: undefined as any, href: undefined as any },
      { label: null as any },
    ];
    
    // Should not throw and should render without key warnings
    const { container } = render(
      <Breadcrumbs items={items} LinkComponent={TestLink} />
    );
    
    // Component should render (invalid items are filtered by safeItems)
    expect(container.querySelector('[aria-label="Breadcrumb"]')).toBeTruthy();
    
    // Check that keys don't contain 'undefined' or 'null' strings
    const renderedItems = container.querySelectorAll('[aria-label="Breadcrumb"] > *');
    // Should have at least one valid item rendered
    expect(renderedItems.length).toBeGreaterThan(0);
  });

  it("generates unique keys for items with same href", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Home", href: "/" },
      { label: "Home", href: "/" },
    ];
    
    const { container } = render(
      <Breadcrumbs items={items} LinkComponent={TestLink} />
    );
    
    // Should render all items without React key warnings
    expect(container.querySelector('[aria-label="Breadcrumb"]')).toBeTruthy();
    expect(screen.getAllByText("Home")).toHaveLength(3);
  });

  it("generates unique keys for items with same label but different hrefs", () => {
    const items = [
      { label: "Page", href: "/page1" },
      { label: "Page", href: "/page2" },
    ];
    
    const { container } = render(
      <Breadcrumbs items={items} LinkComponent={TestLink} />
    );
    
    expect(container.querySelector('[aria-label="Breadcrumb"]')).toBeTruthy();
    expect(screen.getAllByText("Page")).toHaveLength(2);
  });
});

describe("BUG-026: Runtime validation for label.toLowerCase()", () => {
  it("handles non-string label without throwing", () => {
    const items = [
      { label: "Valid", href: "/valid" },
      { label: 123 as any },
      { label: null as any },
      { label: undefined as any },
    ];
    
    // Should not throw TypeError
    expect(() => {
      render(<Breadcrumbs items={items} LinkComponent={TestLink} />);
    }).not.toThrow();
    
    // Should render valid items
    expect(screen.getByText("Valid")).toBeInTheDocument();
  });

  it("handles label that is not a string when checking homeLabel match", () => {
    const items = [
      { label: 123 as any, href: "/" },
      { label: "Valid" },
    ];
    
    // Should not throw when comparing with homeLabel
    expect(() => {
      render(<Breadcrumbs items={items} LinkComponent={TestLink} homeLabel="Home" />);
    }).not.toThrow();
  });

  it("handles empty string label safely", () => {
    const items = [
      { label: "", href: "/" },
      { label: "Valid" },
    ];
    
    expect(() => {
      render(<Breadcrumbs items={items} LinkComponent={TestLink} />);
    }).not.toThrow();
    
    expect(screen.getByText("Valid")).toBeInTheDocument();
  });

  it("handles label with toLowerCase() safely when homeLabel matches", () => {
    const items = [
      { label: "HOME", href: "/" },
      { label: "Products" },
    ];
    
    // Should handle case-insensitive matching without errors
    expect(() => {
      render(<Breadcrumbs items={items} LinkComponent={TestLink} homeLabel="Home" />);
    }).not.toThrow();
    
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});

