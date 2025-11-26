// src/hooks/useReactRouterBreadcrumbs.test.tsx
import * as React from "react"
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route, Link as RouterLink, type LinkProps } from "react-router-dom"
import Breadcrumbs from "../Breadcrumbs"
import useReactRouterBreadcrumbs from "./useReactRouterBreadcrumbs"

type AnchorLike = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string }

const RRLink = React.forwardRef<HTMLAnchorElement, AnchorLike>(({ href, ...rest }, ref) => {
  return <RouterLink ref={ref} to={href} {...(rest as Omit<LinkProps, "to">)} />
})

function Trail() {
  const items = useReactRouterBreadcrumbs({ rootLabel: "Home" })
  return <Breadcrumbs LinkComponent={RRLink} items={items} ariaLabel="Breadcrumb" />
}

function EchoItems() {
  const items = useReactRouterBreadcrumbs({ rootLabel: "Home" })
  return <div data-testid="json">{JSON.stringify(items)}</div>
}

describe("useReactRouterBreadcrumbs + Breadcrumbs", () => {
  it("renders links for intermediate segments and plain text for the last segment", () => {
    render(
      <MemoryRouter initialEntries={["/catalog/hats"]}>
        <Routes>
          <Route path="*" element={<Trail />} />
        </Routes>
      </MemoryRouter>
    )
    const links = screen.getAllByRole("link").map(a => (a as HTMLAnchorElement).getAttribute("href"))
    expect(links).toEqual(["/", "/catalog"])
    expect(screen.getByText("Hats")).toBeInTheDocument()
    expect(screen.getByText("Hats").closest("a")).toBeNull()
  })

  it("at root renders a single current item (no links)", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="*" element={<Trail />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.queryAllByRole("link")).toHaveLength(0)
    const current = screen.getByText("Home")
    expect(current.getAttribute("aria-current") === "page" || current.closest('[aria-current="page"]')).toBeTruthy()
  })
})

describe("useReactRouterBreadcrumbs (hook-only)", () => {
  it("derives items from the current pathname", () => {
    render(
      <MemoryRouter initialEntries={["/a/b"]}>
        <Routes>
          <Route path="*" element={<EchoItems />} />
        </Routes>
      </MemoryRouter>
    )
    const json = screen.getByTestId("json").textContent || "[]"
    const items = JSON.parse(json) as Array<{ label: string; href?: string }>
    expect(items.map(i => i.label)).toEqual(["Home", "A", "B"])
    expect(items.map(i => i.href || null)).toEqual(["/", "/a", null])
  })

  it("works with useRRBreadcrumbs alias", async () => {
    const { useRRBreadcrumbs } = await import("../index.js")
    function EchoRRItems() {
      const items = useRRBreadcrumbs({ rootLabel: "Home" })
      return <div data-testid="rr-json">{JSON.stringify(items)}</div>
    }

    render(
      <MemoryRouter initialEntries={["/test/path"]}>
        <Routes>
          <Route path="*" element={<EchoRRItems />} />
        </Routes>
      </MemoryRouter>
    )

    const json = screen.getByTestId("rr-json").textContent || "[]"
    const items = JSON.parse(json) as Array<{ label: string; href?: string }>
    expect(items.map(i => i.label)).toEqual(["Home", "Test", "Path"])
  })

  it("handles custom rootLabel option", () => {
    function EchoCustomRoot() {
      const items = useReactRouterBreadcrumbs({ rootLabel: "Dashboard" })
      return <div data-testid="custom-root">{JSON.stringify(items)}</div>
    }

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="*" element={<EchoCustomRoot />} />
        </Routes>
      </MemoryRouter>
    )

    const json = screen.getByTestId("custom-root").textContent || "[]"
    const items = JSON.parse(json) as Array<{ label: string }>
    expect(items[0].label).toBe("Dashboard")
  })
})
