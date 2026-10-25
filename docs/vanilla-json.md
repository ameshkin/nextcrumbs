# NextCrumbs • Vite, vanilla React, JSON-LD

Use `<Breadcrumbs>` in **Vite**, CRA, or any React app **without Next.js**. Add page-level JSON-LD when you need SEO.

Requires MUI and Emotion peers. Does **not** require Next.js. React Router is optional (see [react-router.md](./react-router.md)).

## Vite (or any bundler)

```bash
npm i @ameshkin/nextcrumbs @mui/material @mui/icons-material @emotion/react @emotion/styled
```

No Vite plugin. Import the ESM package and render under your existing `ThemeProvider`:

```tsx
import { Breadcrumbs } from "@ameshkin/nextcrumbs";

export function HeaderTrail() {
  return (
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Docs", href: "/docs" },
        { label: "API" }
      ]}
    />
  );
}
```

### Vite + React Router

```tsx
import { Link as RouterLink } from "react-router-dom";
import { Breadcrumbs } from "@ameshkin/nextcrumbs";
import { useReactRouterBreadcrumbs } from "@ameshkin/nextcrumbs/hooks/useReactRouterBreadcrumbs";

export function Trail() {
  const items = useReactRouterBreadcrumbs({ rootLabel: "Home" });
  return <Breadcrumbs LinkComponent={RouterLink} linkProp="to" items={items} />;
}
```

You can also feed `usePathBreadcrumbs(useLocation().pathname)` if you prefer the path helper over the React Router subpath hook.

## Manual items

```tsx
import { Breadcrumbs } from "@ameshkin/nextcrumbs";

export default function ManualTrail() {
  return (
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Docs", href: "/docs" },
        { label: "API" }
      ]}
    />
  );
}
```

* Omit `LinkComponent` to use the default MUI link for items with `href`.
* Prefer omitting `href` on the last item (current page). The last crumb is never rendered as a link even if `href` is present.
* `"use client"` is a Next.js App Router directive. You do not need it in Vite.

## JSON-LD

Always pass a real site origin for relative paths. There is no `example.com` default.

### One-shot on `<Breadcrumbs>`

```tsx
import { Breadcrumbs } from "@ameshkin/nextcrumbs";

<Breadcrumbs
  items={items}
  jsonLdOrigin="https://yoursite.com"
/>
```

### Explicit helpers

```tsx
import {
  Breadcrumbs,
  BreadcrumbJsonLd,
  breadcrumbsToJsonLd,
} from "@ameshkin/nextcrumbs";

export default function DocsPage() {
  const items = [
    { label: "Home", href: "/" },
    { label: "Docs", href: "/docs" },
    { label: "API" },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        crumbs={breadcrumbsToJsonLd(items)}
        origin="https://yoursite.com"
      />
      <Breadcrumbs items={items} />
    </>
  );
}
```

### `toJsonLd`

```tsx
import { toJsonLd } from "@ameshkin/nextcrumbs";

const jsonLd = toJsonLd(
  [
    { name: "Home", href: "/" },
    { name: "Docs", href: "/docs" },
    { name: "API" },
  ],
  { origin: "https://yoursite.com" }
);
```

| Input | Result |
| --- | --- |
| Relative `href` without `origin` | `item` omitted (safe) |
| Absolute `http(s)` `href` | Resolved without `origin` |
| Relative `href` with `origin` | Resolved against that origin |
| `BreadcrumbJsonLd` in the browser without `origin` | Uses `window.location.origin` |

Subpath import:

```ts
import {
  toJsonLd,
  BreadcrumbJsonLd,
  breadcrumbsToJsonLd,
} from "@ameshkin/nextcrumbs/utils/jsonld";
```

## Layout controls

```tsx
<Breadcrumbs
  dense
  size="small"
  truncate={140}
  maxItems={4}
  itemsBeforeCollapse={1}
  itemsAfterCollapse={1}
  items={[
    { label: "Home", href: "/" },
    { label: "Docs", href: "/docs" },
    { label: "Guides", href: "/docs/guides" },
    { label: "API" }
  ]}
/>
```

Default root margin is `0`. Set spacing with `sx` when needed.

## Testing (Vitest + RTL)

```tsx
import { render, screen } from "@testing-library/react";
import { Breadcrumbs } from "@ameshkin/nextcrumbs";

it("renders a non-link last crumb", () => {
  render(
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Docs", href: "/docs" },
        { label: "API" }
      ]}
    />
  );
  expect(screen.getByText("API").closest("a")).toBeNull();
});
```

## Tips

* Keep labels human-readable. Put slugs in `href`.
* External crumbs: set `external: true` for `target="_blank"` and `rel="noopener noreferrer"`.
* Home icon applies only when `href === homeHref` (default `"/"`), not when the label happens to say "Home".
