# NextCrumbs • Next.js App Router

Use `usePathBreadcrumbs` to derive breadcrumb items from `next/navigation` and render with your `next/link`.

## Quick start (auto from URL)

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
    labelMap: { sku: "SKU", new: "Create" },
    exclude: ["_private"],
    decode: true
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

## Custom separator and icons

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
      items={[
        { label: "Home", href: "/", icon: <HomeOutlinedIcon /> },
        { label: "Products", href: "/products" },
        { label: "Gadgets" }
      ]}
    />
  );
}
```

## `usePathBreadcrumbs(pathname, options?)`

```ts
type PathOptions = {
  baseHref?: string
  labelMap?: Record<string, string>
  exclude?: string[]
  decode?: boolean
}
```

| Option     | Type                    | Default | Description                          |
| ---------- | ----------------------- | ------- | ------------------------------------ |
| `baseHref` | `string`                | `"/"`   | Root href for the first crumb        |
| `labelMap` | `Record<string,string>` | `{}`    | Override labels by URL segment       |
| `exclude`  | `string[]`              | `[]`    | Skip specific segments               |
| `decode`   | `boolean`               | `true`  | Apply `decodeURIComponent` to labels |

## Accessibility & SEO

* `<Breadcrumbs aria-label="breadcrumbs">` for screen readers
* `withSchema` is enabled by default to add `schema.org/BreadcrumbList`
* For JSON-LD, add page-level `<script type="application/ld+json">` in your layout if you prefer static SEO markup

## Theming

Use your app’s `ThemeProvider`. Pass MUI props via `muiProps` when needed:

```tsx
"use client";
import Link from "next/link";
import { Breadcrumbs } from "@ameshkin/nextcrumbs";

export default function DenseTrail() {
  return (
    <Breadcrumbs
      LinkComponent={Link}
      muiProps={{ maxItems: 4, itemsBeforeCollapse: 1, itemsAfterCollapse: 1 }}
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

## Testing tip (Vitest + jsdom)

Mock `next/link` to a simple anchor when rendering in jsdom:

```tsx
// test/NextLinkMock.tsx
import * as React from "react";

export default function NextLinkMock(props: any) {
  const { href, children, ...rest } = props;
  return <a href={typeof href === "string" ? href : href?.pathname} {...rest}>{children}</a>;
}
```

```tsx
// Breadcrumbs.test.tsx
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
