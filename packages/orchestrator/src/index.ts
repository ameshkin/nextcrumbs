/**
 * Orchestrator - Central Package Coordinator
 * 
 * Central export surface. Re-export config loaders, domain services, and route generators.
 */

// Config loaders
export * from "./config/loadOrchestratorConfig.js";
export * from "./config/loadProjectRules.js";
export * from "./config/loadBugs.js";

// Integrations
export * from "./integrations/agentHandler.js";
export * from "./integrations/nextCrumbs.js";
export * from "./integrations/payloadPatrol.js";
export * from "./integrations/jiraMate.js";
export * from "./integrations/localPackages.js";

// Domain services
export * from "./domain/rules/rulesEngine.js";
export * from "./domain/bugs/bugsRegistry.js";
export * from "./domain/bugs/bugsToJiraBridge.js";
export * from "./domain/ui/uiModel.js";

// Route generators
export * from "./routes/next/generateNextRoutes.js";
export * from "./routes/express/generateExpressRouter.js";

// Cursor utilities
export * from "./cursor/ensureCursorRules.js";
export * from "./cursor/paths.js";

