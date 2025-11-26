/**
 * Load .orchestrator.json configuration
 */

import { readFile } from "fs/promises";
import { join } from "path";

export interface OrchestratorConfig {
  $schema?: string;
  rulesFile: string;
  bugsFile: string;
  ui: {
    enableRoutes: boolean;
    nextAppDir: string;
    expressServerFile: string;
  };
  cursor: {
    manageCursorRules: boolean;
    autoApprovePatterns: string[];
  };
}

/**
 * Load orchestrator configuration from .orchestrator.json
 */
export async function loadOrchestratorConfig(rootDir: string = process.cwd()): Promise<OrchestratorConfig> {
  const configPath = join(rootDir, ".orchestrator.json");
  const content = await readFile(configPath, "utf-8");
  return JSON.parse(content) as OrchestratorConfig;
}

