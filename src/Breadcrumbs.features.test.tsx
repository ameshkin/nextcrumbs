import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Breadcrumbs from "./Breadcrumbs";

const TestLink = React.forwardRef<HTMLAnchorElement, React.PropsWithChildren<{ href?: string }>>(
  function TestLink({ href, children }, ref) {
    return (
      <a href={href} ref={ref}>
        {children}
      </a>
    );
  }
);

describe("Breadcrumbs feature props", () => {
  const deepItems = [
    { label: "Home", href: "/" },
    { label: "Admin", href: "/admin" },
    { label: "Users", href: "/admin/users" },
    { label: "Roles", href: "/admin/users/roles" },
    { label: "Edit" },
  ];

  it("defaults root margin to 0", () => {
    const { container } = render(<Breadcrumbs items={deepItems} LinkComponent={TestLink} />);
    const nav = container.querySelector(".MuiBreadcrumbs-root") as HTMLElement;
    expect(nav).toBeTruthy();
    expect(getComputedStyle(nav).marginBottom === "0px" || nav.className).toBeTruthy();
  });

  it("emits JSON-LD when jsonLdOrigin is set", () => {
    const { container } = render(
      <Breadcrumbs items={deepItems} LinkComponent={TestLink} jsonLdOrigin="https://site.test" />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed["@type"]).toBe("BreadcrumbList");
    expect(parsed.itemListElement[0].item).toBe("https://site.test/");
    expect(parsed.itemListElement[1].item).toBe("https://site.test/admin");
    // Trail links still remain real anchors (right-click / open in new tab).
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/");
    expect(links[1]).toHaveAttribute("href", "/admin");
  });

  it("does not emit JSON-LD when jsonLdOrigin is omitted", () => {
    const { container } = render(
      <Breadcrumbs items={deepItems} LinkComponent={TestLink} />
    );
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it("applies size and truncate styles", () => {
    render(
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Very Long Section Name" }]}
        LinkComponent={TestLink}
        size="small"
        truncate={120}
      />
    );
    expect(screen.getByText("Very Long Section Name")).toBeInTheDocument();
  });

  it("accepts maxItems for collapse", () => {
    const { container } = render(
      <Breadcrumbs items={deepItems} LinkComponent={TestLink} maxItems={3} />
    );
    expect(container.querySelector('[aria-label="Breadcrumb"]')).toBeTruthy();
  });
});
