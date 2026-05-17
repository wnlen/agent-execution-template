#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const cli = path.join(repoRoot, "bin", "agent-execution-template.js");

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

function countOccurrences(content, pattern) {
  return content.split(pattern).length - 1;
}

function managedEntrypointBlock(content) {
  const start = content.indexOf("<!-- agent-execution-template:start -->");
  const end = content.indexOf("<!-- agent-execution-template:end -->", start);
  assert(start >= 0 && end >= 0, "entrypoint content should include a managed block");
  return content.slice(start, end + "<!-- agent-execution-template:end -->".length);
}

function createTempProject(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
}

function testInitUpdateDoctor() {
  const cwd = createTempProject("agent-execution-template-selftest");

  run(["init"], cwd);
  assert(exists(cwd, "AGENTS.md"), "init should create root AGENTS.md entrypoint");
  assert(exists(cwd, "CLAUDE.md"), "init should create root CLAUDE.md entrypoint");
  assert(read(cwd, "AGENTS.md").includes("agent-execution-template:start"), "AGENTS.md should include managed protocol block");
  assert(read(cwd, "AGENTS.md").includes("ai/template/prompt.md"), "AGENTS.md should route agents to the protocol prompt");
  assert(read(cwd, "CLAUDE.md").includes("ai/template/prompt.md"), "CLAUDE.md should route Claude to the same protocol prompt");
  assert(managedEntrypointBlock(read(cwd, "AGENTS.md")) === managedEntrypointBlock(read(cwd, "CLAUDE.md")), "AGENTS.md and CLAUDE.md should contain the same managed compatibility block");
  assert(read(cwd, "AGENTS.md").includes("有意同时写入 `AGENTS.md` 和 `CLAUDE.md`"), "AGENTS.md should explain intentional compatibility duplication");
  assert(read(cwd, "AGENTS.md").includes("slash command 触发"), "AGENTS.md should route project workflows through slash commands");
  assert(read(cwd, "AGENTS.md").includes("普通问答或设计讨论只做只读回答"), "AGENTS.md should keep ordinary questions read-only");
  assert(!read(cwd, "AGENTS.md").includes("ai/template/bootstrap.md"), "AGENTS.md should not duplicate bootstrap routing details");
  assert(!read(cwd, "CLAUDE.md").includes("ai/template/bootstrap.md"), "CLAUDE.md should not duplicate bootstrap routing details");
  assert(read(cwd, "ai/template/LANG") === "zh\n", "init should default to zh template");
  assert(exists(cwd, "ai/template/VERSION"), "init should create template VERSION");
  assert(exists(cwd, "ai/template/bootstrap.md"), "init should create template bootstrap prompt");
  assert(exists(cwd, "ai/template/execution-policy.md"), "init should create execution policy prompt");
  assert(exists(cwd, "ai/template/prompt.md"), "init should create template prompt");
  assert(exists(cwd, "ai/template/reconcile.md"), "init should create template reconcile prompt");
  assert(exists(cwd, "ai/template/schemas/result.schema.json"), "init should create result schema");
  assert(exists(cwd, "ai/template/schemas/metrics.schema.json"), "init should create metrics schema");
  assert(exists(cwd, "ai/project/inbox/.gitkeep"), "init should create inbox directory");
  assert(exists(cwd, "ai/project/project.md"), "init should create project.md");
  assert(exists(cwd, "ai/project/task.md"), "init should create task.md");
  assert(exists(cwd, "ai/project/refs/final-shape.md"), "init should create project North Star");
  assert(exists(cwd, "ai/project/refs/module-map.md"), "init should create module map");
  assert(exists(cwd, "ai/project/refs/roadmap.md"), "init should create roadmap");
  assert(exists(cwd, "ai/project/inbox/ideas/.gitkeep"), "init should create ideas inbox");
  assert(exists(cwd, "ai/project/inbox/processed/.gitkeep"), "init should create processed inbox");
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
  assert(read(cwd, "ai/template/bootstrap.md").includes("ai/project/inbox/processed/raw/file.md"), "bootstrap prompt should archive absorbed raw inbox material");
  assert(read(cwd, "ai/template/bootstrap.md").includes("已吸收资料"), "bootstrap handoff should audit absorbed material");
  assert(read(cwd, "ai/template/bootstrap.md").includes("未吸收资料"), "bootstrap handoff should audit unabsorbed material");
  assert(read(cwd, "ai/template/bootstrap.md").includes("冲突处理"), "bootstrap handoff should audit conflict handling");
  assert(read(cwd, "ai/template/prompt.md").includes("任务草稿交接"), "execution prompt should include task handoff");
  assert(read(cwd, "ai/template/prompt.md").includes("本文件只负责路由"), "execution prompt should be a lightweight router");
  assert(read(cwd, "ai/template/prompt.md").includes("普通问答、协议解释"), "execution prompt should keep non-workflow requests read-only");
  assert(read(cwd, "ai/template/bootstrap.md").includes("不要把 `AGENTS.md` 或 `CLAUDE.md` 当作项目业务证据"), "bootstrap should not treat root agent entrypoints as project evidence");
  assert(read(cwd, "ai/template/execution-policy.md").includes("风险分级"), "execution policy should include risk rubric");
  assert(read(cwd, "ai/template/execution-policy.md").includes("execution_policy.task_tree"), "execution policy should require task tree persistence");
  assert(read(cwd, "ai/template/prompt.md").includes("默认只处理\n  `ai/project/inbox/*.md`"), "execution prompt should narrow inbox reconciliation");
  assert(read(cwd, "ai/template/protocol.md").includes("`bounded_continuous`"), "protocol should include bounded continuous execution");
  assert(read(cwd, "ai/template/execution-policy.md").includes("垂直切片"), "protocol should require vertical-slice progress for continuous execution");
  assert(read(cwd, "ai/template/execution-policy.md").includes("可独立验收的垂直切片"), "execution policy should define L1 granularity");
  assert(read(cwd, "ai/template/execution-policy.md").includes("不能边写草稿边执行"), "execution policy should block execution from draft tasks");
  assert(read(cwd, "ai/template/execution-policy.md").includes("不要为每个微小 L3 操作写回"), "execution policy should limit task tree write-back churn");
  assert(read(cwd, "ai/template/execution-policy.md").includes("公共接口、数据模型、权限、安全"), "execution policy should constrain Yellow corrections");
  assert(read(cwd, "ai/template/execution-policy.md").includes("用户可见输出"), "execution policy should define user-visible output rules");
  assert(read(cwd, "ai/template/execution-policy.md").includes("用户可见的计划"), "execution policy should keep user-visible planning in the installed language");
  assert(read(cwd, "ai/template/rules/output.md").includes("默认使用 `ai/template/LANG`"), "output rules should keep human-readable results in the installed language");
  assert(read(cwd, "ai/template/execution-policy.md").includes("不要默认展示完整 L2/L3/L4"), "execution policy should avoid exposing full subtask trees by default");
  assert(read(cwd, "ai/template/execution-policy.md").includes("不要展示内部协议字段"), "execution policy should hide internal protocol details by default");
  assert(read(cwd, "ai/template/execution-policy.md").includes("L1 为 2 个或更多，自动启用"), "protocol should auto-enable continuous execution from L1 count");
  assert(read(cwd, "ai/template/execution-policy.md").includes("每个 Checkpoint 必须包含"), "protocol should require evidence-backed checkpoints");
  assert(read(cwd, "ai/template/rules/core.md").includes("边界内连续执行门"), "core rules should include bounded continuous execution gate");
  assert(read(cwd, "ai/template/rules/core.md").includes("readiness = ready_to_execute"), "core rules should require ready task before execution");
  assert(read(cwd, "ai/template/rules/core.md").includes("不是机械步骤清单"), "core rules should reject mechanical L1 task lists");
  assert(read(cwd, "ai/template/rules/core.md").includes("需要扩大范围、权限、命令、网络或验收时"), "core rules should stop continuous execution before boundary expansion");
  assert(read(cwd, "ai/project/task.md").includes("execution_policy:"), "task template should include execution policy");
  assert(read(cwd, "ai/project/task.md").includes("readiness:"), "task template should include readiness state");
  assert(read(cwd, "ai/project/task.md").includes("compact task contract"), "task template should default to compact contracts");
  assert(read(cwd, "ai/project/task.md").includes("expanded 任务"), "task template should explain when to expand task contracts");
  assert(!read(cwd, "ai/project/task.md").includes("activation_rule: \"auto_enable_when_l1_count_gte_2\""), "task template should not default to expanded activation metadata");
  assert(!read(cwd, "ai/project/task.md").includes("checkpoint_budget:"), "task template should not default to checkpoint budget fields");
  assert(!read(cwd, "ai/project/task.md").includes("model_policy:"), "task template should not default to model policy fields");
  assert(read(cwd, "ai/project/task.md").includes("status: \"pending | running | done | blocked\""), "task template should define task tree node status");
  assert(read(cwd, "ai/template/prompt.md").includes("/init"), "execution prompt should route slash bootstrap entry");
  assert(read(cwd, "ai/template/prompt.md").includes("/init-with-inbox"), "execution prompt should route bootstrap with inbox material");
  assert(read(cwd, "ai/template/prompt.md").includes("不要重新 bootstrap"), "execution prompt should reconcile inbox material when project context already exists");
  assert(read(cwd, "ai/template/prompt.md").includes("/reconcile"), "execution prompt should route slash reconcile entry");
  assert(read(cwd, "ai/template/prompt.md").includes("/continue"), "execution prompt should route slash continue entry");
  assert(read(cwd, "ai/template/prompt.md").includes("普通问答"), "execution prompt should keep ordinary questions read-only");
  assert(read(cwd, "ai/template/prompt.md").includes("草稿不能直接执行"), "execution prompt should stop after drafting a task");
  assert(read(cwd, "ai/template/prompt.md").includes("用户可见输出"), "execution prompt should reference user-visible output rules");
  assert(read(cwd, "ai/template/prompt.md").includes("strategy_update"), "execution prompt should route strategy updates");
  assert(read(cwd, "ai/template/reconcile.md").includes("上下文整合"), "init should install reconcile prompt");
  assert(read(cwd, "ai/template/reconcile.md").includes("整合计划"), "reconcile prompt should require a plan first");
  assert(read(cwd, "ai/template/reconcile.md").includes("不要递归读取") && read(cwd, "ai/template/reconcile.md").includes("`processed/**` 或 `ideas/**`"), "reconcile prompt should exclude processed and ideas recursively");
  assert(read(cwd, "ai/template/reconcile.md").includes("ai/project/inbox/processed/raw/file.md"), "reconcile prompt should archive absorbed raw inbox material");
  assert(read(cwd, "ai/template/reconcile.md").includes("未吸收资料"), "reconcile handoff should audit unabsorbed material");
  assert(read(cwd, "ai/template/reconcile.md").includes("冲突处理"), "reconcile handoff should audit conflict handling");
  assert(read(cwd, "ai/template/protocol.md").includes("引导读取范围"), "init should install bootstrap protocol");
  assert(read(cwd, "ai/template/protocol.md").includes("推荐下一步最值得做的任务"), "protocol should require recommended next steps");
  assert(read(cwd, "ai/template/protocol.md").includes("上下文整合模式"), "protocol should include context reconcile mode");
  assert(read(cwd, "ai/template/protocol.md").includes("策略修订模式"), "protocol should include strategy update mode");
  assert(read(cwd, "ai/template/rules/core.md").includes("策略修订门"), "core rules should include strategy update gate");
  assert(read(cwd, "ai/template/rules/core.md").includes("ai/project/refs/final-shape.md"), "core rules should route direction refs");
  assert(read(cwd, "ai/project/proposals/final-shape-updates/_template.md").includes("`accepted`"), "proposal template should describe accepted status");
  const initOutput = run(["init"], cwd);
  assert(initOutput.includes("Agent Execution Template 已安装。"), "init output should confirm installation");
  assert(initOutput.includes("你现在可以这样用:"), "init output should introduce scenario-based usage");
  assert(initOutput.includes("1. 第一次整理项目上下文"), "init output should cover first-time project context setup");
  assert(initOutput.includes("【发给 AI】\n\n     /init"), "init output should make the bootstrap command visually prominent");
  assert(initOutput.includes("2. 已有 README、PRD、架构文档或业务规则"), "init output should cover initialization with existing material");
  assert(initOutput.includes("/init-with-inbox"), "init output should explain bootstrap with existing material");
  assert(initOutput.includes("3. 后续有新资料要合并"), "init output should cover later material reconciliation");
  assert(initOutput.includes("/reconcile"), "init output should show the reconcile command");
  assert(initOutput.includes("4. 有还没确定的新想法、产品方向或架构调整"), "init output should cover undecided ideas");
  assert(initOutput.includes("/strategy"), "init output should show the strategy proposal command");
  assert(!initOutput.includes("开始初始化这个项目"), "init output should not show old natural bootstrap prompt");
  assert(!initOutput.includes("整合 ai/project/inbox/ 里的新资料"), "init output should not show old natural reconcile prompt");
  assert(!initOutput.includes("项目上下文尚未初始化"), "init output should not state the obvious uninitialized context");
  assert(!initOutput.includes("忘了下一步时运行"), "init output should not show next as the default fallback");
  assert(!initOutput.includes("根目录 AI 入口"), "init output should not mention root AI entrypoint implementation details");
  assert(!initOutput.includes("资料路径:"), "init output should not show abstract material path categories");
  assert(!initOutput.includes("已确定资料:"), "init output should not show abstract confirmed material path categories");
  assert(!initOutput.includes("未决定的新想法:"), "init output should not show abstract idea path categories");
  assert(!initOutput.includes("agent-execution-template next"), "init output should not tell users to remember the next command");
  assert(!initOutput.includes("文件已就绪:"), "init output should hide file change summaries by default");
  assert(initOutput.includes("检查安装:"), "init output should show install check command");
  assert(!initOutput.includes("维护者提示"), "init output should not show source checkout guidance in user projects");
  assert(!initOutput.includes("[已更新]"), "init output should hide detailed file changes by default");
  assert(!initOutput.includes("Read ai/template/bootstrap.md"), "init output should not use weak Read bootstrap command");
  assert(countOccurrences(read(cwd, "AGENTS.md"), "agent-execution-template:start") === 1, "init should not duplicate AGENTS.md managed blocks");
  assert(countOccurrences(read(cwd, "CLAUDE.md"), "agent-execution-template:start") === 1, "init should not duplicate CLAUDE.md managed blocks");
  const verboseInitOutput = run(["init", "--verbose"], cwd);
  assert(verboseInitOutput.includes("文件已就绪:"), "init --verbose should summarize file changes");
  assert(verboseInitOutput.includes("[已更新] ai/template/VERSION"), "init --verbose should show detailed file changes");
  assert(countOccurrences(read(cwd, "AGENTS.md"), "agent-execution-template:start") === 1, "re-running init should keep one AGENTS.md managed block");
  assert(countOccurrences(read(cwd, "CLAUDE.md"), "agent-execution-template:start") === 1, "re-running init should keep one CLAUDE.md managed block");
  const reconcileOutput = run(["reconcile"], cwd);
  assert(reconcileOutput.includes("Agent Execution Template 上下文整合"), "reconcile should use installed Chinese language");
  assert(reconcileOutput.includes("/reconcile"), "reconcile should print slash command");
  const strategyOutput = run(["strategy"], cwd);
  assert(strategyOutput.includes("Agent Execution Template 方向修订"), "strategy should use installed Chinese language");
  assert(strategyOutput.includes("ai/project/inbox/ideas/"), "strategy should point to ideas inbox");
  assert(strategyOutput.includes("/strategy"), "strategy should print slash strategy command");

  write(cwd, "ai/project/project.md", "USER PROJECT MARKER\n");
  run(["update"], cwd);
  assert(read(cwd, "ai/project/project.md") === "USER PROJECT MARKER\n", "update must not overwrite project.md");
  assert(read(cwd, "AGENTS.md").includes("ai/template/prompt.md"), "update should keep root agent entrypoint block installed");

  const doctorOutput = run(["doctor", "--verbose"], cwd);
  assert(doctorOutput.includes("根目录 AI 兼容入口已安装: AGENTS.md / CLAUDE.md"), "doctor should report root AI compatibility entrypoint status");
  assert(doctorOutput.includes("ai/project/result.json JSON"), "doctor should validate result JSON");
  assert(doctorOutput.includes("ai/project/result.json schema"), "doctor should validate result schema");
  assert(doctorOutput.includes("ai/project/metrics.json JSON"), "doctor should validate metrics JSON");
  assert(doctorOutput.includes("ai/project/metrics.json schema"), "doctor should validate metrics schema");
  assert(doctorOutput.includes("ai/project/task.md front matter"), "doctor should validate task front matter");
  const quietDoctorOutput = run(["doctor"], cwd);
  assert(quietDoctorOutput.includes("状态: 已就绪"), "doctor should show a concise ready state by default");
  assert(!quietDoctorOutput.includes("ai/project/result.json JSON"), "doctor should hide successful check details by default");
}

function testEnglishInitUpdateDoctor() {
  const cwd = createTempProject("agent-execution-template-en");

  const initOutput = run(["init", "--lang", "en"], cwd);
  assert(exists(cwd, "AGENTS.md"), "English init should create root AGENTS.md entrypoint");
  assert(exists(cwd, "CLAUDE.md"), "English init should create root CLAUDE.md entrypoint");
  assert(read(cwd, "AGENTS.md").includes("ai/template/prompt.md"), "English AGENTS.md should route agents to the protocol prompt");
  assert(read(cwd, "CLAUDE.md").includes("ai/template/prompt.md"), "English CLAUDE.md should route Claude to the same protocol prompt");
  assert(managedEntrypointBlock(read(cwd, "AGENTS.md")) === managedEntrypointBlock(read(cwd, "CLAUDE.md")), "English AGENTS.md and CLAUDE.md should contain the same managed compatibility block");
  assert(read(cwd, "AGENTS.md").includes("intentionally duplicated in `AGENTS.md` and `CLAUDE.md`"), "English AGENTS.md should explain intentional compatibility duplication");
  assert(read(cwd, "AGENTS.md").includes("triggered by slash commands"), "English AGENTS.md should route project workflows through slash commands");
  assert(read(cwd, "AGENTS.md").includes("ordinary questions or design discussion"), "English AGENTS.md should keep ordinary questions read-only");
  assert(!read(cwd, "AGENTS.md").includes("ai/template/bootstrap.md"), "English AGENTS.md should not duplicate bootstrap routing details");
  assert(!read(cwd, "CLAUDE.md").includes("ai/template/bootstrap.md"), "English CLAUDE.md should not duplicate bootstrap routing details");
  assert(read(cwd, "ai/template/LANG") === "en\n", "init --lang en should install English template");
  assert(exists(cwd, "ai/template/execution-policy.md"), "English init should create execution policy prompt");
  assert(exists(cwd, "ai/template/schemas/result.schema.json"), "English init should create result schema");
  assert(exists(cwd, "ai/template/schemas/metrics.schema.json"), "English init should create metrics schema");
  assert(read(cwd, "ai/template/bootstrap.md").includes("Confirmation Dimensions"), "English init should install English bootstrap prompt");
  assert(read(cwd, "ai/template/bootstrap.md").includes("Do not summarize this file"), "English bootstrap prompt should prevent summary-only behavior");
  assert(read(cwd, "ai/template/bootstrap.md").includes("ai/project/refs/final-shape.md"), "English bootstrap prompt should initialize the North Star");
  assert(read(cwd, "ai/template/bootstrap.md").includes("ai/project/refs/module-map.md"), "English bootstrap prompt should initialize module map");
  assert(read(cwd, "ai/template/bootstrap.md").includes("ai/project/refs/roadmap.md"), "English bootstrap prompt should initialize roadmap");
  assert(read(cwd, "ai/template/bootstrap.md").includes("Recommended next step"), "English bootstrap prompt should recommend next steps");
  assert(read(cwd, "ai/template/bootstrap.md").includes("Do not make the human hunt through files"), "English bootstrap prompt should not offload file inspection to humans");
  assert(read(cwd, "ai/template/bootstrap.md").includes("ai/project/inbox/processed/raw/file.md"), "English bootstrap prompt should archive absorbed raw inbox material");
  assert(read(cwd, "ai/template/bootstrap.md").includes("Absorbed material"), "English bootstrap handoff should audit absorbed material");
  assert(read(cwd, "ai/template/bootstrap.md").includes("Unabsorbed material"), "English bootstrap handoff should audit unabsorbed material");
  assert(read(cwd, "ai/template/bootstrap.md").includes("Conflict handling"), "English bootstrap handoff should audit conflict handling");
  assert(read(cwd, "ai/template/prompt.md").includes("/init"), "English execution prompt should route slash bootstrap entry");
  assert(read(cwd, "ai/template/prompt.md").includes("This file only routes the workflow"), "English execution prompt should be a lightweight router");
  assert(read(cwd, "ai/template/prompt.md").includes("ordinary questions"), "English execution prompt should keep ordinary questions read-only");
  assert(read(cwd, "ai/template/bootstrap.md").includes("Do not treat `AGENTS.md` or `CLAUDE.md` as project business evidence"), "English bootstrap should not treat root agent entrypoints as project evidence");
  assert(read(cwd, "ai/template/execution-policy.md").includes("Risk Rubric"), "English execution policy should include risk rubric");
  assert(read(cwd, "ai/template/execution-policy.md").includes("execution_policy.task_tree"), "English execution policy should require task tree persistence");
  assert(read(cwd, "ai/template/prompt.md").includes("Default to only\n  `ai/project/inbox/*.md`"), "English execution prompt should narrow inbox reconciliation");
  assert(read(cwd, "ai/template/protocol.md").includes("`bounded_continuous`"), "English protocol should include bounded continuous execution");
  assert(read(cwd, "ai/template/execution-policy.md").includes("vertical"), "English protocol should require vertical-slice progress for continuous execution");
  assert(read(cwd, "ai/template/execution-policy.md").includes("independently acceptable vertical slice"), "English execution policy should define L1 granularity");
  assert(read(cwd, "ai/template/execution-policy.md").includes("executing from a draft"), "English execution policy should block execution from draft tasks");
  assert(read(cwd, "ai/template/execution-policy.md").includes("every tiny L3 operation"), "English execution policy should limit task tree write-back churn");
  assert(read(cwd, "ai/template/execution-policy.md").includes("public interfaces, data models, permissions"), "English execution policy should constrain Yellow corrections");
  assert(read(cwd, "ai/template/execution-policy.md").includes("User-Visible Output"), "English execution policy should define user-visible output rules");
  assert(read(cwd, "ai/template/execution-policy.md").includes("user-visible plans"), "English execution policy should keep user-visible planning in the installed language");
  assert(read(cwd, "ai/template/rules/output.md").includes("installed language from `ai/template/LANG`"), "English output rules should keep human-readable results in the installed language");
  assert(read(cwd, "ai/template/execution-policy.md").includes("do not show full L2/L3/L4 by default"), "English execution policy should avoid exposing full subtask trees by default");
  assert(read(cwd, "ai/template/execution-policy.md").includes("do not show internal protocol fields"), "English execution policy should hide internal protocol details by default");
  assert(read(cwd, "ai/template/execution-policy.md").includes("Automatically use `bounded_continuous`"), "English protocol should auto-enable continuous execution from L1 count");
  assert(read(cwd, "ai/template/execution-policy.md").includes("Every checkpoint must include"), "English protocol should require evidence-backed checkpoints");
  assert(read(cwd, "ai/template/rules/core.md").includes("Bounded Continuous Execution Gate"), "English core rules should include bounded continuous execution gate");
  assert(read(cwd, "ai/template/rules/core.md").includes("readiness = ready_to_execute"), "English core rules should require ready task before execution");
  assert(read(cwd, "ai/template/rules/core.md").includes("not a mechanical step"), "English core rules should reject mechanical L1 task lists");
  assert(read(cwd, "ai/template/rules/core.md").includes("expand scope, permission, commands, network access, or acceptance"), "English core rules should stop continuous execution before boundary expansion");
  assert(read(cwd, "ai/project/task.md").includes("execution_policy:"), "English task template should include execution policy");
  assert(read(cwd, "ai/project/task.md").includes("readiness:"), "English task template should include readiness state");
  assert(read(cwd, "ai/project/task.md").includes("compact task contract"), "English task template should default to compact contracts");
  assert(read(cwd, "ai/project/task.md").includes("Expanded tasks"), "English task template should explain when to expand task contracts");
  assert(!read(cwd, "ai/project/task.md").includes("activation_rule: \"auto_enable_when_l1_count_gte_2\""), "English task template should not default to expanded activation metadata");
  assert(!read(cwd, "ai/project/task.md").includes("checkpoint_budget:"), "English task template should not default to checkpoint budget fields");
  assert(!read(cwd, "ai/project/task.md").includes("model_policy:"), "English task template should not default to model policy fields");
  assert(read(cwd, "ai/project/task.md").includes("status: \"pending | running | done | blocked\""), "English task template should define task tree node status");
  assert(read(cwd, "ai/template/prompt.md").includes("/init-with-inbox"), "English execution prompt should route bootstrap with inbox material");
  assert(read(cwd, "ai/template/prompt.md").includes("instead of bootstrapping again"), "English execution prompt should reconcile inbox material when project context already exists");
  assert(read(cwd, "ai/template/prompt.md").includes("/reconcile"), "English execution prompt should route slash reconcile entry");
  assert(read(cwd, "ai/template/prompt.md").includes("/continue"), "English execution prompt should route slash continue entry");
  assert(read(cwd, "ai/template/prompt.md").includes("do not execute while the\n   task is still a draft"), "English execution prompt should stop after drafting a task");
  assert(read(cwd, "ai/template/prompt.md").includes("User-Visible Output"), "English execution prompt should reference user-visible output rules");
  assert(read(cwd, "ai/template/prompt.md").includes("strategy_update"), "English execution prompt should route strategy updates");
  assert(exists(cwd, "ai/project/refs/final-shape.md"), "English init should create project North Star");
  assert(exists(cwd, "ai/project/refs/module-map.md"), "English init should create module map");
  assert(exists(cwd, "ai/project/refs/roadmap.md"), "English init should create roadmap");
  assert(exists(cwd, "ai/project/proposals/final-shape-updates/_template.md"), "English init should create strategy proposal template");
  assert(read(cwd, "ai/template/rules/core.md").includes("Strategy Update Gate"), "English core rules should include strategy update gate");
  assert(read(cwd, "ai/project/proposals/final-shape-updates/_template.md").includes("`accepted`"), "English proposal template should describe accepted status");
  assert(read(cwd, "ai/template/reconcile.md").includes("Context Reconcile"), "English init should install English reconcile prompt");
  assert(read(cwd, "ai/template/reconcile.md").includes("reconciliation plan"), "English reconcile prompt should require a plan first");
  assert(read(cwd, "ai/template/reconcile.md").includes("do not recursively\nread `processed/**` or `ideas/**`"), "English reconcile prompt should exclude processed and ideas recursively");
  assert(read(cwd, "ai/template/reconcile.md").includes("ai/project/inbox/processed/raw/file.md"), "English reconcile prompt should archive absorbed raw inbox material");
  assert(read(cwd, "ai/template/reconcile.md").includes("Unabsorbed material"), "English reconcile handoff should audit unabsorbed material");
  assert(read(cwd, "ai/template/reconcile.md").includes("Conflict handling"), "English reconcile handoff should audit conflict handling");
  assert(initOutput.includes("Agent Execution Template installed."), "English init output should confirm installation");
  assert(initOutput.includes("You can use it like this:"), "English init output should introduce scenario-based usage");
  assert(initOutput.includes("1. Set up project context for the first time"), "English init output should cover first-time project context setup");
  assert(initOutput.includes("[Send to AI]\n\n     /init"), "English init output should make the bootstrap command visually prominent");
  assert(initOutput.includes("2. You already have a README, PRD, architecture doc, or business rules"), "English init output should cover initialization with existing material");
  assert(initOutput.includes("/init-with-inbox"), "English init output should explain bootstrap with existing material");
  assert(initOutput.includes("3. Later, you have new material to merge"), "English init output should cover later material reconciliation");
  assert(initOutput.includes("/reconcile"), "English init output should show the reconcile command");
  assert(initOutput.includes("4. You have an undecided idea, product direction, or architecture change"), "English init output should cover undecided ideas");
  assert(initOutput.includes("/strategy"), "English init output should show the strategy proposal command");
  assert(!initOutput.includes("Start initializing this project"), "English init output should not show old natural bootstrap prompt");
  assert(!initOutput.includes("Reconcile the new material in ai/project/inbox/"), "English init output should not show old natural reconcile prompt");
  assert(!initOutput.includes("Project context is not initialized yet"), "English init output should not state the obvious uninitialized context");
  assert(!initOutput.includes("If you forget the next step"), "English init output should not show next as the default fallback");
  assert(!initOutput.includes("Root AI entrypoints"), "English init output should not mention root AI entrypoint implementation details");
  assert(!initOutput.includes("Material paths:"), "English init output should not show abstract material path categories");
  assert(!initOutput.includes("Confirmed material:"), "English init output should not show abstract confirmed material path categories");
  assert(!initOutput.includes("Undecided ideas:"), "English init output should not show abstract idea path categories");
  assert(!initOutput.includes("agent-execution-template next"), "English init output should not tell users to remember the next command");
  assert(!initOutput.includes("Files ready:"), "English init output should hide file change summaries by default");
  assert(initOutput.includes("Check install:"), "English init output should show install check command");
  assert(!initOutput.includes("Maintainer note"), "English init output should not show source checkout guidance in user projects");
  assert(!initOutput.includes("[UPDATED]"), "English init output should hide detailed file changes by default");
  assert(run(["init", "--lang=en", "--verbose"], cwd).includes("[UPDATED] ai/template/VERSION"), "English init --verbose should show detailed file changes");

  write(cwd, "ai/project/project.md", "USER PROJECT MARKER\n");
  const updateOutput = run(["update"], cwd);
  assert(updateOutput.includes("Agent Execution Template update"), "update should use installed English language");
  assert(read(cwd, "ai/project/project.md") === "USER PROJECT MARKER\n", "English update must not overwrite project.md");

  const doctorOutput = run(["doctor", "--verbose"], cwd);
  assert(doctorOutput.includes("Template language: en"), "doctor should show installed English language");
  assert(doctorOutput.includes("root AI compatibility entrypoints installed: AGENTS.md / CLAUDE.md"), "English doctor should report root AI compatibility entrypoint status");
  assert(doctorOutput.includes("ai/project/result.json JSON"), "English doctor should validate result JSON");
  assert(doctorOutput.includes("ai/project/result.json schema"), "English doctor should validate result schema");
  assert(doctorOutput.includes("ai/project/task.md front matter"), "English doctor should validate task front matter");
  assert(doctorOutput.includes("Status: Ready to run"), "doctor should use installed English language");
  const quietDoctorOutput = run(["doctor"], cwd);
  assert(quietDoctorOutput.includes("Status: Ready to run"), "English doctor should show a concise ready state by default");
  assert(!quietDoctorOutput.includes("ai/project/result.json JSON"), "English doctor should hide successful check details by default");
  const reconcileOutput = run(["reconcile"], cwd);
  assert(reconcileOutput.includes("Agent Execution Template Context Reconcile"), "reconcile should use installed English language");
  assert(reconcileOutput.includes("/reconcile"), "reconcile should print slash command");
  const strategyOutput = run(["strategy"], cwd);
  assert(strategyOutput.includes("Agent Execution Template Strategy Update"), "strategy should use installed English language");
  assert(strategyOutput.includes("ai/project/inbox/ideas/"), "strategy should point to ideas inbox");
  assert(strategyOutput.includes("/strategy"), "strategy should print slash strategy command");
  assert(run(["reconcile", "--lang", "zh"], cwd).includes("/reconcile"), "reconcile --lang zh should override installed language");
  assert(run(["strategy", "--lang", "zh"], cwd).includes("/strategy"), "strategy --lang zh should override installed language");
}

function testDoctorFailureAndWarning() {
  const missingCwd = createTempProject("agent-execution-template-missing");
  run(["init"], missingCwd);
  fs.unlinkSync(path.join(missingCwd, "ai/project/runtime.md"));
  run(["doctor"], missingCwd, 1);

  const warnCwd = createTempProject("agent-execution-template-warn");
  run(["init"], warnCwd);
  write(warnCwd, "ai/project/runtime.md", "");
  run(["doctor"], warnCwd);

  const invalidJsonCwd = createTempProject("agent-execution-template-invalid-json");
  run(["init"], invalidJsonCwd);
  write(invalidJsonCwd, "ai/project/result.json", "{invalid\n");
  const invalidJsonOutput = run(["doctor"], invalidJsonCwd, 1);
  assert(invalidJsonOutput.includes("JSON 无效"), "doctor should fail invalid result JSON");

  const invalidResultSchemaCwd = createTempProject("agent-execution-template-invalid-result-schema");
  run(["init"], invalidResultSchemaCwd);
  write(invalidResultSchemaCwd, "ai/project/result.json", JSON.stringify({
    protocol_version: "0.8",
    status: "success",
    scope_followed: true,
    files_read: [],
    refs_read: [],
    files_changed: [],
    commands_run: [],
    verification: {
      level: "none",
      passed: false,
      evidence: []
    },
    assumptions: [],
    issues: [],
    next: [],
    runtime_update: {
      required: false,
      changes: [],
      reason: ""
    }
  }, null, 2));
  const invalidResultSchemaOutput = run(["doctor"], invalidResultSchemaCwd, 1);
  assert(invalidResultSchemaOutput.includes("不符合协议 schema"), "doctor should fail result schema violations");
  assert(invalidResultSchemaOutput.includes("$.verification.passed must be true"), "doctor should enforce success verification");

  const invalidMetricsSchemaCwd = createTempProject("agent-execution-template-invalid-metrics-schema");
  run(["init"], invalidMetricsSchemaCwd);
  write(invalidMetricsSchemaCwd, "ai/project/metrics.json", JSON.stringify({
    protocol_version: "0.8",
    task_id: "",
    task_type: "",
    model: "",
    model_tier: "cheap",
    escalated: true,
    escalation_reason: "",
    model_policy_followed: true,
    escalation_trigger_hit: "",
    strong_model_role: "",
    input_tokens_estimated: 0,
    output_tokens_estimated: 0,
    duration_minutes: 0,
    success: false,
    human_fix_required: false,
    failure_reason: "",
    reuse_potential: "low",
    notes: []
  }, null, 2));
  const invalidMetricsSchemaOutput = run(["doctor"], invalidMetricsSchemaCwd, 1);
  assert(invalidMetricsSchemaOutput.includes("不符合协议 schema"), "doctor should fail metrics schema violations");
  assert(invalidMetricsSchemaOutput.includes("$.escalation_reason must have length >= 1"), "doctor should enforce escalated metrics details");

  const taskWarnCwd = createTempProject("agent-execution-template-task-frontmatter");
  run(["init"], taskWarnCwd);
  write(taskWarnCwd, "ai/project/task.md", "# Task only\n");
  const taskWarnOutput = run(["doctor"], taskWarnCwd);
  assert(taskWarnOutput.includes("任务 front matter 缺少关键字段"), "doctor should warn incomplete task front matter");

  const taskPolicyWarnCwd = createTempProject("agent-execution-template-task-policy");
  run(["init"], taskPolicyWarnCwd);
  write(taskPolicyWarnCwd, "ai/project/task.md", `---
task_id: ""
type: "feature"
priority: "P2"
risk_level: "low"
readiness: "ready_to_execute"
execution_policy:
  mode: "auto"
model_policy: {}
refs: {}
permission: {}
---
# Task
`);
  const taskPolicyWarnOutput = run(["doctor"], taskPolicyWarnCwd);
  assert(taskPolicyWarnOutput.includes("任务 front matter 缺少关键字段"), "doctor should warn when execution policy fields are incomplete");
}

function testRootEntrypointPreservesUserContent() {
  const cwd = createTempProject("agent-execution-template-entrypoints");
  write(cwd, "AGENTS.md", "# Existing agent rules\n\nKeep this user rule.\n");

  run(["init"], cwd);
  assert(read(cwd, "AGENTS.md").includes("Keep this user rule."), "init should preserve existing AGENTS.md content");
  assert(read(cwd, "AGENTS.md").includes("agent-execution-template:start"), "init should append a managed AGENTS.md block");
  assert(countOccurrences(read(cwd, "AGENTS.md"), "agent-execution-template:start") === 1, "init should append one AGENTS.md block");

  run(["init"], cwd);
  assert(read(cwd, "AGENTS.md").includes("Keep this user rule."), "re-running init should preserve existing AGENTS.md content");
  assert(countOccurrences(read(cwd, "AGENTS.md"), "agent-execution-template:start") === 1, "re-running init should replace, not duplicate, the managed AGENTS.md block");

  run(["update"], cwd);
  assert(read(cwd, "AGENTS.md").includes("Keep this user rule."), "update should preserve existing AGENTS.md content");
  assert(countOccurrences(read(cwd, "AGENTS.md"), "agent-execution-template:start") === 1, "update should keep one managed AGENTS.md block");

  fs.unlinkSync(path.join(cwd, "CLAUDE.md"));
  const missingClaudeOutput = run(["doctor"], cwd);
  assert(missingClaudeOutput.includes("缺少根目录 AI 兼容入口托管块"), "doctor should warn when one root agent entrypoint is missing");

  fs.unlinkSync(path.join(cwd, "AGENTS.md"));
  const doctorOutput = run(["doctor"], cwd);
  assert(doctorOutput.includes("缺少根目录 AI 兼容入口托管块"), "doctor should warn when root agent entrypoints are missing");
}

function testRefreshBacksUpAndImportsOldProject() {
  const cwd = createTempProject("agent-execution-template-refresh");
  run(["init"], cwd);
  write(cwd, "ai/project/project.md", "OLD PROJECT CONTEXT\n");

  const output = run(["refresh"], cwd);
  const backups = fs.readdirSync(path.join(cwd, "ai"))
    .filter((entry) => entry.startsWith("project.backup."));

  assert(backups.length === 1, "refresh should back up the old project directory");
  assert(read(cwd, "ai/project/project.md") !== "OLD PROJECT CONTEXT\n", "refresh should create a fresh project directory");
  assert(
    read(cwd, "ai/project/inbox/raw/old-project/project.md") === "OLD PROJECT CONTEXT\n",
    "refresh should import old project context into the new inbox"
  );
  assert(output.includes("Agent Execution Template 项目上下文重整"), "refresh should print a refresh summary");
  assert(output.includes("/reconcile"), "refresh should print the next slash command");

  const improveOutput = run(["improve-context"], cwd);
  assert(improveOutput.includes("Agent Execution Template 上下文总结优化"), "improve-context should use user-facing context improvement language");
  assert(improveOutput.includes("/reconcile"), "improve-context should reuse refresh behavior");
}

function testNextCommandRoutesByProjectState() {
  const missingCwd = createTempProject("agent-execution-template-next-missing");
  const missingOutput = run(["next"], missingCwd);
  assert(missingOutput.includes("agent-execution-template init"), "next should tell uninitialized projects to install first");

  const cwd = createTempProject("agent-execution-template-next");
  run(["init"], cwd);
  assert(run(["next"], cwd).includes("/init"), "next should bootstrap a freshly installed project");

  write(cwd, "ai/project/project.md", "USER PROJECT MARKER\n");
  assert(run(["next"], cwd).includes("/continue"), "next should continue when no intake is waiting");

  write(cwd, "ai/project/inbox/product.md", "# Product material\n");
  assert(run(["next"], cwd).includes("/reconcile"), "next should route material inbox to reconcile");
  fs.unlinkSync(path.join(cwd, "ai/project/inbox/product.md"));

  write(cwd, "ai/project/inbox/processed/product.md", "# Processed material\n");
  assert(run(["next"], cwd).includes("/continue"), "next should ignore processed inbox material");
  fs.unlinkSync(path.join(cwd, "ai/project/inbox/processed/product.md"));

  write(cwd, "ai/project/inbox/ideas/new-direction.md", "# Direction idea\n");
  assert(run(["next"], cwd).includes("/strategy"), "next should route ideas inbox to strategy update");
  fs.unlinkSync(path.join(cwd, "ai/project/inbox/ideas/new-direction.md"));

  write(cwd, "ai/project/proposals/final-shape-updates/proposal.md", "---\nstatus: \"applied\"\n---\n");
  assert(run(["next"], cwd).includes("/continue"), "next should ignore already applied proposals");

  write(cwd, "ai/project/proposals/final-shape-updates/proposal.md", "---\nstatus: \"proposed\"\n---\n");
  assert(run(["next"], cwd).includes("/apply-strategy"), "next should route existing proposals to human review");

  fs.unlinkSync(path.join(cwd, "ai/project/proposals/final-shape-updates/proposal.md"));
  write(cwd, "ai/project/task.md", `---
task_id: "done"
type: "feature"
priority: "P2"
risk_level: "low"
readiness: "ready_to_execute"
execution_policy:
  mode: "normal"
  task_tree:
    - id: "L1-1"
      title: "Done"
      risk: "Green"
      status: "done"
refs:
  required: []
permission:
  modify:
    allowed: []
    denied: []
  commands:
    allowed: []
    denied: []
---
# Task
`);
  write(cwd, "ai/project/result.json", JSON.stringify({
    protocol_version: "0.8",
    status: "success",
    task_id: "done",
    task_summary: "Done",
    scope_followed: true,
    files_read: [],
    refs_read: [],
    files_changed: [],
    commands_run: [],
    verification: {
      level: "none",
      passed: true,
      evidence: []
    },
    evidence: {
      git_diff_summary: "",
      changed_files_from_git: [],
      command_outputs: [],
      unverified_claims: []
    },
    assumptions: [],
    issues: [],
    next: [],
    runtime_update: {
      required: false,
      changes: [],
      reason: ""
    }
  }, null, 2));
  const cleanOutput = run(["next"], cwd);
  assert(cleanOutput.includes("暂无必须动作"), "next should avoid telling users to continue after a successful clean state");
  assert(!cleanOutput.includes("原因:"), "next should hide decision details by default");
  const verboseOutput = run(["next", "--verbose"], cwd);
  assert(verboseOutput.includes("原因:"), "next --verbose should show the decision reason");
}

function testPermissionErrorIsActionable() {
  const cwd = createTempProject("agent-execution-template-permission");
  const inbox = path.join(cwd, "ai/project/inbox");
  fs.mkdirSync(inbox, { recursive: true });
  fs.chmodSync(inbox, 0o555);
  try {
    const output = run(["init"], cwd, 1);
    assert(output.includes("无法写入目标路径"), "permission failures should explain the blocked target");
    assert(output.includes("sudo chown -R"), "permission failures should include an ownership repair command");
    assert(!output.includes("node:fs"), "permission failures should not expose the raw Node stack");
  } finally {
    fs.chmodSync(inbox, 0o755);
  }
}

function testSourceCheckoutNotice() {
  const quietDoctorOutput = run(["doctor"], repoRoot);
  assert(!quietDoctorOutput.includes("维护者提示"), "doctor should hide source checkout notice by default");

  const doctorOutput = run(["doctor", "--verbose"], repoRoot);
  assert(doctorOutput.includes("维护者提示"), "doctor should warn when run in the package source checkout");
  assert(doctorOutput.includes("node bin/agent-execution-template.js <command>"), "source checkout notice should show local node command");
  assert(doctorOutput.includes("不要把维护者本地初始化产生的 ai/project/** 当成产品改动提交"), "source checkout notice should warn against committing local bootstrap context");

  const quietNextOutput = run(["next"], repoRoot);
  assert(!quietNextOutput.includes("维护者提示"), "next should hide source checkout notice by default");

  const nextOutput = run(["next", "--verbose"], repoRoot);
  assert(nextOutput.includes("维护者提示"), "next should warn when run in the package source checkout");
}

function main() {
  testInitUpdateDoctor();
  testEnglishInitUpdateDoctor();
  testDoctorFailureAndWarning();
  testRootEntrypointPreservesUserContent();
  testRefreshBacksUpAndImportsOldProject();
  testNextCommandRoutesByProjectState();
  testPermissionErrorIsActionable();
  testSourceCheckoutNotice();
  console.log("selftest ok");
}

main();
