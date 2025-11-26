/**
 * Load bugs.json - Orchestrator's bug ledger
 */

import { readFile } from "fs/promises";
import { join } from "path";
import { loadOrchestratorConfig } from "./loadOrchestratorConfig.js";

export interface Bug {
  id: string;
  title: string;
  description?: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  severity: "low" | "medium" | "high" | "critical";
  area?: string;
  file?: string;
  jiraKey: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BugsData {
  bugs: Bug[];
}

/**
 * Load bugs from bugs.json
 * Reads the file path from .orchestrator.json (bugsFile)
 */
export async function loadBugs(rootDir: string = process.cwd()): Promise<BugsData> {
  const config = await loadOrchestratorConfig(rootDir);
  const bugsPath = join(rootDir, config.bugsFile);
  const content = await readFile(bugsPath, "utf-8");
  return JSON.parse(content) as BugsData;
}

