_# Next Crumb

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
- [Automated Testing](#automated-testing)
- [Accessibility & SEO](#accessibility--seo)
- [Dependency Checks](#dependency-checks)
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
- (Optional) @mui/icons-material **7+**
- Next.js **13.4+** (if using Next + App Router)

---

## Install

```bash
npm i @ameshkin/nextcrumbs
# peer deps
npm i @mui/material @mui/icons-material react react-dom
```


