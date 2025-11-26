/**
 * Load project-rules.json (the constitution)
 */

import { readFile } from "fs/promises";
import { join } from "path";
import { loadOrchestratorConfig } from "./loadOrchestratorConfig.js";

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

/**
 * Load project rules from project-rules.json
 * Reads the file path from .orchestrator.json (rulesFile)
 */
export function loadProjectRules(rootDir: string = process.cwd()): ProjectRules {
  // Future: file read and minimal validation.
  // For now, return a placeholder that will be implemented
  throw new Error("Not implemented yet");
}

