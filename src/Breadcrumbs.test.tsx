import { render, screen } from "@testing-library/react";
import Breadcrumbs from "./Breadcrumbs";
import Link from "next/link";

describe("Breadcrumbs", () => {
  const items = [
    { label: "Homeq", href: "/" },
    { label: "Products", href: "/products" },
    { label: "New" },
  ];

  it("renders all breadcrumb items", () => {
    render(<Breadcrumbs items={items} LinkComponent={Link} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
  });
});
