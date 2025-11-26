# NextCrumbs

> MUI 7 Breadcrumbs with **Next.js Link** support, optional **URL-based generation**, and **built-in SEO microdata**. Router-agnostic with zero runtime deps.

| Item            | Value                                                                        | Badge                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **GitHub repo** | [github.com/ameshkin/nextcrumbs](https://github.com/ameshkin/nextcrumbs)     | —                                                                                                                                                                                                                                                                                                                                                                                                  |
| **CI**          | `.github/workflows/ci.yml`                                                   | [![CI — main](https://img.shields.io/github/actions/workflow/status/ameshkin/nextcrumbs/ci.yml?branch=main\&label=ci%20\(main\))](https://github.com/ameshkin/nextcrumbs/actions/workflows/ci.yml) [![CI — dev](https://img.shields.io/github/actions/workflow/status/ameshkin/nextcrumbs/ci.yml?branch=dev\&label=ci%20\(dev\))](https://github.com/ameshkin/nextcrumbs/actions/workflows/ci.yml) |
| **npm package** | [@ameshkin/nextcrumbs](https://www.npmjs.com/package/@ameshkin/nextcrumbs)   | [![npm](https://img.shields.io/npm/v/@ameshkin/nextcrumbs.svg)](https://www.npmjs.com/package/@ameshkin/nextcrumbs)                                                                                                                                                                                                                                                                                |
| **Install**     | `npm i @ameshkin/nextcrumbs`                                                 | [![install test](https://img.shields.io/github/actions/workflow/status/ameshkin/nextcrumbs/ci-main.yml?branch=main\&label=install%20test)](https://github.com/ameshkin/nextcrumbs/actions/workflows/ci-main.yml)                                                                                                                                                                                   |
| **Peer deps**   | `@mui/material@^7`, `@mui/icons-material@^7`, `react@>=18`, `react-dom@>=18`<br/>(Optional: `react-router-dom@>=6`) | ![peer deps](https://img.shields.io/badge/peer_deps-MUI%207%20%7C%20Icons%207%20%7C%20React%2018-blue)                                                                                                                                                                                                                                                                                             |
| **Types**       | TypeScript                                                                   | ![types](https://img.shields.io/badge/types-TypeScript-blue.svg)                                                                                                                                                                                                                                                                                                                                   |
| **License**     | MIT                                                                          | [![license](https://img.shields.io/badge/license-MIT-black.svg)](LICENSE)                                                                                                                                                                                                                                                                                                                          |
| **Bundle size** | bundlephobia                                                                 | [![bundle size](https://img.shields.io/bundlephobia/minzip/%40ameshkin%2Fnextcrumbs?label=bundle%20size)](https://bundlephobia.com/package/@ameshkin/nextcrumbs)                                                                                                                                                                                                                                   |
| **Deps status** | libraries.io                                                                 | [![deps](https://img.shields.io/librariesio/release/npm/%40ameshkin%2Fnextcrumbs)](https://libraries.io/npm/%40ameshkin%2Fnextcrumbs)                                                                                                                                                                                                                                                              |

---

## Menu

* [Features](#features)
* [Requirements](#requirements)
* [Install](#install)
* [Quick Start (Next.js)](#quick-start-nextjs)
* [Auto from URL (Next App Router)](#auto-from-url-next-app-router)
* [React Router](#react-router)
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

* ✅ **MUI** Breadcrumbs under the hood (accessible, stable)
* ✅ **Next.js** ready via pluggable `LinkComponent` (e.g., `next/link`)
* ✅ Optional **URL → items** helper for App Router (`usePathBreadcrumbs`)
* ✅ **React Router** helper hook (`useReactRouterBreadcrumbs`) - optional dependency
* ✅ Fully typed with TypeScript

---

## Requirements

* React **18+**
* @mui/material **7+**
* (Optional) @mui/icons-material **7+** for icons
* Next.js **13.4+** if using App Router examples
* (Optional) react-router-dom **6+ or 7+** for the React Router hook

---

## Install

```bash
npm i @ameshkin/nextcrumbs
# peer deps
npm i @mui/material @mui/icons-material react react-dom
# optional: only needed if using useReactRouterBreadcrumbs hook
npm i react-router-dom
```

> **Note for Next.js projects:** If you're using Next.js and don't need React Router, you can either:
> - Install `react-router-dom` as a dev dependency: `npm i -D react-router-dom`
> - Or configure webpack to ignore it (see [Troubleshooting](#troubleshooting))

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
import { Breadcrumbs, useReactRouterBreadcrumbs } from "@ameshkin/nextcrumbs";

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

> **Important:** `react-router-dom` is an **optional peer dependency**. You only need to install it if you use the `useReactRouterBreadcrumbs` hook. The package uses lazy loading, so importing other parts of the library won't require `react-router-dom` to be installed.

---

## Props

### `<Breadcrumbs />`

| Prop            | Type                                                                                             | Default              | Description                                               |
| --------------- | ------------------------------------------------------------------------------------------------ | -------------------- | --------------------------------------------------------- |
| `items`         | `{ label: string; href?: string; icon?: React.ReactNode; title?: string; external?: boolean }[]` | **required**         | The breadcrumb trail; last item usually has no `href`.    |
| `LinkComponent` | `React.ElementType`                                                                              | `@mui/material/Link` | Custom link component (e.g., Next.js `Link`).             |
| `muiProps`      | `Omit<MUIBreadcrumbsProps,"children">`                                                           | —                    | Props passed through to MUI `<Breadcrumbs />`.            |
| `separatorIcon` | `React.ReactNode`                                                                                | `ChevronRightIcon`   | Icon/node placed between items.                           |
| `homeLabel`     | `string`                                                                                         | `"Home"`             | If a crumb's label matches, it can receive a Home icon.   |

### `usePathBreadcrumbs(pathname, options?)`

| Option         | Type                    | Default      | Description                        |
| -------------- | ----------------------- | ------------ | ---------------------------------- |
| `baseHref`     | `string`                | `"/"`        | Root href for the first crumb.     |
| `labelMap`     | `Record<string,string>` | `{}`         | Override labels by URL segment.    |
| `exclude`      | `string[]`              | `[]`         | Skip specific segments.            |
| `decode`       | `boolean`               | `true`       | `decodeURIComponent` each segment. |
| `rootLabel`    | `string`                | `"Dashboard"`| Label for the root/home breadcrumb. |
| `transformLabel` | `(segment: string) => string` | — | Custom label formatter function. |

### `useReactRouterBreadcrumbs(options?)`

| Option            | Type                                           | Default | Description                                           |
| ----------------- | ---------------------------------------------- | ------- | ----------------------------------------------------- |
| `rootLabel`       | `string`                                       | —       | Optional first crumb label linking to `/`.            |
| `basePath`        | `string`                                       | —       | Strip a leading base path when building crumbs.       |
| `decode`          | `boolean`                                      | `true`  | Decode each segment before labeling.                  |
| `exclude`         | `(string \| RegExp)[]`                         | `[]`    | Skip segments by string or regex.                     |
| `mapSegmentLabel` | `(segment, index, segments) => string \| null` | —       | Customize a label or return `null` to hide a segment. |

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

* Uses MUI's accessible `<Breadcrumbs aria-label="breadcrumbs">`.
* Minimal DOM footprint; sensible defaults for current page vs. links.
* Follows ARIA best practices for breadcrumb navigation.

### JSON-LD Structured Data

For SEO, you can add JSON-LD structured data using the built-in utilities:

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

Or use the `toJsonLd` function for custom JSON-LD generation:

```tsx
import { toJsonLd } from "@ameshkin/nextcrumbs";

const jsonLd = toJsonLd(
  [{ name: "Home", href: "/" }, { name: "Products" }],
  { origin: "https://example.com" }
);
```

> See [`docs/vanilla-json.md`](./docs/vanilla-json.md) for more examples.

---

## Docs

- **Next.js App Router guide**: `docs/next-router.md`  
  Deep dive into `usePathBreadcrumbs` with Next App Router, theming, and testing tips.

- **React Router guide**: `docs/react-router.md`  
  How to use `useReactRouterBreadcrumbs`, wire up `<Link>` for SPA navigation, and test with RTL.

- **Vanilla React + JSON-LD**: `docs/vanilla-json.md`  
  Using `<Breadcrumbs />` without any router and adding SEO JSON-LD at the page level.

- **GitLab / subpath exports**: `docs/gitlab.md`  
  How to consume `@ameshkin/nextcrumbs` (and its subpath exports) in GitLab and other CI/CD setups with good tree shaking.

- **Export & API changes**: `docs/changes.md`  
  Notes on the current export layout, subpath exports, and dependency cleanup.

---

## Dependency Checks

```bash
npm ls @mui/material @mui/icons-material react react-dom
# optional router (only needed if using useReactRouterBreadcrumbs)
npm ls react-router-dom
```

## Troubleshooting

### Webpack Error: "Can't resolve 'react-router-dom'"

If you're using Next.js (or another webpack-based bundler) and see this error even though you're not using the React Router hook, you have two options:

**Option 1: Install as dev dependency (Recommended)**
```bash
npm install --save-dev react-router-dom
```

**Option 2: Configure webpack to ignore it**

For Next.js, add this to your `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = config.externals || {}
    config.externals['react-router-dom'] = 'commonjs react-router-dom'
    return config
  }
}

module.exports = nextConfig
```

> **Note:** The `useReactRouterBreadcrumbs` hook uses lazy loading, so `react-router-dom` is only accessed when the hook is actually called. However, webpack may still try to resolve it during static analysis. The solutions above prevent webpack from failing when the module isn't installed.

---

## FAQ

**Does it work with React Router?**
Yes. Use `useReactRouterBreadcrumbs()` or pass your router's `<Link>` via `LinkComponent`. Note that `react-router-dom` is optional and only needed if you use the hook.

**Do I need to install react-router-dom if I'm using Next.js?**
No, you only need it if you're using the `useReactRouterBreadcrumbs` hook. If webpack complains about it, install it as a dev dependency or configure webpack to ignore it (see [Troubleshooting](#troubleshooting)).

**How do I change the last crumb's style?**
The last item usually has no `href`. Style it as the current page using your theme or conditional props via the `currentSx` prop.

**Can I disable icons entirely?**
Yes—don't pass `icon` in your items, and set `homeLabel` to a non-matching value if you don't want the home icon.

---

## Contributing

```bash
npm ci
npm run typecheck
npm run build
npm test -- --run
```

Keep peer ranges compatible with MUI 7 and React 18+.

---

## License

[MIT](LICENSE)
