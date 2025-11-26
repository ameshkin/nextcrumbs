# NextCrumbs • React Router
Use `useReactRouterBreadcrumbs` to derive breadcrumb items from the current location. Install the optional peer if you haven’t:

## Quick demo

```tsx
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { Breadcrumbs, useReactRouterBreadcrumbs } from "@ameshkin/nextcrumbs"

function Trail() {
  const items = useReactRouterBreadcrumbs({ rootLabel: "Home" })
  return <Breadcrumbs items={items} />
}

export default function Demo() {
  return (
    <MemoryRouter initialEntries={["/catalog/hats"]}>
      <Routes>
        <Route path="/" element={<Trail />} />
        <Route path="/catalog/hats" element={<Trail />} />
      </Routes>
    </MemoryRouter>
  )
}
```

## With SPA navigation (Router `<Link>`)

Pass React Router’s `<Link>` as `LinkComponent` so breadcrumb links use client-side navigation:

```tsx
import { Link as RouterLink, BrowserRouter, Routes, Route } from "react-router-dom"
import { Breadcrumbs, useReactRouterBreadcrumbs } from "@ameshkin/nextcrumbs"

function Trail() {
  const items = useReactRouterBreadcrumbs({ rootLabel: "Home" })
  return <Breadcrumbs LinkComponent={RouterLink} items={items} />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Trail />} />
        <Route path="/catalog/hats" element={<Trail />} />
      </Routes>
    </BrowserRouter>
  )
}
```

## Options

```ts
type ReactRouterBreadcrumbsOptions = {
  rootLabel?: string
  basePath?: string
  decode?: boolean
  exclude?: (string | RegExp)[]
  mapSegmentLabel?: (segment: string, index: number, segments: string[]) => string | null
}
```

| Option            | Type                                           | Default | Description                                        |
| ----------------- | ---------------------------------------------- | ------- | -------------------------------------------------- |
| `rootLabel`       | `string`                                       | —       | If set, prepends a crumb linking to `/`.           |
| `basePath`        | `string`                                       | —       | Strips a leading base path before building crumbs. |
| `decode`          | `boolean`                                      | `true`  | Applies `decodeURIComponent` to each segment.      |
| `exclude`         | `(string \| RegExp)[]`                         | `[]`    | Skips segments that match a string or regex.       |
| `mapSegmentLabel` | `(segment, index, segments) => string \| null` | —       | Return a custom label or `null` to hide a segment. |

## Examples

### Exclude private routes and prettify labels

```tsx
import { Link as RouterLink } from "react-router-dom"
import { Breadcrumbs, useReactRouterBreadcrumbs } from "@ameshkin/nextcrumbs"

export default function Trail() {
  const items = useReactRouterBreadcrumbs({
    rootLabel: "Home",
    exclude: [/^_/],
    mapSegmentLabel: (seg) => seg.replace(/[-_]+/g, " ").replace(/\b\w/g, c => c.toUpperCase())
  })
  return <Breadcrumbs LinkComponent={RouterLink} items={items} />
}
```

### Mount under a base path

```tsx
const items = useReactRouterBreadcrumbs({
  rootLabel: "Home",
  basePath: "/app"
})
```

## Testing tip

When testing with Vitest/RTL, wrap your component with a memory or browser router:

```tsx
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { Breadcrumbs, useReactRouterBreadcrumbs } from "@ameshkin/nextcrumbs"

function Trail() {
  const items = useReactRouterBreadcrumbs({ rootLabel: "Home" })
  return <Breadcrumbs items={items} />
}

it("renders trail", () => {
  render(
    <MemoryRouter initialEntries={["/a/b"]}>
      <Routes>
        <Route path="/*" element={<Trail />} />
      </Routes>
    </MemoryRouter>
  )
  expect(screen.getByText("Home")).toBeInTheDocument()
})
```

## Notes

* `react-router-dom` is an optional peer; install it only if you use the router hook.
* For SPA navigation, pass `LinkComponent={RouterLink}` to `<Breadcrumbs>`. Without it, links render as plain anchors.
