# NextCrumbs • Vanilla React / JSON-LD

Use `<Breadcrumbs>` without any router, or add page-level JSON-LD for static SEO.

## Manual items (no router)

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
````

* Omit `LinkComponent` to render standard anchors for items with `href`.
* The last item should generally have no `href` (current page).

## JSON-LD at the page level

Add static structured data with a `<script type="application/ld+json">` tag. This is independent of the visual breadcrumbs component.

```tsx
import * as React from "react";

type Crumb = { name: string; href?: string };

function toJsonLd(crumbs: Crumb[], origin = "https://example.com") {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: new URL(c.href, origin).toString() } : {})
    }))
  };
}

export function BreadcrumbJsonLd({ crumbs, origin }: { crumbs: Crumb[]; origin?: string }) {
  const json = React.useMemo(() => toJsonLd(crumbs, origin), [crumbs, origin]);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}
```

Usage:

```tsx
import { Breadcrumbs } from "@ameshkin/nextcrumbs";
import { BreadcrumbJsonLd } from "./BreadcrumbJsonLd";

export default function DocsPage() {
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Docs", href: "/docs" },
    { name: "API" }
  ];

  return (
    <>
      <BreadcrumbJsonLd crumbs={crumbs} origin="https://example.com" />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "API" }
        ]}
      />
    </>
  );
}
```

## Microdata via component

`<Breadcrumbs>` ships with `withSchema` enabled by default. To disable microdata (for example, if you only want JSON-LD), set:

```tsx
<Breadcrumbs withSchema={false} items={[ /* ... */ ]} />
```

## Styling and density

Pass any MUI Breadcrumbs props through `muiProps`:

```tsx
<Breadcrumbs
  muiProps={{ maxItems: 4, itemsBeforeCollapse: 1, itemsAfterCollapse: 1 }}
  items={[
    { label: "Home", href: "/" },
    { label: "Docs", href: "/docs" },
    { label: "Guides", href: "/docs/guides" },
    { label: "API" }
  ]}
/>
```

## Testing (Vitest + RTL)

Render the component directly—no router needed:

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

* Prefer **page-level JSON-LD** for static SEO and keep `withSchema` for helpful in-markup hints (or disable it if you want JSON-LD only).
* Keep labels human-readable; reserve slugs for `href`.
