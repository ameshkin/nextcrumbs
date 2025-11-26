# Orchestrator – Core Package, Dotfile, and Integrations

Orchestrator is a **private, internal-only package**.  

It is the central committee that reads project rules, coordinates my other packages, manages bugs, and exposes a UI + route layer to make all of this easy to see and change.

This document defines:

- The **core files** the `.orchestrator` system needs.

- How it integrates with other **local packages**.

- How `bugs.json` and `project-rules.json` (also referred to as `rules.json`) are used.

- How it will eventually generate **UI screens** and **routes** (Next.js and Express).

- How it keeps **Cursor settings** aligned with its own paths.

No tests in this phase. Only structure and integration scaffolding.

---

## 1. Core Files and Locations

### 1.1 Root-level orchestrator files

Create the following at the repository root:

1. `.orchestrator.json`  

   Main configuration file for the orchestrator package:

   ```json
   {
     "$schema": "./.orchestrator.schema.json",
     "rulesFile": "project-rules.json",
     "bugsFile": "bugs.json",
     "ui": {
       "enableRoutes": true,
       "nextAppDir": "apps/web",
       "expressServerFile": "server/index.ts"
     },
     "cursor": {
       "manageCursorRules": true,
       "autoApprovePatterns": [
         "packages/orchestrator/**",
         ".progress/orchestrator/**"
       ]
     }
   }
   ```

2. `.orchestrator.schema.json`

   A JSON schema describing `.orchestrator.json`, `project-rules.json`, and `bugs.json` references.
   In this phase, just create a **minimal** schema with types and descriptions; no full validation logic is necessary yet.

3. `project-rules.json`

   Also referred to as `rules.json` in conversation.

   This is the **high-level rules file** that tells Orchestrator:

   * Which local packages exist and where they live.

   * Which feature groups are enabled.

   * Which UI sections and routes should be generated.

   * How Jira integration and bug flows should behave.

   Start with a small, clear structure; Orchestrator will evolve it:

   ```json
   {
     "$schema": "./.orchestrator.schema.json",
     "packages": {
       "orchestrator": "packages/orchestrator",
       "agentHandler": "packages/agent-handler",
       "nextcrumbs": "packages/nextcrumbs",
       "payloadPatrol": "packages/payload-patrol",
       "jiraMate": "packages/jira-mate",
       "jiraMateUi": "packages/jira-mate-ui"
     },
     "features": {
       "bugs": true,
       "jiraIntegration": true,
       "uiBuilder": true,
       "routeGeneration": true
     },
     "ui": {
       "sections": [
         "rules",
         "bugs",
         "jira",
         "packages",
         "routes"
       ]
     }
   }
   ```

4. `bugs.json`

   Orchestrator's own **bug ledger**, tightly integrated with Jira via `jira-mate`.

   Example initial shape:

   ```json
   {
     "$schema": "./.orchestrator.schema.json",
     "bugs": []
   }
   ```

   Orchestrator will be responsible for adding entries, reading them, and coordinating with Jira.

---

### 1.2 The `packages/orchestrator` structure

Create the package skeleton under `packages/orchestrator/`:

```txt
packages/
  orchestrator/
    package.json
    tsconfig.json
    src/
      index.ts
      config/
        loadOrchestratorConfig.ts
        loadProjectRules.ts
        loadBugs.ts
      integrations/
        agentHandler.ts
        nextCrumbs.ts
        payloadPatrol.ts
        jiraMate.ts
        localPackages.ts
      domain/
        rules/
          rulesEngine.ts
        bugs/
          bugsRegistry.ts
          bugsToJiraBridge.ts
        ui/
          uiModel.ts
      routes/
        next/
          generateNextRoutes.ts
        express/
          generateExpressRouter.ts
      cursor/
        ensureCursorRules.ts
        paths.ts
```

Purpose of each piece:

* `src/index.ts` – central export surface. Re-export config loaders, domain services, and route generators.

* `src/config/*` – loading and normalizing `.orchestrator.json`, `project-rules.json`, `bugs.json`.

* `src/integrations/*` – thin adapters to other local packages.

* `src/domain/rules/*` – logic to interpret rules and turn them into actions.

* `src/domain/bugs/*` – local bug registry + Jira bridge.

* `src/domain/ui/uiModel.ts` – declarative description of UI sections and widgets to be generated.

* `src/routes/next/*` – functions that generate route configs/components for a Next.js app.

* `src/routes/express/*` – helpers to build an Express router if needed.

* `src/cursor/*` – utilities to **read and update** Cursor settings files (`.cursorrules`, etc.) programmatically.

No implementation logic yet; only files and basic imports with short comments.

---

## 2. Integrations with Other Local Packages

Create integration shims so Orchestrator knows who it talks to. These are **not** full implementations, only type-safe entry points.

### 2.1 Integration stubs

Each file below should:

* Import the package.

* Export a small, typed placeholder function.

* Use brief comments to describe future behavior.

1. `src/integrations/agentHandler.ts`

   ```ts
   import { AgentHandler } from "@ameshkin/agent-handler";

   export function getAgentHandler() {
     // Future: configure and return a shared AgentHandler instance for orchestrator.
     return new AgentHandler({});
   }
   ```

2. `src/integrations/nextCrumbs.ts`

   ```ts
   import { crumbs } from "@ameshkin/nextcrumbs";

   export function createOrchestratorCrumbs() {
     // Future: generate navigation crumbs for orchestrator UI sections.
     return crumbs([]);
   }
   ```

3. `src/integrations/payloadPatrol.ts`

   ```ts
   import { filterInput } from "@ameshkin/payload-patrol";

   export function sanitizeOrchestratorInput<T>(input: T): T {
     // Future: apply strong sanitation rules for orchestrator forms and JSON.
     return filterInput(input);
   }
   ```

4. `src/integrations/jiraMate.ts`

   ```ts
   import { JiraMate } from "@ameshkin/jira-mate";

   export function getJiraMateClient() {
     // Future: load Jira config from project-rules and return a ready client.
     return new JiraMate({});
   }
   ```

5. `src/integrations/localPackages.ts`

   ```ts
   import path from "node:path";
   import { loadProjectRules } from "../config/loadProjectRules";

   export type LocalPackageKey =
     | "orchestrator"
     | "agentHandler"
     | "nextcrumbs"
     | "payloadPatrol"
     | "jiraMate"
     | "jiraMateUi";

   export function resolveLocalPackageDir(pkg: LocalPackageKey): string {
     const rules = loadProjectRules();
     const dir = rules.packages?.[pkg];

     if (!dir) throw new Error(`Missing package path for ${pkg}`);

     return path.resolve(process.cwd(), dir);
   }
   ```

---

## 3. `bugs.json` and Jira Integration

`bugs.json` is Orchestrator's **local registry of issues** that may or may not have Jira counterparts.

### 3.1 Basic structure

Each bug entry will look something like:

```json
{
  "id": "local-uuid-or-slug",
  "title": "Short summary",
  "description": "Longer markdown description",
  "status": "open",
  "severity": "low",
  "area": "orchestrator-ui",
  "file": "packages/orchestrator/src/domain/bugs/bugsRegistry.ts",
  "jiraKey": null,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

Orchestrator will later:

* Create entries in `bugs.json` from UI or CLI.

* Call `jira-mate` to create a Jira issue when requested.

* Update `jiraKey` in `bugs.json` once a Jira issue exists.

* Keep local and Jira states reasonably aligned.

For this phase, only:

* Define the **file**.

* Define the **shape**.

* Wire loader functions in `src/config/loadBugs.ts`.

* Create placeholder methods in `src/domain/bugs/bugsRegistry.ts` and `src/domain/bugs/bugsToJiraBridge.ts` with comments.

---

## 4. Using `project-rules.json` / `rules.json` to Drive Everything

Orchestrator must treat `project-rules.json` (aka `rules.json`) as the **constitution**.

### 4.1 Loader and model

In `src/config/loadProjectRules.ts`:

* Read the file path from `.orchestrator.json` (`rulesFile`).

* Load and parse JSON.

* Cast to a TypeScript interface `ProjectRules`.

* Provide a simple, synchronous getter:

```ts
export interface ProjectRules {
  packages: Record<string, string>;
  features: {
    bugs: boolean;
    jiraIntegration: boolean;
    uiBuilder: boolean;
    routeGeneration: boolean;
  };
  ui: {
    sections: string[];
  };
}

export function loadProjectRules(): ProjectRules {
  // Future: file read and minimal validation.
  throw new Error("Not implemented yet");
}
```

### 4.2 Rules as single source of truth

All major orchestrator decisions must flow from `ProjectRules`:

* Which packages to integrate with and from where.

* Whether `bugs` features are enabled.

* Whether Jira integration is active.

* Which UI sections are visible.

* Whether Next/Express routes should be generated.

* Which paths should be added to Cursor auto-approve lists.

No logic yet; just make the contract clear and central.

---

## 5. UI and Route Generation

Orchestrator must be able to **provide a UI** and **build routes** for both Next.js and Express.

### 5.1 UI model

In `src/domain/ui/uiModel.ts`:

* Create a minimal type model for UI sections:

```ts
export type UiSectionId = "rules" | "bugs" | "jira" | "packages" | "routes";

export interface UiSection {
  id: UiSectionId;
  title: string;
  description?: string;
  enabled: boolean;
}

export function buildUiSections(): UiSection[] {
  // Future: read project-rules and construct sections.
  return [];
}
```

The UI will eventually be rendered by `jira-mate-ui` or a local orchestrator UI shell. For now, just specify the model.

### 5.2 Next.js route generation

In `src/routes/next/generateNextRoutes.ts`:

* Define functions that can generate route definitions/components for a Next.js app living at `ui.nextAppDir` from `.orchestrator.json`.

* Do **not** actually write files in this phase; only define the API and placeholder function:

```ts
import type { UiSection } from "../../domain/ui/uiModel";

export interface NextRouteSpec {
  path: string;
  sectionId: string;
}

export function buildNextRouteSpecs(sections: UiSection[]): NextRouteSpec[] {
  // Future: map sections to /orchestrator/* routes.
  return [];
}
```

Later phases will instruct Cursor to actually create the files in the Next.js app.

### 5.3 Express route generation

In `src/routes/express/generateExpressRouter.ts`:

* Provide placeholders to build an Express router, if I decide to expose orchestrator features via API:

```ts
import type { Router } from "express";

export function buildOrchestratorRouter(express: { Router: () => Router }): Router {
  // Future: build a router for /orchestrator, driven by project-rules and UI model.
  throw new Error("Not implemented yet");
}
```

---

## 6. Updating Cursor Settings Files

Orchestrator should also be able to **keep Cursor configuration in sync** with its own expansion.

### 6.1 Cursor utilities

In `src/cursor/paths.ts`:

* Centralize orchestrator-related paths:

```ts
export const ORCHESTRATOR_PATHS = {
  pkg: "packages/orchestrator/**",
  progress: ".progress/orchestrator/**"
} as const;
```

In `src/cursor/ensureCursorRules.ts`:

* Read `.orchestrator.json`.

* If `cursor.manageCursorRules` is true, read `.cursorrules` at repo root.

* Ensure that the `autoApprovePatterns` from `.orchestrator.json` are present in `.cursorrules`.

For this phase, only create the file and comments stating:

* It will **never** auto-approve outside the configured patterns.

* It will be used by an npm script later (e.g., `npm run orchestrator:sync-cursor`).

No actual file-writing logic yet; just structure and imports.

---

## 7. Execution Summary for Cursor

For this file, your concrete tasks are:

1. **Create** the core root files:

   * `.orchestrator.json`

   * `.orchestrator.schema.json` (stub)

   * `project-rules.json`

   * `bugs.json`

2. **Create** the package skeleton under `packages/orchestrator/` exactly as listed.

3. **Add** the integration stubs for:

   * `agent-handler`

   * `nextcrumbs`

   * `payload-patrol`

   * `jira-mate`

   * local package resolution

4. **Create** config loader stubs for:

   * `.orchestrator.json`

   * `project-rules.json`

   * `bugs.json`

5. **Create** UI model and route-generation placeholder files for:

   * Next.js routes

   * Express router

6. **Create** cursor utilities for:

   * Orchestrator paths

   * Future `.cursorrules` updates

7. **Do not write tests.**

   No test files, no test runners, no coverage.

   This phase is only about making Orchestrator **real, visible, and wired** into the rest of the local packages.

The next document will define **RULES-SPEC**: the exact schema and examples for `project-rules.json` / `rules.json` and how they drive each feature.

