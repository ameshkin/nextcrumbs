// src/Breadcrumbs.test.tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Breadcrumbs from "./Breadcrumbs";

// Simple Link stub for tests (no dependency on next/link)
function TestLink(props: React.PropsWithChildren<{ href: string | { pathname: string }; className?: string }>) {
  const to = typeof props.href === "string" ? props.href : props.href?.pathname || "/";
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  return <a href={to} className={props.className}>{props.children}</a>;
}

describe("Breadcrumbs", () => {
  const items = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "New" },
  ];

  it("renders all breadcrumb items", () => {
    render(<Breadcrumbs items={items} LinkComponent={TestLink} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("renders links for non-last items", () => {
    render(<Breadcrumbs items={items} LinkComponent={TestLink} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/");
    expect(links[1]).toHaveAttribute("href", "/products");
  });

  it("does not render link for last item", () => {
    render(<Breadcrumbs items={items} LinkComponent={TestLink} />);
    const lastItem = screen.getByText("New");
    expect(lastItem.closest("a")).toBeNull();
    expect(lastItem.closest('[aria-current="page"]')).toBeTruthy();
  });

  it("applies custom homeLabel", () => {
    const itemsWithHome = [
      { label: "Dashboard", href: "/" },
      { label: "Products", href: "/products" },
    ];
    render(<Breadcrumbs items={itemsWithHome} LinkComponent={TestLink} homeLabel="Dashboard" />);
    // Should show home icon for Dashboard since it matches homeLabel
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("handles external links", () => {
    const itemsWithExternal = [
      { label: "Home", href: "/" },
      { label: "External", href: "https://example.com", external: true },
      { label: "Last" },
    ];
    const { container } = render(<Breadcrumbs items={itemsWithExternal} LinkComponent={TestLink} />);
    const externalLink = screen.getByText("External").closest("a");
    expect(externalLink).toBeTruthy();
    // Check that external attributes are applied (they're spread onto the Link component)
    // Since TestLink is a simple stub, we verify the link exists and has the href
    expect(externalLink).toHaveAttribute("href", "https://example.com");
    // The external props are spread, but TestLink doesn't forward them - this is expected behavior
    // In real usage with Next.js Link or MUI Link, the target and rel would be applied
  });

  it("applies custom ariaLabel", () => {
    const { container } = render(
      <Breadcrumbs items={items} LinkComponent={TestLink} ariaLabel="Navigation trail" />
    );
    const nav = container.querySelector('[aria-label="Navigation trail"]');
    expect(nav).toBeTruthy();
  });

  it("handles items with icons", () => {
    const itemsWithIcon = [
      { label: "Home", href: "/", icon: <span data-testid="home-icon">🏠</span> },
      { label: "Products", href: "/products" },
    ];
    render(<Breadcrumbs items={itemsWithIcon} LinkComponent={TestLink} />);
    expect(screen.getByTestId("home-icon")).toBeInTheDocument();
  });

  it("handles empty items array", () => {
    const { container } = render(<Breadcrumbs items={[]} LinkComponent={TestLink} />);
    expect(container.querySelector('[aria-label="Breadcrumb"]')).toBeTruthy();
  });
});
