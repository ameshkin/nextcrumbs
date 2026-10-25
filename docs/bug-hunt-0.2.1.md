# Bug hunt report (0.2.1)

Date: 2026-10-25. Scope: `src/`, publish path, peers. Status: **fixed in tree** (see `docs/changes.md`).

## Confirmed issues (resolved)

| ID | Severity | Issue | Fix |
| --- | --- | --- | --- |
| BH-01 | High | React Router `Link` expects `to`, crumbs passed `href` | `linkProp="to"` on `<Breadcrumbs>` |
| BH-02 | Med | Hardcoded root `mb: 2` | Default `mb: 0` |
| BH-03 | Med | Label `"Home"` mid-trail got Home icon | Icon only when `href === homeHref` |
| BH-04 | Med | RR at `/` self-linked Home crumb | `{ label: "Home" }` with no `href` |
| BH-05 | Med | JSON-LD defaulted to `https://example.com` | No default; require `origin` / browser fallback |
| BH-06 | Low | `Content` recreated every render | Hoisted `CrumbContent` |
| BH-07 | Low | `"use client"` on `utils/jsonld.js` | Client banner skipped for pure utils |
| BH-08 | Low | Publish from home dir packs `~` | Operator: `cd` into package (`.npmignore` hardened) |

## Features added from the backlog

1. `maxItems` / collapse (`itemsBeforeCollapse`, `itemsAfterCollapse`, `expandText`)
2. Pure `buildPathBreadcrumbs` (RSC-safe subpath)
3. `size` + `truncate`
4. `linkProp: "href" | "to"`
5. `jsonLdOrigin` on `<Breadcrumbs>`
6. Trusted Publishing workflow: `.github/workflows/publish.yml`

## Ops (Trusted Publishing)

1. On npmjs.com → `@ameshkin/nextcrumbs` → **Trusted Publisher** → GitHub Actions:
   - Owner: `ameshkin`
   - Repo: `nextcrumbs`
   - Workflow: `publish.yml`
2. Push the branch / create a GitHub Release (or run **Publish** via `workflow_dispatch`).
3. No OTP / classic token needed for that workflow once the publisher is configured.
