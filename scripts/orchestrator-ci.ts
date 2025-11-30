#!/usr/bin/env node

import { spawn } from "child_process";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import path from "path";

type StepName = "install" | "test:all" | "build";

type StepResult = {
  step: StepName;
  ok: boolean;
  code: number | null;
  skipped?: boolean;
};

type CiResult = {
  project: string;
  steps: StepResult[];
  finishedAt: string;
};

function runStep(cmd: string, args: string[], step: StepName): Promise<{ ok: boolean; code: number | null }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
      shell: process.platform === "win32"
    });
    child.on("close", (code) => {
      resolve({ ok: code === 0, code });
    });
  });
}

async function main() {
  const root = process.cwd();
  const orchestratorDir = path.join(root, ".orchestrator");
  if (!existsSync(orchestratorDir)) {
    mkdirSync(orchestratorDir, { recursive: true });
  }

  const pkgPath = path.join(root, "package.json");
  const pkg = existsSync(pkgPath) ? JSON.parse(readFileSync(pkgPath, "utf8")) : {};
  const scripts = pkg.scripts ?? {};
  const projectName = pkg.name ?? path.basename(root);

  const result: CiResult = {
    project: projectName,
    steps: [],
    finishedAt: new Date().toISOString()
  };

  console.log("[orchestrator-ci] npm install");
  const installRes = await runStep("npm", ["install"], "install");
  result.steps.push({ step: "install", ok: installRes.ok, code: installRes.code });
  if (!installRes.ok) {
    console.error("[orchestrator-ci] install failed");
    writeFileSync(path.join(orchestratorDir, "ci-result.json"), JSON.stringify(result, null, 2));
    process.exit(1);
  }

  if (scripts["test:all"]) {
    console.log("[orchestrator-ci] npm run test:all");
    const testRes = await runStep("npm", ["run", "test:all"], "test:all");
    result.steps.push({ step: "test:all", ok: testRes.ok, code: testRes.code });
    if (!testRes.ok) {
      console.error("[orchestrator-ci] tests failed");
      writeFileSync(path.join(orchestratorDir, "ci-result.json"), JSON.stringify(result, null, 2));
      process.exit(2);
    }
  } else {
    result.steps.push({ step: "test:all", ok: false, code: null, skipped: true });
  }

  if (scripts["build"]) {
    console.log("[orchestrator-ci] npm run build");
    const buildRes = await runStep("npm", ["run", "build"], "build");
    result.steps.push({ step: "build", ok: buildRes.ok, code: buildRes.code });
    writeFileSync(path.join(orchestratorDir, "ci-result.json"), JSON.stringify(result, null, 2));
    if (!buildRes.ok) {
      console.error("[orchestrator-ci] build failed");
      process.exit(3);
    }
  } else {
    result.steps.push({ step: "build", ok: false, code: null, skipped: true });
    writeFileSync(path.join(orchestratorDir, "ci-result.json"), JSON.stringify(result, null, 2));
  }

  console.log("[orchestrator-ci] completed successfully");
  process.exit(0);
}

main().catch((err) => {
  console.error("[orchestrator-ci] unexpected error", err);
  process.exit(99);
});

