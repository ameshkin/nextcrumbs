# NextCrumbs documentation

Guides for `@ameshkin/nextcrumbs` **0.2.1+**.

| Guide | Audience |
| --- | --- |
| [vanilla-json.md](./vanilla-json.md) | Vite / any React (no Next.js) and JSON-LD SEO |
| [react-router.md](./react-router.md) | Optional React Router subpath (`linkProp="to"`), common with Vite |
| [next-router.md](./next-router.md) | Optional Next.js App Router (`usePathBreadcrumbs`, RSC helper) |
| [gitlab.md](./gitlab.md) | Subpath exports and CI consumption |
| [changes.md](./changes.md) | Export layout and 0.2.1 notes |

Start with the root [README](../README.md) for install and API tables.

## Version notes

* Prefer **0.2.1+**.
* **0.2.0** is broken (`exports` pointed at missing `./public/*`).
* React Router APIs are **subpath-only**. They are not exported from the main entry.
* Published tarball contains `dist/`, `README.md`, and `LICENSE` only.
