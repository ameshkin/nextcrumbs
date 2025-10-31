# Next Crumb

> MUI 7 Breadcrumbs with **Next.js Link** support, optional **URL-based generation**, and **SEO microdata**. Router-agnostic, zero runtime deps.

| Item                  | Value |
|-----------------------|-------|
| **GitHub repo**       | [github.com/ameshkin/nextcrumbs](https://github.com/ameshkin/nextcrumbs) |
| **npm package name**  | `@ameshkin/nextcrumbs` |
| **Install**           | `npm i @ameshkin/nextcrumbs` |
| **Peer deps**         | `@mui/material@^7`, `@mui/icons-material@^7`, `react@>=18`, `react-dom@>=18` |
| **CI badge**          | [![CI](https://img.shields.io/github/actions/workflow/status/ameshkin/nextcrumbs/ci.yml?branch=main&label=CI)](https://github.com/ameshkin/nextcrumbs/actions) |
| **npm badge**         | [![npm](https://img.shields.io/npm/v/@ameshkin/nextcrumbs.svg)](https://www.npmjs.com/package/@ameshkin/nextcrumbs) |
| **Types badge**       | ![types](https://img.shields.io/badge/types-TypeScript-blue.svg) |
| **License badge**     | [![license](https://img.shields.io/badge/license-MIT-black.svg)](LICENSE) |
| **Bundle size badge** | [![bundle size](https://img.shields.io/bundlephobia/minzip/%40ameshkin%2Fnextcrumbs?label=bundle%20size)](https://bundlephobia.com/package/@ameshkin/nextcrumbs) |
| **Deps badge**        | [![deps](https://img.shields.io/librariesio/release/npm/%40ameshkin%2Fnextcrumbs)](https://libraries.io/npm/%40ameshkin%2Fnextcrumbs) |

---

## Menu

- [Features](#features)
- [Requirements](#requirements)
- [Install](#install)
- [Quick Start (Next.js)](#quick-start-nextjs)
- [Auto from URL (Next App Router)](#auto-from-url-next-app-router)
- [Props](#props)
- [Icon & Separator Examples](#icon--separator-examples)
- [Accessibility & SEO](#accessibility--seo)
- [Dependency Checks](#dependency-checks)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- ✅ **MUI** Breadcrumbs under the hood (accessible, stable)
- ✅ **Next.js** ready via pluggable `LinkComponent` (e.g., `next/link`)
- ✅ Optional **URL → items** helper (works with App Router `usePathname()`)
- ✅ **SEO microdata** (`schema.org/BreadcrumbList`)
- ✅ Customize **separator** and per-item **icons** (e.g., Home)

---

## Requirements

- React **18+**
- @mui/material **7+**
- (Optional) @mui/icons-material **7+** for built-in icons
- Next.js **13.4+** (if using Next + App Router)

---

## Install

```bash
npm i @ameshkin/nextcrumbs
# peer deps
npm i @mui/material @mui/icons-material react react-dom
````

> Using pnpm or yarn? Replace `npm i` with your package manager’s command.

---

## Quick Start (Next.js)

Manual items with `next/link`:

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

Generate items from the current pathname:

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

## Props

### `<Breadcrumbs />`

| Prop            | Type                                                   | Default              | Description                                                      |
| --------------- | ------------------------------------------------------ | -------------------- | ---------------------------------------------------------------- |
| `items`         | `{ label: string; href?: string; icon?: ReactNode }[]` | **required**         | The breadcrumb trail; last item usually has no `href`.           |
| `LinkComponent` | `ElementType`                                          | `@mui/material/Link` | Custom link component (e.g., Next.js `Link`).                    |
| `muiProps`      | `Omit<MUIBreadcrumbsProps, "children">`                | —                    | Pass-through props to MUI `<Breadcrumbs />`.                     |
| `separatorIcon` | `ReactNode`                                            | `ChevronRightIcon`   | Icon/node placed between items.                                  |
| `homeLabel`     | `string`                                               | `"Dashboard"`        | If an item’s label matches this, it gets a Home icon by default. |
| `withSchema`    | `boolean`                                              | `true`               | Adds `schema.org/BreadcrumbList` microdata.                      |

### `usePathBreadcrumbs(pathname, options?)`

| Option     | Type                    | Default | Description                        |
| ---------- | ----------------------- | ------- | ---------------------------------- |
| `baseHref` | `string`                | `"/"`   | Root href for the first crumb.     |
| `labelMap` | `Record<string,string>` | `{}`    | Override labels by segment.        |
| `exclude`  | `string[]`              | `[]`    | Skip specific path segments.       |
| `decode`   | `boolean`               | `true`  | `decodeURIComponent` each segment. |

---

## Icon & Separator Examples

Change the separator and home icon behavior:

```tsx
import Link from "next/link";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Breadcrumbs } from "@ameshkin/nextcrumbs";

<Breadcrumbs
  LinkComponent={Link}
  separatorIcon={<NavigateNextIcon fontSize="small" />}
  items={[
    { label: "Dashboard", href: "/", icon: <HomeOutlinedIcon /> },
    { label: "Products", href: "/products" },
    { label: "Gadgets" }
  ]}
/>;
```

* Any MUI icon works for `separatorIcon` or per-item `icon`.
* If you set `homeLabel="Home"`, the component shows a Home icon automatically when a crumb’s label is `"Home"`.

---

## Accessibility & SEO

* Uses MUI’s accessible `<Breadcrumbs aria-label="breadcrumbs">`.
* Adds **schema.org** `BreadcrumbList` microdata by default (set `withSchema={false}` to disable).
* Minimal DOM/no extra wrappers (uses `display: contents` for the list wrapper).

---

## Dependency Checks

Make sure peer deps resolve cleanly:

```bash
# in your app
npm ls @mui/material @mui/icons-material react react-dom
```

Optional size/security checks:

* Size: [https://bundlephobia.com/package/@ameshkin/nextcrumbs](https://bundlephobia.com/package/@ameshkin/nextcrumbs)
* Vulnerabilities (example): `npx snyk test` or GitHub Advanced Security (CodeQL)

---

## FAQ

**Does it work with React Router?**
Yes—pass your router’s `<Link>` as `LinkComponent`. The UI is MUI; navigation is your router.

**How do I change the last crumb’s style?**
The last item usually has no `href`. You can add conditional styles by checking `href` presence in your `items` or wrap this component with your own style logic.

**Can I disable icons entirely?**
Yes—don’t pass `icon` and set `homeLabel` to a non-matching value.

---

## Accessibility & SEO

This component previously supported `schema.org` microdata via a `withSchema` and `withJsonLd` prop. These have been **removed** for the following reasons:

- ⚠️ **Google no longer consistently indexes client-side microdata** (e.g. via React or `dangerouslySetInnerHTML`) unless it's rendered server-side.
- 🧼 Breadcrumb JSON-LD tags added via `<script>` often **conflict with route-based apps** (e.g. dynamic segments in Next.js).
- 🔍 Most modern SEO guidance encourages **server-side or static rendering** of JSON-LD, not runtime injection.
- 🔧 Removing these props results in **simpler DOM output**, cleaner markup, and improved developer control.

**If you need structured breadcrumbs for SEO**, we recommend injecting them at the page level with your own layout component, using `<script type="application/ld+json">` manually for static pages only.

This component still provides:

- Accessible markup (`aria-label`, correct role semantics)
- Customizable separator, label, and icon logic
- Dynamic routing support via the `items` prop or `usePathBreadcrumbs` helper


## Contributing

* CI badge above expects a workflow at `.github/workflows/ci.yml`.
* Please run `npm run build` before sending a PR.
* Keep peer ranges broad enough for MUI 7 / React 18–19.

---

## License

[MIT](LICENSE)

```


---

## Additional Example — Minimal AutoTrail

> Simple usage with default behavior (no `labelMap`, `exclude`, or `baseHref`)

```tsx
"use client";
import { usePathname } from "next/navigation";
import { Breadcrumbs, usePathBreadcrumbs } from "@ameshkin/nextcrumbs";
import Link from "next/link";

export default function AutoTrail() {
  const pathname = usePathname();
  const items = usePathBreadcrumbs(pathname);

  return <Breadcrumbs LinkComponent={Link} items={items} />;
}
```

✅ Great for dashboards or quick scaffolded layouts. Automatically capitalizes, cleans up slugs, and converts URL segments into breadcrumb labels.
