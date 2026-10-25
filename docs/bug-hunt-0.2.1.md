# Bug hunt report (0.2.1)

Date: 2026-10-25. Scope: `src/`, publish path, peers. Tests: 122 passed.

## Confirmed issues

| ID | Severity | Issue | Where | Suggested fix |
| --- | --- | --- | --- | --- |
| BH-01 | High | React Router `Link` expects `to`, but crumbs pass `href` via MUI `Link`. Direct `LinkComponent={RouterLink}` can break SPA navigation. | `Breadcrumbs.tsx` | Add `linkProps` mapper (`href` → `to`) or document a required adapter (docs already show one pattern inconsistently). |
| BH-02 | Med | Hardcoded root `mb: 2` surprises layouts (extra margin under every trail). | `Breadcrumbs.tsx` defaultRootSx | Default `mb: 0`; let consumers set margin via `sx`. |
| BH-03 | Med | Any crumb whose **label** equals `homeLabel` gets the Home icon (not only `/`). Mid-trail pages titled "Home" look wrong. | `isHome` logic | Prefer `href === "/"` (or explicit `item.icon` / `homeHref`) over label match alone. |
| BH-04 | Med | At path `/` with no `rootLabel`, RR hook pushes `{ label: "Home", href: "/" }` so the only crumb is a link to self. | `useReactRouterBreadcrumbs.ts` | Use `{ label: "Home" }` (current page, no href). |
| BH-05 | Med | Default JSON-LD `origin` is `https://example.com`. Easy to ship bad SEO if forgotten. | `jsonld.ts` | Require `origin` (or read `window.location.origin` in the client component only). |
| BH-06 | Low | `Content` is declared inside the render function (new component type every render). | `Breadcrumbs.tsx` | Hoist `Content` outside. |
| BH-07 | Low | `"use client"` is prepended to `utils/jsonld.js`, so pure `toJsonLd` pulls a client boundary. | `tsup.config.ts` | Skip banner for `utils/jsonld.js` (keep it on UI/hook entries). |
| BH-08 | Low | Publish from home dir packs `~` and hits `.Trash` (`EPERM`). | Operator error | Always `cd` into the package. `.npmignore` now hardens packing. |

## Not bugs (by design / covered)

* React Router on subpath only (optional peer). Intentional for Next.js.
* MUI peers `^7` (not `>=7`). Intentional.
* Empty-string labels allowed in JSON-LD helpers (covered by older BUG-027 tests).

## What you can add next (highest value)

1. **`maxItems` / collapse** first-class (wrap MUI collapse props). Deep admin trails.
2. **`buildPathBreadcrumbs` pure helper** (RSC-safe). Hook becomes a thin wrapper.
3. **`size` + truncate** instead of only `dense`.
4. **Link adapter API** (`linkProp: "href" | "to"`) to close BH-01 cleanly.
5. **Optional `jsonLdOrigin` on `<Breadcrumbs>`** for one-shot SEO.
6. **TanStack Router** optional subpath (same pattern as RR).
7. **Trusted Publishing (OIDC)** for npm CI so you are not stuck on 2FA OTP / bypass GATs.

## Publish status (ops)

* Package ready at **0.2.1** on branch `release/0.2.1`.
* npm still needs **2FA / OTP** (`E403`) after fixing the wrong-cwd Trash error.
* Command: `cd .../nextcrumbs && npm publish --access public --otp=XXXXXX`
