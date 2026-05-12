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
  assert(exists(cwd, "ai/template/reconcile.md"), "init should create template reconcile prompt");
  assert(exists(cwd, "ai/project/inbox/.gitkeep"), "init should create inbox directory");
  assert(exists(cwd, "ai/project/project.md"), "init should create project.md");
  assert(exists(cwd, "ai/project/task.md"), "init should create task.md");
  assert(exists(cwd, "ai/project/refs/final-shape.md"), "init should create project North Star");
  assert(exists(cwd, "ai/project/refs/module-map.md"), "init should create module map");
  assert(exists(cwd, "ai/project/refs/roadmap.md"), "init should create roadmap");
  assert(exists(cwd, "ai/project/inbox/ideas/.gitkeep"), "init should create ideas inbox");
  assert(exists(cwd, "ai/project/proposals/final-shape-updates/.gitkeep"), "init should create strategy proposal directory");
  assert(exists(cwd, "ai/project/proposals/final-shape-updates/_template.md"), "init should create strategy proposal template");
  assert(read(cwd, "ai/template/bootstrap.md").includes("确认维度"), "init should install bootstrap prompt");
  assert(read(cwd, "ai/template/bootstrap.md").includes("不要总结这个文件"), "bootstrap prompt should prevent summary-only behavior");
  assert(read(cwd, "ai/template/bootstrap.md").includes("ai/project/refs/final-shape.md"), "bootstrap prompt should initialize the North Star");
  assert(read(cwd, "ai/template/bootstrap.md").includes("ai/project/refs/module-map.md"), "bootstrap prompt should initialize module map");
  assert(read(cwd, "ai/template/bootstrap.md").includes("ai/project/refs/roadmap.md"), "bootstrap prompt should initialize roadmap");
  assert(read(cwd, "ai/template/bootstrap.md").includes("引导后交接"), "bootstrap prompt should include handoff");
  assert(read(cwd, "ai/template/bootstrap.md").includes("我建议下一步做"), "bootstrap prompt should recommend next steps");
  assert(read(cwd, "ai/template/bootstrap.md").includes("不要让人类主动去文件管理器里寻找问题"), "bootstrap prompt should not offload file inspection to humans");
  assert(read(cwd, "ai/template/bootstrap.md").includes("任务草稿摘要"), "bootstrap prompt should support task draft summary when a goal is provided");
  assert(read(cwd, "ai/template/prompt.md").includes("任务草稿交接"), "execution prompt should include task handoff");
  assert(read(cwd, "ai/template/prompt.md").includes("开始初始化这个项目"), "execution prompt should route natural bootstrap entry");
  assert(read(cwd, "ai/template/prompt.md").includes("整合 ai/project/inbox/ 里的新资料"), "execution prompt should route natural reconcile entry");
  assert(read(cwd, "ai/template/prompt.md").includes("继续推进这个项目"), "execution prompt should route natural continue entry");
  assert(read(cwd, "ai/template/prompt.md").includes("strategy_update"), "execution prompt should route strategy updates");
  assert(read(cwd, "ai/template/reconcile.md").includes("上下文整合"), "init should install reconcile prompt");
  assert(read(cwd, "ai/template/reconcile.md").includes("整合计划"), "reconcile prompt should require a plan first");
  assert(read(cwd, "ai/template/protocol.md").includes("引导读取范围"), "init should install bootstrap protocol");
  assert(read(cwd, "ai/template/protocol.md").includes("推荐下一步最值得做的任务"), "protocol should require recommended next steps");
  assert(read(cwd, "ai/template/protocol.md").includes("上下文整合模式"), "protocol should include context reconcile mode");
  assert(read(cwd, "ai/template/protocol.md").includes("策略修订模式"), "protocol should include strategy update mode");
  const initOutput = run(["init"], cwd);
  assert(initOutput.includes("开始初始化这个项目"), "init output should provide compact natural bootstrap prompt");
  assert(initOutput.includes("整合 ai/project/inbox/ 里的新资料"), "init output should provide compact natural reconcile prompt");
  assert(initOutput.includes("strategy_update"), "init output should mention strategy update flow");
  assert(initOutput.includes("文件:"), "init output should summarize file changes");
  assert(!initOutput.includes("[已更新]"), "init output should hide detailed file changes by default");
  assert(!initOutput.includes("Read ai/template/bootstrap.md"), "init output should not use weak Read bootstrap command");
  assert(run(["init", "--verbose"], cwd).includes("[已更新] ai/template/VERSION"), "init --verbose should show detailed file changes");
  const reconcileOutput = run(["reconcile"], cwd);
  assert(reconcileOutput.includes("AI Execution Template 上下文整合"), "reconcile should use installed Chinese language");
  assert(reconcileOutput.includes("整合 ai/project/inbox/ 里的新资料"), "reconcile should print natural Chinese prompt");
  const strategyOutput = run(["strategy"], cwd);
  assert(strategyOutput.includes("AI Execution Template 方向修订"), "strategy should use installed Chinese language");
  assert(strategyOutput.includes("ai/project/inbox/ideas/"), "strategy should point to ideas inbox");
  assert(strategyOutput.includes("方向修订提案"), "strategy should print natural Chinese strategy prompt");

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
  assert(read(cwd, "ai/template/bootstrap.md").includes("ai/project/refs/final-shape.md"), "English bootstrap prompt should initialize the North Star");
  assert(read(cwd, "ai/template/bootstrap.md").includes("ai/project/refs/module-map.md"), "English bootstrap prompt should initialize module map");
  assert(read(cwd, "ai/template/bootstrap.md").includes("ai/project/refs/roadmap.md"), "English bootstrap prompt should initialize roadmap");
  assert(read(cwd, "ai/template/bootstrap.md").includes("Recommended next step"), "English bootstrap prompt should recommend next steps");
  assert(read(cwd, "ai/template/bootstrap.md").includes("Do not make the human hunt through files"), "English bootstrap prompt should not offload file inspection to humans");
  assert(read(cwd, "ai/template/prompt.md").includes("Start initializing this project"), "English execution prompt should route natural bootstrap entry");
  assert(read(cwd, "ai/template/prompt.md").includes("Reconcile the new material in ai/project/inbox/"), "English execution prompt should route natural reconcile entry");
  assert(read(cwd, "ai/template/prompt.md").includes("Continue this project"), "English execution prompt should route natural continue entry");
  assert(read(cwd, "ai/template/prompt.md").includes("strategy_update"), "English execution prompt should route strategy updates");
  assert(exists(cwd, "ai/project/refs/final-shape.md"), "English init should create project North Star");
  assert(exists(cwd, "ai/project/refs/module-map.md"), "English init should create module map");
  assert(exists(cwd, "ai/project/refs/roadmap.md"), "English init should create roadmap");
  assert(exists(cwd, "ai/project/proposals/final-shape-updates/_template.md"), "English init should create strategy proposal template");
  assert(read(cwd, "ai/template/reconcile.md").includes("Context Reconcile"), "English init should install English reconcile prompt");
  assert(read(cwd, "ai/template/reconcile.md").includes("reconciliation plan"), "English reconcile prompt should require a plan first");
  assert(initOutput.includes("Start initializing this project"), "English init output should provide English bootstrap prompt");
  assert(initOutput.includes("Reconcile the new material in ai/project/inbox/"), "English init output should provide English reconcile prompt");
  assert(initOutput.includes("strategy_update"), "English init output should mention strategy update flow");
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
  const reconcileOutput = run(["reconcile"], cwd);
  assert(reconcileOutput.includes("AI Execution Template Context Reconcile"), "reconcile should use installed English language");
  assert(reconcileOutput.includes("Reconcile the new material in ai/project/inbox/"), "reconcile should print natural English prompt");
  const strategyOutput = run(["strategy"], cwd);
  assert(strategyOutput.includes("AI Execution Template Strategy Update"), "strategy should use installed English language");
  assert(strategyOutput.includes("ai/project/inbox/ideas/"), "strategy should point to ideas inbox");
  assert(strategyOutput.includes("direction amendment proposal"), "strategy should print natural English strategy prompt");
  assert(run(["reconcile", "--lang", "zh"], cwd).includes("整合 ai/project/inbox/ 里的新资料"), "reconcile --lang zh should override installed language");
  assert(run(["strategy", "--lang", "zh"], cwd).includes("方向修订提案"), "strategy --lang zh should override installed language");
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
