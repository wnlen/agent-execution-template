#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const cli = path.join(repoRoot, "bin", "ai-execution-template.js");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function run(args, cwd, expectedStatus = 0) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd,
    encoding: "utf8"
  });
  const output = `${result.stdout}${result.stderr}`;
  if (result.status !== expectedStatus) {
    throw new Error(
      `Command failed: ${args.join(" ")}\nExpected: ${expectedStatus}\nActual: ${result.status}\n${output}`
    );
  }
  return output;
}

function exists(cwd, relativePath) {
  return fs.existsSync(path.join(cwd, relativePath));
}

function read(cwd, relativePath) {
  return fs.readFileSync(path.join(cwd, relativePath), "utf8");
}

function write(cwd, relativePath, content) {
  fs.writeFileSync(path.join(cwd, relativePath), content);
}

function createTempProject(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
}

function testInitUpdateDoctor() {
  const cwd = createTempProject("ai-execution-template-selftest");

  run(["init"], cwd);
  assert(exists(cwd, "ai/template/VERSION"), "init should create template VERSION");
  assert(exists(cwd, "ai/template/bootstrap.md"), "init should create template bootstrap prompt");
  assert(exists(cwd, "ai/template/prompt.md"), "init should create template prompt");
  assert(exists(cwd, "ai/project/project.md"), "init should create project.md");
  assert(exists(cwd, "ai/project/task.md"), "init should create task.md");
  assert(read(cwd, "ai/template/bootstrap.md").includes("Confirmation Dimensions"), "init should install bootstrap prompt");
  assert(read(cwd, "ai/template/bootstrap.md").includes("Do not summarize this file"), "bootstrap prompt should prevent summary-only behavior");
  assert(read(cwd, "ai/template/bootstrap.md").includes("Post-Bootstrap Handoff"), "bootstrap prompt should include handoff");
  assert(read(cwd, "ai/template/prompt.md").includes("Task Draft Handoff"), "execution prompt should include task handoff");
  assert(read(cwd, "ai/template/protocol.md").includes("Bootstrap Read Scope"), "init should install bootstrap protocol");
  const initOutput = run(["init"], cwd);
  assert(initOutput.includes("Execute ai/template/bootstrap.md exactly. Do not summarize."), "init output should provide compact bootstrap prompt");
  assert(initOutput.includes("Files:"), "init output should summarize file changes");
  assert(!initOutput.includes("[UPDATED]"), "init output should hide detailed file changes by default");
  assert(!initOutput.includes("Read ai/template/bootstrap.md"), "init output should not use weak Read bootstrap command");
  assert(run(["init", "--verbose"], cwd).includes("[UPDATED] ai/template/VERSION"), "init --verbose should show detailed file changes");

  write(cwd, "ai/project/project.md", "USER PROJECT MARKER\n");
  run(["update"], cwd);
  assert(read(cwd, "ai/project/project.md") === "USER PROJECT MARKER\n", "update must not overwrite project.md");

  run(["doctor"], cwd);
}

function testDoctorFailureAndWarning() {
  const missingCwd = createTempProject("ai-execution-template-missing");
  run(["init"], missingCwd);
  fs.unlinkSync(path.join(missingCwd, "ai/project/runtime.md"));
  run(["doctor"], missingCwd, 1);

  const warnCwd = createTempProject("ai-execution-template-warn");
  run(["init"], warnCwd);
  write(warnCwd, "ai/project/runtime.md", "");
  run(["doctor"], warnCwd);
}

function main() {
  testInitUpdateDoctor();
  testDoctorFailureAndWarning();
  console.log("selftest ok");
}

main();
