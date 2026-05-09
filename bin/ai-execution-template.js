#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const PACKAGE_ROOT = path.resolve(__dirname, "..");
const SOURCE_AI = path.join(PACKAGE_ROOT, "template", "ai");
const TARGET_AI = path.join(process.cwd(), "ai");

const REQUIRED_FILES = [
  "ai/template/VERSION",
  "ai/template/prompt.md",
  "ai/template/protocol.md",
  "ai/template/rules/core.md",
  "ai/template/rules/output.md",
  "ai/project/project.md",
  "ai/project/runtime.md",
  "ai/project/task.md",
  "ai/project/result.json",
  "ai/project/result.md",
  "ai/project/metrics.json"
];

function readVersion(root) {
  const versionFile = path.join(root, "VERSION");
  if (!fs.existsSync(versionFile)) return "unknown";
  return fs.readFileSync(versionFile, "utf8").trim() || "unknown";
}

function usage() {
  console.log(`AI Execution Template

Usage:
  ai-execution-template init
  ai-execution-template update
  ai-execution-template doctor
`);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function listFiles(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath, base));
    } else if (entry.isFile()) {
      files.push(path.relative(base, fullPath));
    }
  }
  return files.sort();
}

function copyFile(sourceRoot, targetRoot, relativePath, overwrite) {
  const source = path.join(sourceRoot, relativePath);
  const target = path.join(targetRoot, relativePath);
  const existed = fs.existsSync(target);
  if (!overwrite && fs.existsSync(target)) {
    return { action: "kept", path: relativePath };
  }
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
  return { action: existed ? "updated" : "created", path: relativePath };
}

function copyTree(sourceRoot, targetRoot, overwrite) {
  return listFiles(sourceRoot).map((relativePath) =>
    copyFile(sourceRoot, targetRoot, relativePath, overwrite)
  );
}

function printChanges(title, changes) {
  console.log(title);
  for (const change of changes) {
    console.log(`[${change.action.toUpperCase()}] ${change.path}`);
  }
}

function init() {
  if (!fs.existsSync(SOURCE_AI)) {
    console.error(`[FAIL] Template source not found: ${SOURCE_AI}`);
    process.exitCode = 1;
    return;
  }

  ensureDir(TARGET_AI);

  const changes = [];
  changes.push(...copyTree(path.join(SOURCE_AI, "template"), path.join(TARGET_AI, "template"), true)
    .map((change) => ({ ...change, path: path.join("ai/template", change.path) })));

  const readmeChange = copyFile(SOURCE_AI, TARGET_AI, "README.md", !fs.existsSync(path.join(TARGET_AI, "README.md")));
  changes.push({ ...readmeChange, path: path.join("ai", readmeChange.path) });

  changes.push(...copyTree(path.join(SOURCE_AI, "project"), path.join(TARGET_AI, "project"), false)
    .map((change) => ({ ...change, path: path.join("ai/project", change.path) })));

  printChanges("AI Execution Template init", changes);
  console.log(`
Next:
1. Edit ai/project/project.md
2. Edit ai/project/task.md
3. Run your AI agent with: Read ai/template/prompt.md
4. Check installation with: npx @wnlen/ai-execution-template doctor
`);
}

function update() {
  const sourceTemplate = path.join(SOURCE_AI, "template");
  const targetTemplate = path.join(TARGET_AI, "template");
  if (!fs.existsSync(sourceTemplate)) {
    console.error(`[FAIL] Template source not found: ${sourceTemplate}`);
    process.exitCode = 1;
    return;
  }
  ensureDir(targetTemplate);
  const changes = copyTree(sourceTemplate, targetTemplate, true)
    .map((change) => ({ ...change, path: path.join("ai/template", change.path) }));
  printChanges("AI Execution Template update", changes);
  console.log(`[OK] Updated ai/template/** to ${readVersion(sourceTemplate)}. ai/project/** was not modified.`);
}

function doctor() {
  console.log("AI Execution Template Doctor\n");
  console.log(`Template version: ${readVersion(path.join(TARGET_AI, "template"))}\n`);

  let missing = 0;
  let warnings = 0;

  for (const file of REQUIRED_FILES) {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      console.log(`[MISSING] ${file}`);
      missing += 1;
      continue;
    }
    const content = fs.readFileSync(fullPath, "utf8");
    if (
      ["ai/project/project.md", "ai/project/runtime.md", "ai/project/task.md"].includes(file) &&
      content.trim().length === 0
    ) {
      console.log(`[WARN] ${file} is empty`);
      warnings += 1;
      continue;
    }
    console.log(`[OK] ${file}`);
  }

  if (missing > 0) {
    console.log("\n[FAIL] Run npx @wnlen/ai-execution-template init");
    process.exitCode = 1;
  } else if (warnings > 0) {
    console.log("\n[OK] Ready to run with warnings");
  } else {
    console.log("\n[OK] Ready to run");
  }
}

const command = process.argv[2] || "help";

if (command === "init") {
  init();
} else if (command === "update") {
  update();
} else if (command === "doctor") {
  doctor();
} else {
  usage();
  if (command !== "help" && command !== "--help" && command !== "-h") {
    process.exitCode = 1;
  }
}
