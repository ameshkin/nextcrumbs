import { describe, it, expect } from "vitest";
import { getLinkRoutingProps } from "./Breadcrumbs";

describe("getLinkRoutingProps", () => {
  it("returns href only for Next.js / MUI (default)", () => {
    expect(getLinkRoutingProps("/docs")).toEqual({ href: "/docs" });
    expect(getLinkRoutingProps("/docs", "href")).toEqual({ href: "/docs" });
  });

  it("returns to plus native href for React Router (context menu / open in new tab)", () => {
    expect(getLinkRoutingProps("/docs", "to")).toEqual({ to: "/docs", href: "/docs" });
    expect(getLinkRoutingProps("/", "to")).toEqual({ to: "/", href: "/" });
  });
});
