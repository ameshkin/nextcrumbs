# Next Crumb

> MUI 7 Breadcrumbs with **Next.js Link** support, optional **URL-based generation**, and **SEO microdata**. Router-agnostic, zero runtime deps.


| Item            | Value                                                                                     | Badge |
|-----------------|-------------------------------------------------------------------------------------------|-------|
| **GitHub repo** | [github.com/ameshkin/nextcrumbs](https://github.com/ameshkin/nextcrumbs)                  | —     |
| **CI (main)**   | `.github/workflows/ci-main.yml`                                                           | [![CI — main](https://img.shields.io/github/actions/workflow/status/ameshkin/nextcrumbs/ci-main.yml?branch=main&label=ci%20(main))](https://github.com/ameshkin/nextcrumbs/actions/workflows/ci-main.yml) |
| **CI (dev)**    | `.github/workflows/ci-dev.yml`                                                            | [![CI — dev](https://img.shields.io/github/actions/workflow/status/ameshkin/nextcrumbs/ci-dev.yml?branch=dev&label=ci%20(dev))](https://github.com/ameshkin/nextcrumbs/actions/workflows/ci-dev.yml) |
| **npm package** | [@ameshkin/nextcrumbs](https://www.npmjs.com/package/@ameshkin/nextcrumbs)               | [![npm](https://img.shields.io/npm/v/@ameshkin/nextcrumbs.svg)](https://www.npmjs.com/package/@ameshkin/nextcrumbs) |
| **Install**     | `npm i @ameshkin/nextcrumbs`                                                              | [![Install test — main](https://img.shields.io/github/actions/workflow/status/ameshkin/nextcrumbs/install.yml?branch=main&label=install%20test)](https://github.com/ameshkin/nextcrumbs/actions/workflows/install.yml) |
| **Peer deps**   | `@mui/material@^7`, `@mui/icons-material@^7`, `react@>=18`, `react-dom@>=18`             | ![peer deps](https://img.shields.io/badge/peer_deps-MUI%207%20%7C%20Icons%207%20%7C%20React%2018-blue) |
| **Types**       | TypeScript                                                                                | ![types](https://img.shields.io/badge/types-TypeScript-blue.svg) |
| **License**     | MIT                                                                                       | [![license](https://img.shields.io/badge/license-MIT-black.svg)](LICENSE) |
| **Bundle size** | bundlephobia                                                                              | [![bundle size](https://img.shields.io/bundlephobia/minzip/%40ameshkin%2Fnextcrumbs?label=bundle%20size)](https://bundlephobia.com/package/@ameshkin/nextcrumbs) |
| **Deps status** | libraries.io                                                                              | [![deps](https://img.shields.io/librariesio/release/npm/%40ameshkin%2Fnextcrumbs)](https://libraries.io/npm/%40ameshkin%2Fnextcrumbs) |

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

## Minimal AutoTrail Example

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


Here are the two new README sections you asked for, ready to paste.

---

## GitHub Action Pipeline

This project ships with two CI workflows—one for `main` and one for `dev`—that run a strict, fail-fast build and test matrix.

**What the pipeline does**

1. **Checkout & Node setup (Node 20)**
2. **Install** with `npm ci` (immutable lockfile)
3. **Typecheck** with `tsc --noEmit`
4. **Build** with `tsup` (ESM + CJS + d.ts)
5. **Test** with Vitest (jsdom + RTL)

**Why it’s strict**

* **Fail-fast**: any step error stops the job immediately
* **Immutable installs**: reproducible builds with `npm ci`
* **Matrix (optional)**: enable Node 18/20 if you need multi-runtime parity

**Status badges**

| Branch | CI                                                                                                                                                                                |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main` | [![CI — main](https://img.shields.io/github/actions/workflow/status/ameshkin/nextcrumbs/ci.yml?branch=main\&label=ci%20\(main\))](https://github.com/ameshkin/nextcrumbs/actions) |
| `dev`  | [![CI — dev](https://img.shields.io/github/actions/workflow/status/ameshkin/nextcrumbs/ci.yml?branch=dev\&label=ci%20\(dev\))](https://github.com/ameshkin/nextcrumbs/actions)    |

**Run the same checks locally**

```bash
npm ci
npm run typecheck
npm run build
npm test -- --run
```

> Tip: Keep your PRs green by running these before pushing.

---

## Automated Tests

The test stack is **Vitest + jsdom + React Testing Library** with a lightweight **Next.js Link mock** so components render without a Next runtime.

**Key pieces**

* **Vitest globals & jsdom** are enabled via `vitest.config.ts` and a `vitest.setup.ts` that loads Jest-DOM matchers.
* **Next Link mock**: tests import a tiny `<Link>` that renders to an anchor. This allows `<Breadcrumbs>` to use a `LinkComponent` without pulling in Next.
* **Component under test**: the MUI-based `<Breadcrumbs>` renders items, home icon behavior, separators, and current page semantics.

**Typical test patterns**

* **Hook tests** (`usePathBreadcrumbs`) validate URL→crumb generation, label mapping, exclusions, and last-item semantics.
* **Component tests** (`Breadcrumbs`) assert text rendering, link vs. current item behavior, and accessibility attributes.

**Writing a component test**

```tsx
// src/Breadcrumbs.test.tsx
import { render, screen } from "@testing-library/react";
import Breadcrumbs from "./Breadcrumbs";
import Link from "./nextLinkMock"; // mock replaces next/link

describe("Breadcrumbs", () => {
  it("renders all breadcrumb items", () => {
    render(
      <Breadcrumbs
        LinkComponent={Link}
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: "New" },
        ]}
      />
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
  });
});
```

**Running tests**

```bash
# one-shot
npm test -- --run

# watch mode
npm run test
```


# TODO!!

### React Router Automated Crumbs


### Github Action Pipeline

### More Automated Tests