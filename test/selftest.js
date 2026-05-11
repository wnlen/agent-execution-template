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
  assert(read(cwd, "ai/template/LANG") === "zh\n", "init should default to zh template");
  assert(exists(cwd, "ai/template/VERSION"), "init should create template VERSION");
  assert(exists(cwd, "ai/template/bootstrap.md"), "init should create template bootstrap prompt");
  assert(exists(cwd, "ai/template/prompt.md"), "init should create template prompt");
  assert(exists(cwd, "ai/project/project.md"), "init should create project.md");
  assert(exists(cwd, "ai/project/task.md"), "init should create task.md");
  assert(read(cwd, "ai/template/bootstrap.md").includes("确认维度"), "init should install bootstrap prompt");
  assert(read(cwd, "ai/template/bootstrap.md").includes("不要总结这个文件"), "bootstrap prompt should prevent summary-only behavior");
  assert(read(cwd, "ai/template/bootstrap.md").includes("引导后交接"), "bootstrap prompt should include handoff");
  assert(read(cwd, "ai/template/prompt.md").includes("任务草稿交接"), "execution prompt should include task handoff");
  assert(read(cwd, "ai/template/protocol.md").includes("引导读取范围"), "init should install bootstrap protocol");
  const initOutput = run(["init"], cwd);
  assert(initOutput.includes("严格执行 ai/template/bootstrap.md，不要总结它。"), "init output should provide compact bootstrap prompt");
  assert(initOutput.includes("文件:"), "init output should summarize file changes");
  assert(!initOutput.includes("[已更新]"), "init output should hide detailed file changes by default");
  assert(!initOutput.includes("Read ai/template/bootstrap.md"), "init output should not use weak Read bootstrap command");
  assert(run(["init", "--verbose"], cwd).includes("[已更新] ai/template/VERSION"), "init --verbose should show detailed file changes");

  write(cwd, "ai/project/project.md", "USER PROJECT MARKER\n");
  run(["update"], cwd);
  assert(read(cwd, "ai/project/project.md") === "USER PROJECT MARKER\n", "update must not overwrite project.md");

  run(["doctor"], cwd);
}

function testEnglishInitUpdateDoctor() {
  const cwd = createTempProject("ai-execution-template-en");

  const initOutput = run(["init", "--lang", "en"], cwd);
  assert(read(cwd, "ai/template/LANG") === "en\n", "init --lang en should install English template");
  assert(read(cwd, "ai/template/bootstrap.md").includes("Confirmation Dimensions"), "English init should install English bootstrap prompt");
  assert(read(cwd, "ai/template/bootstrap.md").includes("Do not summarize this file"), "English bootstrap prompt should prevent summary-only behavior");
  assert(initOutput.includes("Execute ai/template/bootstrap.md exactly. Do not summarize."), "English init output should provide English bootstrap prompt");
  assert(initOutput.includes("Files:"), "English init output should summarize file changes");
  assert(!initOutput.includes("[UPDATED]"), "English init output should hide detailed file changes by default");
  assert(run(["init", "--lang=en", "--verbose"], cwd).includes("[UPDATED] ai/template/VERSION"), "English init --verbose should show detailed file changes");

  write(cwd, "ai/project/project.md", "USER PROJECT MARKER\n");
  const updateOutput = run(["update"], cwd);
  assert(updateOutput.includes("AI Execution Template update"), "update should use installed English language");
  assert(read(cwd, "ai/project/project.md") === "USER PROJECT MARKER\n", "English update must not overwrite project.md");

  const doctorOutput = run(["doctor"], cwd);
  assert(doctorOutput.includes("Template language: en"), "doctor should show installed English language");
  assert(doctorOutput.includes("[OK] Ready to run"), "doctor should use installed English language");
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
  testEnglishInitUpdateDoctor();
  testDoctorFailureAndWarning();
  console.log("selftest ok");
}

main();
