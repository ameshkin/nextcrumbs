# NextCrumbs • Vanilla React / JSON-LD

Use `<Breadcrumbs>` without any router, or add page-level JSON-LD for static SEO.

Requires MUI + Emotion peers. Does **not** require Next.js or React Router.

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
```

* Omit `LinkComponent` to use the default MUI link for items with `href`.
* The last item should generally have no `href` (current page).

## JSON-LD with built-in helpers

Prefer the package helpers instead of hand-rolling schema.org markup:

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
        origin="https://example.com"
      />
      <Breadcrumbs items={items} />
    </>
  );
}
```

### `toJsonLd`

Build the object yourself (for custom script injection or server rendering):

```tsx
import { toJsonLd } from "@ameshkin/nextcrumbs";

const jsonLd = toJsonLd(
  [
    { name: "Home", href: "/" },
    { name: "Docs", href: "/docs" },
    { name: "API" },
  ],
  { origin: "https://example.com" }
);

// <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
```

### `breadcrumbsToJsonLd`

Maps `{ label, href? }` visual items into `{ name, href? }` JSON-LD crumbs:

```ts
import { breadcrumbsToJsonLd, toJsonLd } from "@ameshkin/nextcrumbs";

const crumbs = breadcrumbsToJsonLd([
  { label: "Home", href: "/" },
  { label: "Docs" },
]);
const jsonLd = toJsonLd(crumbs, { origin: "https://example.com" });
```

Subpath import:

```ts
import {
  toJsonLd,
  BreadcrumbJsonLd,
  breadcrumbsToJsonLd,
} from "@ameshkin/nextcrumbs/utils/jsonld";
```

## Styling and density

Pass MUI Breadcrumbs props through `muiProps`:

```tsx
<Breadcrumbs
  dense
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

Render the component directly. No router needed:

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

* Prefer **page-level JSON-LD** next to the visual trail for static SEO.
* Keep labels human-readable; reserve slugs for `href`.
* External crumbs: set `external: true` on an item for `target="_blank"` + `rel="noopener noreferrer"`.
