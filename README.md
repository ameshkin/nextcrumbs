# NextCrumbs

> MUI 7 Breadcrumbs with **Next.js Link** support, optional **URL-based generation**, and **built-in SEO microdata**. Router-agnostic with zero runtime deps.

| Item            | Value                                                                        | Badge                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GitHub repo** | [github.com/ameshkin/nextcrumbs](https://github.com/ameshkin/nextcrumbs)     | —                                                                                                                                                                                                                                                                                                                                                                                                  |
| **CI**          | `.github/workflows/ci.yml`                                                   | [![CI — main](https://img.shields.io/github/actions/workflow/status/ameshkin/nextcrumbs/ci.yml?branch=main\&label=ci%20\(main\))](https://github.com/ameshkin/nextcrumbs/actions/workflows/ci.yml) [![CI — dev](https://img.shields.io/github/actions/workflow/status/ameshkin/nextcrumbs/ci.yml?branch=dev\&label=ci%20\(dev\))](https://github.com/ameshkin/nextcrumbs/actions/workflows/ci.yml) |
| **npm package** | [@ameshkin/nextcrumbs](https://www.npmjs.com/package/@ameshkin/nextcrumbs)   | [![npm](https://img.shields.io/npm/v/@ameshkin/nextcrumbs.svg)](https://www.npmjs.com/package/@ameshkin/nextcrumbs)                                                                                                                                                                                                                                                                                |
| **Install**     | `npm i @ameshkin/nextcrumbs`                                                 | [![install test](https://img.shields.io/github/actions/workflow/status/ameshkin/nextcrumbs/install.yml?branch=main\&label=install%20test)](https://github.com/ameshkin/nextcrumbs/actions/workflows/install.yml)                                                                                                                                                                                   |
| **Peer deps**   | `@mui/material@^7`, `@mui/icons-material@^7`, `react@>=18`, `react-dom@>=18` | ![peer deps](https://img.shields.io/badge/peer_deps-MUI%207%20%7C%20Icons%207%20%7C%20React%2018-blue)                                                                                                                                                                                                                                                                                             |
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
* [Dependency Checks](#dependency-checks)
* [FAQ](#faq)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* ✅ **MUI** Breadcrumbs under the hood (accessible, stable)
* ✅ **Next.js** ready via pluggable `LinkComponent` (e.g., `next/link`)
* ✅ Optional **URL → items** helper for App Router (`usePathBreadcrumbs`)
* ✅ **React Router** helper hook (`useReactRouterBreadcrumbs`)
* ✅ Built-in **schema.org/BreadcrumbList** microdata via `withSchema`

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
# optional for React Router examples
npm i react-router-dom
```

---

## Quick Start (Next.js)

```tsx
"use client";
import Link from "next/link";
import { Breadcrumbs } from "@ameshkin/nextcrumbs";

export default function HeaderTrail() {
  return (
    <Breadcrumbs
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
import useReactRouterBreadcrumbs from "@ameshkin/nextcrumbs";

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

> `react-router-dom` is an optional peer. Install it only if you use the router hook.

---

## Props

### `<Breadcrumbs />`

| Prop            | Type                                                                                             | Default              | Description                                               |
| --------------- | ------------------------------------------------------------------------------------------------ | -------------------- | --------------------------------------------------------- |
| `items`         | `{ label: string; href?: string; icon?: React.ReactNode; title?: string; external?: boolean }[]` | **required**         | The breadcrumb trail; last item usually has no `href`.    |
| `LinkComponent` | `React.ElementType`                                                                              | `@mui/material/Link` | Custom link component (e.g., Next.js `Link`).             |
| `muiProps`      | `Omit<MUIBreadcrumbsProps,"children">`                                                           | —                    | Props passed through to MUI `<Breadcrumbs />`.            |
| `separatorIcon` | `React.ReactNode`                                                                                | `ChevronRightIcon`   | Icon/node placed between items.                           |
| `homeLabel`     | `string`                                                                                         | `"Dashboard"`        | If a crumb’s label matches, it can receive a Home icon.   |
| `withSchema`    | `boolean`                                                                                        | `true`               | Adds `schema.org/BreadcrumbList` microdata to the markup. |

### `usePathBreadcrumbs(pathname, options?)`

| Option     | Type                    | Default | Description                        |
| ---------- | ----------------------- | ------- | ---------------------------------- |
| `baseHref` | `string`                | `"/"`   | Root href for the first crumb.     |
| `labelMap` | `Record<string,string>` | `{}`    | Override labels by URL segment.    |
| `exclude`  | `string[]`              | `[]`    | Skip specific segments.            |
| `decode`   | `boolean`               | `true`  | `decodeURIComponent` each segment. |

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

* Uses MUI’s accessible `<Breadcrumbs aria-label="breadcrumbs">`.
* **SEO microdata is enabled by default** via `withSchema`. Set `withSchema={false}` to disable.
* Minimal DOM footprint; sensible defaults for current page vs. links.

> Prefer **page-level JSON-LD** for static SEO markup. See: [`docs/vanilla-json.md`](./docs/vanilla-json.md)

---

## Dependency Checks

```bash
npm ls @mui/material @mui/icons-material react react-dom
# optional router
npm ls react-router-dom
```

---

## FAQ

**Does it work with React Router?**
Yes. Use `useReactRouterBreadcrumbs()` or pass your router’s `<Link>` via `LinkComponent`.

**How do I change the last crumb’s style?**
The last item usually has no `href`. Style it as the current page using your theme or conditional props.

**Can I disable icons entirely?**
Yes—don’t pass `icon`, and set `homeLabel` to a non-matching value.

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
