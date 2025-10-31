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
    { label: "Home", href: "/" },       // fixed: was "Homeq"
    { label: "Products", href: "/products" },
    { label: "New" },
  ];

  it("renders all breadcrumb items", () => {
    render(<Breadcrumbs items={items} LinkComponent={TestLink} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
  });
});
