#!/usr/bin/env node

/**
 * Example script demonstrating orchestrator usage
 */

import {
  loadOrchestratorConfig,
  loadProjectRules,
  loadBugs,
  buildUiSections,
  buildNextRouteSpecs,
  resolveLocalPackageDir,
  ORCHESTRATOR_PATHS,
} from "@ameshkin/orchestrator";

async function main() {
  console.log("🎯 Orchestrator Example Usage\n");
  console.log("=" .repeat(60));

  try {
    // 1. Load orchestrator configuration
    console.log("\n1️⃣  Loading Orchestrator Config...");
    const config = await loadOrchestratorConfig();
    console.log("   ✅ Config loaded:");
    console.log(`      - Rules file: ${config.rulesFile}`);
    console.log(`      - Bugs file: ${config.bugsFile}`);
    console.log(`      - UI enabled: ${config.ui.enableRoutes}`);
    console.log(`      - Next app dir: ${config.ui.nextAppDir}`);

    // 2. Load project rules (the constitution)
    console.log("\n2️⃣  Loading Project Rules...");
    const rules = await loadProjectRules();
    console.log("   ✅ Rules loaded:");
    console.log(`      - Packages: ${Object.keys(rules.packages).length}`);
    console.log(`      - Features enabled:`);
    console.log(`        • Bugs: ${rules.features.bugs}`);
    console.log(`        • Jira Integration: ${rules.features.jiraIntegration}`);
    console.log(`        • UI Builder: ${rules.features.uiBuilder}`);
    console.log(`        • Route Generation: ${rules.features.routeGeneration}`);
    console.log(`      - UI Sections: ${rules.ui.sections.length}`);

    // 3. Load bugs
    console.log("\n3️⃣  Loading Bugs...");
    const bugsData = await loadBugs();
    console.log("   ✅ Bugs loaded:");
    console.log(`      - Total bugs: ${bugsData.bugs.length}`);
    const openBugs = bugsData.bugs.filter((b) => b.status === "open");
    const fixedBugs = bugsData.bugs.filter((b) => b.status === "fixed");
    console.log(`      - Open: ${openBugs.length}`);
    console.log(`      - Fixed: ${fixedBugs.length}`);
    if (openBugs.length > 0) {
      console.log(`      - Sample open bugs:`);
      openBugs.slice(0, 3).forEach((bug) => {
        console.log(`        • ${bug.id}: ${bug.title} (${bug.severity})`);
      });
    }

    // 4. Build UI sections
    console.log("\n4️⃣  Building UI Sections...");
    const sections = await buildUiSections();
    console.log(`   ✅ Sections: ${sections.length}`);
    if (sections.length > 0) {
      sections.forEach((section) => {
        console.log(`      - ${section.id}: ${section.title} (${section.enabled ? "enabled" : "disabled"})`);
      });
    } else {
      console.log("      (No sections yet - implementation pending)");
    }

    // 5. Build Next.js route specs
    console.log("\n5️⃣  Building Next.js Route Specs...");
    const routeSpecs = buildNextRouteSpecs(sections);
    console.log(`   ✅ Route specs: ${routeSpecs.length}`);
    if (routeSpecs.length > 0) {
      routeSpecs.forEach((spec) => {
        console.log(`      - ${spec.path} (${spec.sectionId})`);
      });
    } else {
      console.log("      (No routes yet - implementation pending)");
    }

    // 6. Resolve local package directories
    console.log("\n6️⃣  Resolving Local Package Directories...");
    try {
      const orchestratorDir = await resolveLocalPackageDir("orchestrator");
      console.log(`   ✅ Orchestrator dir: ${orchestratorDir}`);
    } catch (error) {
      console.log(`   ⚠️  Could not resolve: ${error.message}`);
    }

    // 7. Show orchestrator paths
    console.log("\n7️⃣  Orchestrator Paths...");
    console.log(`   ✅ Package path: ${ORCHESTRATOR_PATHS.pkg}`);
    console.log(`   ✅ Progress path: ${ORCHESTRATOR_PATHS.progress}`);

    console.log("\n" + "=".repeat(60));
    console.log("✅ All orchestrator functions working correctly!\n");

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();

