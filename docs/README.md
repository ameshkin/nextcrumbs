# NextCrumbs docs

Documentation for `@ameshkin/nextcrumbs` **0.2.1+**.

| Guide | Description |
| --- | --- |
| [next-router.md](./next-router.md) | Next.js App Router + `usePathBreadcrumbs` |
| [react-router.md](./react-router.md) | Optional React Router subpath hook |
| [vanilla-json.md](./vanilla-json.md) | No router + JSON-LD SEO helpers |
| [gitlab.md](./gitlab.md) | Subpath exports and CI/GitLab consumption |
| [changes.md](./changes.md) | Export layout, 0.2.1 fix notes, breaking changes |

Start with the root [README](../README.md) for install and quick start.

## Version notes

* Prefer **0.2.1+**.
* **0.2.0** is broken (exports pointed at missing `./public/*`).
* React Router APIs are **subpath-only** as of 0.2.1. They are not exported from the main entry.
