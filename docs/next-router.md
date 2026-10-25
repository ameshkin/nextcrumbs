# NextCrumbs • Next.js App Router

Derive breadcrumb items from `next/navigation` and render with `next/link`.

You do **not** need `react-router-dom` for this path.

## Quick start (client)

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumbs, usePathBreadcrumbs } from "@ameshkin/nextcrumbs";

export default function AutoTrail() {
  const pathname = usePathname();
  const items = usePathBreadcrumbs(pathname);

  return <Breadcrumbs LinkComponent={Link} items={items} />;
}
```

## Server Components (RSC-safe)

Prefer the pure helper so you do not pull a client boundary:

```tsx
import Link from "next/link";
import { Breadcrumbs } from "@ameshkin/nextcrumbs";
import { buildPathBreadcrumbs } from "@ameshkin/nextcrumbs/utils/buildPathBreadcrumbs";

export default function ServerTrail({ pathname }: { pathname: string }) {
  const items = buildPathBreadcrumbs(pathname, { rootLabel: "Home" });
  return <Breadcrumbs LinkComponent={Link} items={items} />;
}
```

`usePathBreadcrumbs` is a thin client wrapper around the same helper.

## Customize labels, base, and excludes

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumbs, usePathBreadcrumbs } from "@ameshkin/nextcrumbs";

export default function CustomTrail() {
  const pathname = usePathname();
  const items = usePathBreadcrumbs(pathname, {
    baseHref: "/",
    rootLabel: "Home",
    labelMap: { sku: "SKU", new: "Create" },
    exclude: ["_private"],
    decode: true,
    transformLabel: (seg) => seg.replace(/-/g, " "),
  });

  return <Breadcrumbs LinkComponent={Link} items={items} />;
}
```

## Manual items

```tsx
"use client";
import Link from "next/link";
import { Breadcrumbs } from "@ameshkin/nextcrumbs";

export default function StaticTrail() {
  return (
    <Breadcrumbs
      LinkComponent={Link}
      items={[
        { label: "Home", href: "/" },
        { label: "Catalog", href: "/catalog" },
        { label: "Hats" }
      ]}
    />
  );
}
```

## Separator, icons, and SEO

```tsx
"use client";
import Link from "next/link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Breadcrumbs } from "@ameshkin/nextcrumbs";

export default function StyledTrail() {
  return (
    <Breadcrumbs
      LinkComponent={Link}
      separatorIcon={<NavigateNextIcon fontSize="small" />}
      jsonLdOrigin="https://yoursite.com"
      dense
      items={[
        { label: "Home", href: "/", icon: <HomeOutlinedIcon /> },
        { label: "Products", href: "/products" },
        { label: "Gadgets" }
      ]}
    />
  );
}
```

The automatic Home icon is applied only when `href === homeHref` (default `"/"`).

## `usePathBreadcrumbs` / `buildPathBreadcrumbs` options

| Option           | Type                          | Default       | Description                    |
| ---------------- | ----------------------------- | ------------- | ------------------------------ |
| `baseHref`       | `string`                      | `"/"`         | Root href for the first crumb  |
| `labelMap`       | `Record<string,string>`       | `{}`          | Override labels by URL segment |
| `exclude`        | `string[]`                    | `[]`          | Skip specific segments         |
| `decode`         | `boolean`                     | `true`        | `decodeURIComponent` on labels |
| `rootLabel`      | `string`                      | `"Dashboard"` | Root crumb label               |
| `transformLabel` | `(segment: string) => string` | -             | Custom formatter               |

```ts
import { usePathBreadcrumbs } from "@ameshkin/nextcrumbs/hooks/usePathBreadcrumbs";
import { buildPathBreadcrumbs } from "@ameshkin/nextcrumbs/utils/buildPathBreadcrumbs";
```

## Accessibility and SEO

* Default `aria-label` is `"Breadcrumb"` (override with `ariaLabel`).
* Current page receives `aria-current="page"`.
* For JSON-LD, pass `jsonLdOrigin` or use `BreadcrumbJsonLd` / `breadcrumbsToJsonLd` (see [vanilla-json.md](./vanilla-json.md)).

## Collapse and density

```tsx
"use client";
import Link from "next/link";
import { Breadcrumbs } from "@ameshkin/nextcrumbs";

export default function DenseTrail() {
  return (
    <Breadcrumbs
      LinkComponent={Link}
      maxItems={4}
      itemsBeforeCollapse={1}
      itemsAfterCollapse={1}
      size="small"
      truncate={160}
      items={[
        { label: "Home", href: "/" },
        { label: "Catalog", href: "/catalog" },
        { label: "Hats", href: "/catalog/hats" },
        { label: "Summer", href: "/catalog/hats/summer" },
        { label: "Straw" }
      ]}
    />
  );
}
```

Style slots: `sx`, `itemSx`, `linkSx`, `currentSx`, `contentSx`, `iconSx`, `labelSx`. Default root margin is `0`.

## Testing tip (Vitest + jsdom)

Mock `next/link` to a simple anchor:

```tsx
import * as React from "react";

export default function NextLinkMock(props: {
  href: string | { pathname?: string };
  children?: React.ReactNode;
}) {
  const { href, children, ...rest } = props;
  const resolved = typeof href === "string" ? href : href?.pathname;
  return (
    <a href={resolved} {...rest}>
      {children}
    </a>
  );
}
```

```tsx
import { render, screen } from "@testing-library/react";
import Link from "../test/NextLinkMock";
import { Breadcrumbs } from "@ameshkin/nextcrumbs";

it("renders items", () => {
  render(
    <Breadcrumbs
      LinkComponent={Link}
      items={[
        { label: "Home", href: "/" },
        { label: "Docs", href: "/docs" },
        { label: "API" }
      ]}
    />
  );
  expect(screen.getByText("Home")).toBeInTheDocument();
});
```
