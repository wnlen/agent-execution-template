#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const packagePath = path.join(repoRoot, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

function fail(message) {
  throw new Error(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function listFiles(relativeDir) {
  const root = path.join(repoRoot, relativeDir);
  const files = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        files.push(path.relative(root, fullPath).split(path.sep).join("/"));
      }
    }
  }

  walk(root);
  return files.sort();
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(`${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

function assertIncludes(content, expected, message) {
  if (!content.includes(expected)) {
    fail(`${message}\nMissing: ${expected}`);
  }
}

function assertFileListsMatch(leftDir, rightDir, message) {
  const left = listFiles(leftDir).join("\n");
  const right = listFiles(rightDir).join("\n");
  assertEqual(left, right, message);
}

function assertTreesMatch(leftDir, rightDir, message) {
  const leftFiles = listFiles(leftDir);
  const rightFiles = listFiles(rightDir);
  assertEqual(leftFiles.join("\n"), rightFiles.join("\n"), `${message}: file list differs`);

  for (const file of leftFiles) {
    const left = read(path.join(leftDir, file));
    const right = read(path.join(rightDir, file));
    assertEqual(left, right, `${message}: ${file} differs`);
  }
}

function main() {
  const version = packageJson.version;
  assertEqual(packageJson.name, "@wnlen/agent-execution-template", "package name changed unexpectedly");
  assertEqual(
    packageJson.bin && packageJson.bin["agent-execution-template"],
    "bin/agent-execution-template.js",
    "package bin entry should point to the CLI"
  );

  assertEqual(read("template/zh/ai/template/VERSION").trim(), version, "zh template version must match package version");
  assertEqual(read("template/en/ai/template/VERSION").trim(), version, "en template version must match package version");
  assertEqual(read("ai/template/VERSION").trim(), version, "installed zh template version must match package version");

  assertFileListsMatch("template/zh/ai", "template/en/ai", "zh and en templates must expose the same file layout");
  assertTreesMatch("template/zh/ai/template", "ai/template", "installed ai/template must mirror template/zh/ai/template");
  assertEqual(read("template/zh/ai/README.md"), read("ai/README.md"), "installed ai/README.md must mirror template/zh/ai/README.md");

  const spec = read("docs/SPEC.md");
  assertIncludes(spec, `Package: @wnlen/agent-execution-template@${version}`, "SPEC package version must match package.json");

  const scripts = packageJson.scripts || {};
  assertIncludes(scripts.test || "", "test/selftest.js", "npm test should run the CLI selftest");
  assertIncludes(scripts.test || "", "test/check-release.js", "npm test should run release consistency checks");

  console.log("release check ok");
}

main();
