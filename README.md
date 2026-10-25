# NextCrumbs

> MUI **^7** breadcrumbs with **Next.js Link** support, optional **URL-based generation**, and **built-in SEO microdata**. Router-agnostic. Zero runtime dependencies (peers only).

| Item            | Value                                                                        | Badge                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Version**     | **0.2.1** (do not use **0.2.0**)                                             | [![npm](https://img.shields.io/npm/v/@ameshkin/nextcrumbs.svg)](https://www.npmjs.com/package/@ameshkin/nextcrumbs)                                                                                                                                                                                                                                                                                |
| **GitHub repo** | [github.com/ameshkin/nextcrumbs](https://github.com/ameshkin/nextcrumbs)     |                                                                                                                                                                                                                                                                                                                                                                                                    |
| **CI**          | `.github/workflows/ci.yml`                                                   | [![CI - main](https://img.shields.io/github/actions/workflow/status/ameshkin/nextcrumbs/ci.yml?branch=main\&label=ci%20\(main\))](https://github.com/ameshkin/nextcrumbs/actions/workflows/ci.yml) [![CI - dev](https://img.shields.io/github/actions/workflow/status/ameshkin/nextcrumbs/ci.yml?branch=dev\&label=ci%20\(dev\))](https://github.com/ameshkin/nextcrumbs/actions/workflows/ci.yml) |
| **npm package** | [@ameshkin/nextcrumbs](https://www.npmjs.com/package/@ameshkin/nextcrumbs)   | [![npm](https://img.shields.io/npm/v/@ameshkin/nextcrumbs.svg)](https://www.npmjs.com/package/@ameshkin/nextcrumbs)                                                                                                                                                                                                                                                                                |
| **Install**     | `npm i @ameshkin/nextcrumbs`                                                 | [![install test](https://img.shields.io/github/actions/workflow/status/ameshkin/nextcrumbs/ci.yml?branch=main\&label=install%20test)](https://github.com/ameshkin/nextcrumbs/actions/workflows/ci.yml)                                                                                                                                                                                   |
| **Peer deps**   | `@mui/material@^7`, `@mui/icons-material@^7`, `@emotion/*@^11`, `react@>=18`, `react-dom@>=18`<br/>(Optional: `react-router-dom@>=6`) | ![peer deps](https://img.shields.io/badge/peer_deps-MUI%20%5E7%20%7C%20Emotion%2011%20%7C%20React%2018%2B-blue)                                                                                                                                                                                                                                                                                             |
| **Types**       | TypeScript                                                                   | ![types](https://img.shields.io/badge/types-TypeScript-blue.svg)                                                                                                                                                                                                                                                                                                                                   |
| **License**     | MIT                                                                          | [![license](https://img.shields.io/badge/license-MIT-black.svg)](LICENSE)                                                                                                                                                                                                                                                                                                                          |
| **Bundle size** | bundlephobia                                                                 | [![bundle size](https://img.shields.io/bundlephobia/minzip/%40ameshkin%2Fnextcrumbs?label=bundle%20size)](https://bundlephobia.com/package/@ameshkin/nextcrumbs)                                                                                                                                                                                                                                   |
| **Deps status** | libraries.io                                                                 | [![deps](https://img.shields.io/librariesio/release/npm/%40ameshkin%2Fnextcrumbs)](https://libraries.io/npm/%40ameshkin%2Fnextcrumbs)                                                                                                                                                                                                                                                              |

> **0.2.0 is broken.** Its `exports` pointed at `./public/*` while the tarball only ships `dist/`. Use **0.2.1+**. Details: [`docs/changes.md`](./docs/changes.md).

---

## Menu

* [Features](#features)
* [Requirements](#requirements)
* [Install](#install)
* [Quick Start (Next.js)](#quick-start-nextjs)
* [Auto from URL (Next App Router)](#auto-from-url-next-app-router)
* [React Router](#react-router)
* [Subpath exports](#subpath-exports)
* [Props](#props)
* [Icon & Separator Examples](#icon--separator-examples)
* [Accessibility & SEO](#accessibility--seo)
* [Docs](#docs)
* [Dependency Checks](#dependency-checks)
* [Troubleshooting](#troubleshooting)
* [FAQ](#faq)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* **MUI ^7** breadcrumbs under the hood (accessible, stable)
* **Next.js** ready via pluggable `LinkComponent` (for example `next/link`)
* Optional **URL → items** helper for App Router (`usePathBreadcrumbs`)
* **React Router** helper on a **subpath only** (`useReactRouterBreadcrumbs`). Optional peer
* **JSON-LD** helpers for schema.org `BreadcrumbList`
* Tree-shakable **subpath exports** (`/breadcrumbs`, `/hooks/*`, `/utils/jsonld`)
* Fully typed with TypeScript

---

## Requirements

* Node **20.19+** (or **22.12+**) for developing / CI
* React **18+** (React 19 supported in tests)
* `@mui/material` **^7** (MUI 8/9 are outside this peer range)
* `@mui/icons-material` **^7** (default home / separator icons)
* `@emotion/react` and `@emotion/styled` **^11**
* Next.js **13.4+** if using App Router examples
* (Optional) `react-router-dom` **6+** only if you import the React Router subpath

---

## Install

```bash
npm i @ameshkin/nextcrumbs

# required peers
npm i @mui/material @mui/icons-material @emotion/react @emotion/styled react react-dom

# optional: only if you use the React Router subpath hook
npm i react-router-dom
```

Next.js apps that only use `Breadcrumbs` / `usePathBreadcrumbs` do **not** need `react-router-dom`.

---

## Quick Start (Next.js)

```tsx
"use client";
import Link from "next/link";
import { NextCrumb } from "@ameshkin/nextcrumbs";
// Also available as: import { Breadcrumbs } from "@ameshkin/nextcrumbs";

export default function HeaderTrail() {
  return (
    <NextCrumb
      LinkComponent={Link}
      items={[
        { label: "Dashboard", href: "/" },
        { label: "Products", href: "/products" },
        { label: "New" }
      ]}
    />
  );
}
```

---

## Auto from URL (Next App Router)

See full guide: [`docs/next-router.md`](./docs/next-router.md)

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumbs, usePathBreadcrumbs } from "@ameshkin/nextcrumbs";

export default function AutoTrail() {
  const pathname = usePathname();
  const items = usePathBreadcrumbs(pathname, {
    baseHref: "/",
    rootLabel: "Home",
    labelMap: { new: "Create" },
    exclude: ["_private"]
  });

  return <Breadcrumbs LinkComponent={Link} items={items} />;
}
```

---

## React Router

See full guide: [`docs/react-router.md`](./docs/react-router.md)

```tsx
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Breadcrumbs } from "@ameshkin/nextcrumbs";
import { useReactRouterBreadcrumbs } from "@ameshkin/nextcrumbs/hooks/useReactRouterBreadcrumbs";

function Trail() {
  const items = useReactRouterBreadcrumbs({
    rootLabel: "Home",
    exclude: [/^_/]
  });
  return <Breadcrumbs items={items} />;
}

export default function Demo() {
  return (
    <MemoryRouter initialEntries={["/catalog/hats"]}>
      <Routes>
        <Route path="/" element={<Trail />} />
        <Route path="/catalog/hats" element={<Trail />} />
      </Routes>
    </MemoryRouter>
  );
}
```

`react-router-dom` is an **optional peer**. Import the hook only from `@ameshkin/nextcrumbs/hooks/useReactRouterBreadcrumbs` (alias: `useRRBreadcrumbs`). The main package entry does **not** import React Router.

---

## Subpath exports

| Import path | Contents |
| --- | --- |
| `@ameshkin/nextcrumbs` | `Breadcrumbs`, `NextCrumb`, `usePathBreadcrumbs`, JSON-LD helpers + types |
| `@ameshkin/nextcrumbs/breadcrumbs` | Component only |
| `@ameshkin/nextcrumbs/hooks/usePathBreadcrumbs` | Path helper |
| `@ameshkin/nextcrumbs/hooks/useReactRouterBreadcrumbs` | React Router helper (`useReactRouterBreadcrumbs`, `useRRBreadcrumbs`) |
| `@ameshkin/nextcrumbs/utils/jsonld` | `toJsonLd`, `BreadcrumbJsonLd`, `breadcrumbsToJsonLd` |
| `@ameshkin/nextcrumbs/package.json` | Package metadata |

Published files live under **`dist/`** (`main` / `types` / `exports` all point there).

---

## Props

### `<Breadcrumbs />`

| Prop            | Type                                                                                             | Default              | Description                                               |
| --------------- | ------------------------------------------------------------------------------------------------ | -------------------- | --------------------------------------------------------- |
| `items`         | `{ label: string; href?: string; icon?: React.ReactNode; title?: string; external?: boolean }[]` | **required**         | The breadcrumb trail; last item usually has no `href`.    |
| `LinkComponent` | `React.ElementType`                                                                              | `@mui/material/Link` | Custom link component (for example Next.js `Link`).       |
| `muiProps`      | `Omit<MUIBreadcrumbsProps,"children">`                                                           | -                    | Props passed through to MUI `<Breadcrumbs />` (for example `maxItems`). |
| `separatorIcon` | `React.ReactNode`                                                                                | `ChevronRightIcon`   | Icon/node placed between items.                           |
| `homeLabel`     | `string`                                                                                         | `"Home"`             | If a crumb's label matches, it can receive a Home icon.   |
| `ariaLabel`     | `string`                                                                                         | `"Breadcrumb"`       | `aria-label` on the nav.                                  |
| `dense`         | `boolean`                                                                                        | `false`              | Tighter gap between items.                                |
| `sx`            | `SxProps<Theme>`                                                                                 | -                    | Root styles.                                              |
| `itemSx` / `linkSx` / `currentSx` / `contentSx` / `iconSx` / `labelSx` | `SxProps<Theme>` | - | Style slots for crumbs. |

Use `muiProps={{ maxItems: 4 }}` (and related collapse props) for deep trails until a first-class `maxItems` API lands.

### `usePathBreadcrumbs(pathname, options?)`

| Option           | Type                              | Default        | Description                         |
| ---------------- | --------------------------------- | -------------- | ----------------------------------- |
| `baseHref`       | `string`                          | `"/"`          | Root href for the first crumb.      |
| `labelMap`       | `Record<string,string>`           | `{}`           | Override labels by URL segment.     |
| `exclude`        | `string[]`                        | `[]`           | Skip specific segments.             |
| `decode`         | `boolean`                         | `true`         | `decodeURIComponent` each segment.  |
| `rootLabel`      | `string`                          | `"Dashboard"`  | Label for the root/home breadcrumb. |
| `transformLabel` | `(segment: string) => string`     | -              | Custom label formatter.             |

### `useReactRouterBreadcrumbs(options?)`

Import from `@ameshkin/nextcrumbs/hooks/useReactRouterBreadcrumbs`.

| Option            | Type                                           | Default | Description                                           |
| ----------------- | ---------------------------------------------- | ------- | ----------------------------------------------------- |
| `rootLabel`       | `string`                                       | -       | Optional first crumb label linking to `/`.            |
| `basePath`        | `string`                                       | -       | Strip a leading base path when building crumbs.       |
| `decode`          | `boolean`                                      | `true`  | Decode each segment before labeling.                  |
| `exclude`         | `(string \| RegExp)[]`                         | `[]`    | Skip segments by string or regex.                     |
| `mapSegmentLabel` | `(segment, index, segments) => string \| null` | -       | Customize a label or return `null` to hide a segment. |

---

## Icon & Separator Examples

```tsx
import Link from "next/link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Breadcrumbs } from "@ameshkin/nextcrumbs";

<Breadcrumbs
  LinkComponent={Link}
  separatorIcon={<NavigateNextIcon fontSize="small" />}
  items={[
    { label: "Home", href: "/", icon: <HomeOutlinedIcon /> },
    { label: "Products", href: "/products" },
    { label: "Gadgets" }
  ]}
/>;
```

---

## Accessibility & SEO

* Uses MUI's accessible `<Breadcrumbs aria-label={ariaLabel}>` (default `"Breadcrumb"`).
* Current page gets `aria-current="page"`.
* Minimal DOM footprint; last item is usually text without `href`.

### JSON-LD Structured Data

```tsx
import { Breadcrumbs, BreadcrumbJsonLd, breadcrumbsToJsonLd } from "@ameshkin/nextcrumbs";

function MyPage() {
  const items = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "New Product" }
  ];

  return (
    <>
      <BreadcrumbJsonLd crumbs={breadcrumbsToJsonLd(items)} origin="https://example.com" />
      <Breadcrumbs items={items} />
    </>
  );
}
```

Or build the object yourself:

```tsx
import { toJsonLd } from "@ameshkin/nextcrumbs";

const jsonLd = toJsonLd(
  [{ name: "Home", href: "/" }, { name: "Products" }],
  { origin: "https://example.com" }
);
```

See [`docs/vanilla-json.md`](./docs/vanilla-json.md).

---

## Docs

| Guide | Path |
| --- | --- |
| Next.js App Router | [`docs/next-router.md`](./docs/next-router.md) |
| React Router | [`docs/react-router.md`](./docs/react-router.md) |
| Vanilla + JSON-LD | [`docs/vanilla-json.md`](./docs/vanilla-json.md) |
| Subpath exports (CI / GitLab) | [`docs/gitlab.md`](./docs/gitlab.md) |
| Export & API changelog | [`docs/changes.md`](./docs/changes.md) |
| Docs index | [`docs/README.md`](./docs/README.md) |

---

## Dependency Checks

```bash
npm ls @mui/material @mui/icons-material @emotion/react @emotion/styled react react-dom
# only if using the React Router subpath
npm ls react-router-dom
```

---

## Troubleshooting

### `Can't resolve 'react-router-dom'`

You are importing the React Router hook. Either install the peer or stop importing that subpath:

```bash
npm install react-router-dom
```

```ts
// React Router apps
import { useReactRouterBreadcrumbs } from "@ameshkin/nextcrumbs/hooks/useReactRouterBreadcrumbs";

// Next.js (no React Router)
import { Breadcrumbs, usePathBreadcrumbs } from "@ameshkin/nextcrumbs";
```

### Package resolves to missing files (`./public/...`)

You are on **0.2.0**. Upgrade:

```bash
npm i @ameshkin/nextcrumbs@^0.2.1
```

### `ERESOLVE` with MUI 8/9 or X Charts

This package peers **`@mui/material@^7`**. Do not run `npm audit fix --force` to pull MUI 9. Keep your app on MUI 7 while using NextCrumbs 0.2.x.

---

## FAQ

### Does it work with React Router?

Yes. Import the hook from the React Router subpath, or pass your router's `Link` through `LinkComponent`.

```ts
import { useReactRouterBreadcrumbs } from "@ameshkin/nextcrumbs/hooks/useReactRouterBreadcrumbs";
```

`react-router-dom` is optional. Install it only when you use that subpath.

### Do I need `react-router-dom` for Next.js?

No. Use the main entry and `usePathBreadcrumbs`:

```ts
import { Breadcrumbs, usePathBreadcrumbs } from "@ameshkin/nextcrumbs";
```

### How do I style the current (last) crumb?

Omit `href` on the last item so it renders as text. Then use `currentSx` or your theme.

### Can I disable icons?

Yes. Do not pass `icon` on items. Set `homeLabel` to something that will not match if you also want to skip the automatic home icon.

### Why is MUI capped at `^7`?

A wider peer like `>=7` lets npm pull MUI 8 or 9. That breaks apps still on MUI 7 (for example `@mui/x-charts@7`). Keep NextCrumbs on `^7` for 0.2.x.

### Which version should I install?

Use **0.2.1+**. Do not use **0.2.0** (broken `exports` pointing at missing `./public/*`).

```bash
npm i @ameshkin/nextcrumbs@^0.2.1
```

### Where are the deep guides?

| Topic | Doc |
| --- | --- |
| Next.js App Router | [`docs/next-router.md`](./docs/next-router.md) |
| React Router | [`docs/react-router.md`](./docs/react-router.md) |
| JSON-LD / no router | [`docs/vanilla-json.md`](./docs/vanilla-json.md) |
| Subpath exports | [`docs/gitlab.md`](./docs/gitlab.md) |
| Changelog | [`docs/changes.md`](./docs/changes.md) |

---

## Contributing

```bash
npm ci
npm run ci
```

`npm run ci` runs typecheck, unit tests, and build (same pipeline as `.github/workflows/ci.yml`).

Keep MUI peers on **`^7`**. Do not widen them to `>=7`.

---

## License

[MIT](LICENSE)
