/**
 * Local package resolution
 */

import path from "node:path";
import { loadProjectRules } from "../config/loadProjectRules.js";

export type LocalPackageKey =
  | "orchestrator"
  | "agentHandler"
  | "nextcrumbs"
  | "payloadPatrol"
  | "jiraMate"
  | "jiraMateUi";

/**
 * Resolve the directory path for a local package
 */
export function resolveLocalPackageDir(pkg: LocalPackageKey, rootDir: string = process.cwd()): string {
  const rules = loadProjectRules(rootDir);
  const dir = rules.packages?.[pkg];

  if (!dir) throw new Error(`Missing package path for ${pkg}`);

  return path.resolve(rootDir, dir);
}

