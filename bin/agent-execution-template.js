#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const PACKAGE_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_ROOT = path.join(PACKAGE_ROOT, "template");
const TARGET_AI = path.join(process.cwd(), "ai");
const DEFAULT_LANG = "zh";
const SUPPORTED_LANGS = new Set(["zh", "en"]);
const ROOT_ENTRYPOINT_FILES = ["AGENTS.md", "CLAUDE.md"];
const ENTRYPOINT_BLOCK_START = "<!-- agent-execution-template:start -->";
const ENTRYPOINT_BLOCK_END = "<!-- agent-execution-template:end -->";

const REQUIRED_FILES = [
  "ai/template/LANG",
  "ai/template/VERSION",
  "ai/template/bootstrap.md",
  "ai/template/execution-policy.md",
  "ai/template/prompt.md",
  "ai/template/reconcile.md",
  "ai/template/protocol.md",
  "ai/template/rules/core.md",
  "ai/template/rules/output.md",
  "ai/template/schemas/result.schema.json",
  "ai/template/schemas/metrics.schema.json",
  "ai/project/inbox/.gitkeep",
  "ai/project/project.md",
  "ai/project/runtime.md",
  "ai/project/task.md",
  "ai/project/result.json",
  "ai/project/result.md",
  "ai/project/metrics.json"
];

const RECOMMENDED_FILES = [
  "ai/project/inbox/ideas/.gitkeep",
  "ai/project/inbox/processed/.gitkeep",
  "ai/project/inbox/raw/.gitkeep",
  "ai/project/proposals/final-shape-updates/.gitkeep",
  "ai/project/proposals/final-shape-updates/_template.md",
  "ai/project/refs/final-shape.md",
  "ai/project/refs/module-map.md",
  "ai/project/refs/roadmap.md"
];

const TASK_HEALTH_PATTERNS = [
  /^task_id:\s*/m,
  /^type:\s*/m,
  /^priority:\s*/m,
  /^risk_level:\s*/m,
  /^readiness:\s*/m,
  /^execution_policy:/m,
  /^\s+mode:\s*/m,
  /^\s+task_tree:/m,
  /^refs:/m,
  /^permission:/m
];

const TEXT = {
  zh: {
    usage: `Agent Execution Template

用法:
  agent-execution-template init [--lang zh|en] [--verbose]
  agent-execution-template next [--lang zh|en] [--verbose]
  agent-execution-template refresh [--lang zh|en]
  agent-execution-template improve-context [--lang zh|en]
  agent-execution-template update [--lang zh|en]
  agent-execution-template reconcile [--lang zh|en]
  agent-execution-template strategy [--lang zh|en]
  agent-execution-template doctor [--verbose]
`,
    unknown: "未知",
    sourceMissing: "找不到模板来源",
    ready: "Agent Execution Template 已安装。",
    initGuide: `你现在可以这样用:

1. 第一次整理项目上下文
   【发给 AI】

     /init

2. 已有 README、PRD、架构文档或业务规则
   先放到 ai/project/inbox/
   【发给 AI】

     /init-with-inbox

3. 后续有新资料要合并
   放到 ai/project/inbox/
   【发给 AI】

     /reconcile

4. 有还没确定的新想法、产品方向或架构调整
   放到 ai/project/inbox/ideas/
   【发给 AI】

     /strategy`,
    start: "开始:",
    startPrompt: "/init",
    initWithInboxPrompt: "/init-with-inbox",
    then: "然后:",
    reviewProject: "按 AI 输出确认或修正项目上下文",
    giveTask: "需要执行任务时，发给 AI:",
    confirmTask: "需要吸收新资料时，先放入 ai/project/inbox/，然后发给 AI:",
    executePrompt: "/reconcile",
    strategyHint: "需要修订方向时，先放入 ai/project/inbox/ideas/，然后发给 AI: /strategy",
    files: "文件已就绪",
    check: "检查安装",
    details: "详情:",
    refreshTitle: "Agent Execution Template 项目上下文重整",
    improveContextTitle: "Agent Execution Template 上下文总结优化",
    refreshBackedUp: "已备份旧项目上下文",
    refreshImported: "已将旧项目上下文放入",
    refreshReady: "新的 ai/project/** 已生成。",
    refreshPrompt: "/reconcile",
    refreshNoProject: "未发现旧 ai/project/**，已执行普通初始化。",
    updateTitle: "Agent Execution Template 更新",
    updated: "已将 ai/template/** 更新到",
    projectNotModified: "ai/project/** 未修改。",
    doctorTitle: "Agent Execution Template 检查",
    templateVersion: "模板版本",
    templateLang: "模板语言",
    missing: "缺失",
    warn: "警告",
    pass: "通过",
    fail: "失败",
    empty: "为空",
    invalidJson: "JSON 无效",
    invalidSchema: "不符合协议 schema",
    taskFrontMatterIncomplete: "任务 front matter 缺少关键字段",
    entrypointReady: "根目录 AI 兼容入口已安装: AGENTS.md / CLAUDE.md",
    entrypointMissing: "缺少根目录 AI 兼容入口托管块；AI 可能不会自动读取 ai/template/prompt.md",
    versionMismatch: "模板版本与包版本不一致",
    runInit: "请运行 npx -y @wnlen/agent-execution-template init",
    readyWithWarnings: "已就绪，但存在警告",
    readyToRun: "已就绪",
    needsRepair: "需要修复",
    status: "状态",
    nextAction: "下一步",
    diagnosticDetails: "详情",
    invalidLang: "不支持的语言，请使用 zh 或 en",
    reconcileTitle: "Agent Execution Template 上下文整合",
    reconcilePut: "把新的业务、产品、架构或流程资料放到:",
    reconcileAsk: "然后发给 AI:",
    reconcilePrompt: "/reconcile",
    strategyTitle: "Agent Execution Template 方向修订",
    strategyPut: "把新的产品、业务、架构或方向灵感放到:",
    strategyAsk: "然后发给 AI:",
    strategyPrompt: "/strategy",
    strategyReview: "人类确认提案后，再发给 AI:",
    strategyApplyPrompt: "/apply-strategy",
    nextTitle: "Agent Execution Template 下一步",
    nextRunInit: "当前项目还没有安装模板。先运行:",
    nextTellAgent: "把这个命令发给你的 AI:",
    nextRunCommand: "运行这个命令:",
    nextReviewProposal: "已有方向修订提案。先审查提案；确认后发给 AI:",
    nextContinuePrompt: "/continue",
    nextNoAction: "暂无必须动作。可以提出下一个具体目标。",
    nextReason: "原因",
    nextReasons: {
      missingInstall: "当前项目还没有安装协议。",
      proposalAccepted: "存在已接受但尚未应用的方向修订提案。",
      proposalProposed: "存在待审查的方向修订提案。",
      ideas: "ai/project/inbox/ideas/ 中有待评估想法。",
      inbox: "ai/project/inbox/ 中有待吸收资料。",
      freshProject: "项目上下文仍是初始模板。",
      draftTask: "当前任务仍是草稿，需要先确认任务契约。",
      readyTask: "当前任务已 ready，可以继续执行。",
      failedResult: "上次执行未成功，需要继续处理。",
      clean: "没有待处理 inbox、proposal 或失败结果。"
    },
    repairHint: "缺失的 project 推荐文件可通过重新运行 init 安全补齐；已有 ai/project/** 不会被覆盖。",
    sourceCheckoutNotice: `维护者提示: 当前目录看起来是 @wnlen/agent-execution-template 源码仓库。
  源码仓库内调试请使用: node bin/agent-execution-template.js <command>
  用户项目中安装才使用: npx -y @wnlen/agent-execution-template <command>
  不要把维护者本地初始化产生的 ai/project/** 当成产品改动提交。`,
    permissionDenied: "无法写入目标路径",
    permissionHint: `请检查 ai/** 的归属和权限。常见修复:
  sudo chown -R "$(id -un):$(id -gn)" ai
  find ai -type d -exec chmod u+rwx {} +
  find ai -type f -exec chmod u+rw {} +`,
    changeLabels: {
      created: "已创建",
      updated: "已更新",
      kept: "已保留"
    },
    changeUnit: (label, count) => `${label} ${count} 个`
  },
  en: {
    usage: `Agent Execution Template

Usage:
  agent-execution-template init [--lang zh|en] [--verbose]
  agent-execution-template next [--lang zh|en] [--verbose]
  agent-execution-template refresh [--lang zh|en]
  agent-execution-template improve-context [--lang zh|en]
  agent-execution-template update [--lang zh|en]
  agent-execution-template reconcile [--lang zh|en]
  agent-execution-template strategy [--lang zh|en]
  agent-execution-template doctor [--verbose]
`,
    unknown: "unknown",
    sourceMissing: "Template source not found",
    ready: "Agent Execution Template installed.",
    initGuide: `You can use it like this:

1. Set up project context for the first time
   [Send to AI]

     /init

2. You already have a README, PRD, architecture doc, or business rules
   Put them in ai/project/inbox/
   [Send to AI]

     /init-with-inbox

3. Later, you have new material to merge
   Put it in ai/project/inbox/
   [Send to AI]

     /reconcile

4. You have an undecided idea, product direction, or architecture change
   Put it in ai/project/inbox/ideas/
   [Send to AI]

     /strategy`,
    start: "Start:",
    startPrompt: "/init",
    initWithInboxPrompt: "/init-with-inbox",
    then: "Then:",
    reviewProject: "Confirm or correct the project context from the agent output",
    giveTask: "When you want to execute work, send to AI:",
    confirmTask: "When you need to absorb new material, put it in ai/project/inbox/, then send to AI:",
    executePrompt: "/reconcile",
    strategyHint: "When direction changes, put ideas in ai/project/inbox/ideas/, then send to AI: /strategy.",
    files: "Files ready",
    check: "Check install",
    details: "Details:",
    refreshTitle: "Agent Execution Template project context refresh",
    improveContextTitle: "Agent Execution Template project context improvement",
    refreshBackedUp: "Backed up old project context",
    refreshImported: "Imported old project context into",
    refreshReady: "Generated a fresh ai/project/**.",
    refreshPrompt: "/reconcile",
    refreshNoProject: "No old ai/project/** found; ran normal init.",
    updateTitle: "Agent Execution Template update",
    updated: "Updated ai/template/** to",
    projectNotModified: "ai/project/** was not modified.",
    doctorTitle: "Agent Execution Template Doctor",
    templateVersion: "Template version",
    templateLang: "Template language",
    missing: "MISSING",
    warn: "WARN",
    pass: "OK",
    fail: "FAIL",
    empty: "is empty",
    invalidJson: "contains invalid JSON",
    invalidSchema: "does not match protocol schema",
    taskFrontMatterIncomplete: "task front matter is missing required fields",
    entrypointReady: "root AI compatibility entrypoints installed: AGENTS.md / CLAUDE.md",
    entrypointMissing: "missing root AI compatibility entrypoint managed block; the AI may not auto-read ai/template/prompt.md",
    versionMismatch: "template version does not match package version",
    runInit: "Run npx -y @wnlen/agent-execution-template init",
    readyWithWarnings: "Ready to run with warnings",
    readyToRun: "Ready to run",
    needsRepair: "Needs repair",
    status: "Status",
    nextAction: "Next",
    diagnosticDetails: "Details",
    invalidLang: "Unsupported language. Use zh or en",
    reconcileTitle: "Agent Execution Template Context Reconcile",
    reconcilePut: "Put new business, product, architecture, or process material in:",
    reconcileAsk: "Then send to AI:",
    reconcilePrompt: "/reconcile",
    strategyTitle: "Agent Execution Template Strategy Update",
    strategyPut: "Put new product, business, architecture, or direction ideas in:",
    strategyAsk: "Then send to AI:",
    strategyPrompt: "/strategy",
    strategyReview: "After human confirmation, send to AI:",
    strategyApplyPrompt: "/apply-strategy",
    nextTitle: "Agent Execution Template next step",
    nextRunInit: "This project has not installed the template yet. Run:",
    nextTellAgent: "Send this command to your AI:",
    nextRunCommand: "Run this command:",
    nextReviewProposal: "A direction amendment proposal exists. Review it first; after confirmation, send to AI:",
    nextContinuePrompt: "/continue",
    nextNoAction: "No required action. Give the agent the next concrete goal.",
    nextReason: "Reason",
    nextReasons: {
      missingInstall: "This project has not installed the protocol.",
      proposalAccepted: "An accepted direction amendment proposal has not been applied.",
      proposalProposed: "A direction amendment proposal is waiting for review.",
      ideas: "ai/project/inbox/ideas/ contains ideas to evaluate.",
      inbox: "ai/project/inbox/ contains material to absorb.",
      freshProject: "Project context is still the initial template.",
      draftTask: "The current task is still a draft and needs contract confirmation.",
      readyTask: "The current task is ready to execute.",
      failedResult: "The last execution did not succeed and needs follow-up.",
      clean: "No pending inbox, proposal, or failed result was found."
    },
    repairHint: "Missing recommended project files can be safely added by running init again; existing ai/project/** files are not overwritten.",
    sourceCheckoutNotice: `Maintainer note: this directory looks like the @wnlen/agent-execution-template source checkout.
  In the source repository, test with: node bin/agent-execution-template.js <command>
  In user projects, install with: npx -y @wnlen/agent-execution-template <command>
  Do not commit maintainer-local ai/project/** bootstrap content as product changes.`,
    permissionDenied: "Cannot write target path",
    permissionHint: `Check ownership and permissions under ai/**. Common fix:
  sudo chown -R "$(id -un):$(id -gn)" ai
  find ai -type d -exec chmod u+rwx {} +
  find ai -type f -exec chmod u+rw {} +`,
    changeLabels: {
      created: "CREATED",
      updated: "UPDATED",
      kept: "KEPT"
    },
    changeUnit: (label, count) => `${count} ${label.toLowerCase()}`
  }
};

function readVersion(root) {
  const versionFile = path.join(root, "VERSION");
  if (!fs.existsSync(versionFile)) return null;
  return fs.readFileSync(versionFile, "utf8").trim() || null;
}

function readPackageVersion() {
  const packageFile = path.join(PACKAGE_ROOT, "package.json");
  if (!fs.existsSync(packageFile)) return null;
  try {
    const pkg = JSON.parse(fs.readFileSync(packageFile, "utf8"));
    return pkg.version || null;
  } catch {
    return null;
  }
}

function readTargetPackageName() {
  const packageFile = path.join(process.cwd(), "package.json");
  if (!fs.existsSync(packageFile)) return null;
  try {
    const pkg = JSON.parse(fs.readFileSync(packageFile, "utf8"));
    return pkg.name || null;
  } catch {
    return null;
  }
}

function readInstalledLang() {
  const langFile = path.join(TARGET_AI, "template", "LANG");
  if (!fs.existsSync(langFile)) return DEFAULT_LANG;
  const lang = fs.readFileSync(langFile, "utf8").trim();
  return SUPPORTED_LANGS.has(lang) ? lang : DEFAULT_LANG;
}

function isSourceCheckout() {
  return process.cwd() === PACKAGE_ROOT &&
    readTargetPackageName() === "@wnlen/agent-execution-template";
}

function commandHint(command) {
  if (isSourceCheckout()) {
    return `node bin/agent-execution-template.js ${command}`;
  }
  return `npx -y @wnlen/agent-execution-template ${command}`;
}

function printSourceCheckoutNotice(lang) {
  if (isSourceCheckout()) {
    console.log(`${getText(lang).sourceCheckoutNotice}\n`);
  }
}

function parseLang(args, fallback = DEFAULT_LANG) {
  let lang = fallback;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--lang" || arg === "-l") {
      lang = args[index + 1] || "";
      index += 1;
    } else if (arg.startsWith("--lang=")) {
      lang = arg.slice("--lang=".length);
    }
  }
  return lang;
}

function getText(lang) {
  return TEXT[SUPPORTED_LANGS.has(lang) ? lang : DEFAULT_LANG];
}

function getSourceAi(lang) {
  return path.join(TEMPLATE_ROOT, lang, "ai");
}

function usage(lang = DEFAULT_LANG) {
  console.log(getText(lang).usage);
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

function rootEntrypointBlock(lang) {
  if (lang === "en") {
    return `${ENTRYPOINT_BLOCK_START}
## Agent Execution Template

This repository has Agent Execution Template installed in \`ai/\`.
This managed block is intentionally duplicated in \`AGENTS.md\` and \`CLAUDE.md\` for different AI tool discovery conventions.

Mandatory routing:
- Before acting on any project execution request, first read and follow \`ai/template/prompt.md\`.
- Project workflows are triggered by slash commands such as \`/init\`, \`/reconcile\`, \`/strategy\`, and \`/continue\`.
- For ordinary questions or design discussion, answer read-only and do not enter the execution workflow unless a slash command is present.
${ENTRYPOINT_BLOCK_END}`;
  }

  return `${ENTRYPOINT_BLOCK_START}
## Agent Execution Template

本仓库已安装 Agent Execution Template，协议位于 \`ai/\`。
此托管块会有意同时写入 \`AGENTS.md\` 和 \`CLAUDE.md\`，用于适配不同 AI 工具的自动发现约定。

强制路由：
- 处理任何项目执行请求前，必须先读取并遵守 \`ai/template/prompt.md\`。
- 项目工作流由 \`/init\`、\`/reconcile\`、\`/strategy\`、\`/continue\` 等 slash command 触发。
- 普通问答或设计讨论只做只读回答；除非用户给出 slash command，否则不要进入执行工作流。
${ENTRYPOINT_BLOCK_END}`;
}

function hasManagedEntrypointBlock(content) {
  return content.includes(ENTRYPOINT_BLOCK_START) && content.includes(ENTRYPOINT_BLOCK_END);
}

function upsertManagedBlock(content, block) {
  if (!hasManagedEntrypointBlock(content)) {
    const separator = content.trim().length > 0 ? "\n\n" : "";
    return `${content.replace(/\s*$/, "")}${separator}${block}\n`;
  }

  const start = content.indexOf(ENTRYPOINT_BLOCK_START);
  const end = content.indexOf(ENTRYPOINT_BLOCK_END, start) + ENTRYPOINT_BLOCK_END.length;
  return `${content.slice(0, start)}${block}${content.slice(end)}`;
}

function ensureRootEntrypoints(lang) {
  const block = rootEntrypointBlock(lang);
  const changes = [];
  for (const file of ROOT_ENTRYPOINT_FILES) {
    const fullPath = path.join(process.cwd(), file);
    const existed = fs.existsSync(fullPath);
    const current = existed ? fs.readFileSync(fullPath, "utf8") : "";
    const next = upsertManagedBlock(current, block);
    if (existed && current === next) {
      changes.push({ action: "kept", path: file });
      continue;
    }
    fs.writeFileSync(fullPath, next);
    changes.push({ action: existed ? "updated" : "created", path: file });
  }
  return changes;
}

function hasAllRootEntrypoints() {
  return ROOT_ENTRYPOINT_FILES.every((file) => {
    const fullPath = path.join(process.cwd(), file);
    return fs.existsSync(fullPath) && hasManagedEntrypointBlock(fs.readFileSync(fullPath, "utf8"));
  });
}

function formatTimestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join("") + "-" + [
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds())
  ].join("");
}

function uniqueBackupPath(basePath) {
  if (!fs.existsSync(basePath)) return basePath;
  for (let index = 1; index < 1000; index += 1) {
    const candidate = `${basePath}-${index}`;
    if (!fs.existsSync(candidate)) return candidate;
  }
  throw new Error(`Could not allocate backup path: ${basePath}`);
}

function printChanges(title, changes, lang) {
  const text = getText(lang);
  console.log(title);
  for (const change of changes) {
    console.log(`[${text.changeLabels[change.action] || change.action}] ${change.path}`);
  }
}

function summarizeChanges(changes, lang) {
  const counts = changes.reduce((acc, change) => {
    acc[change.action] = (acc[change.action] || 0) + 1;
    return acc;
  }, {});
  const text = getText(lang);
  return ["created", "updated", "kept"]
    .filter((action) => counts[action])
    .map((action) => text.changeUnit(text.changeLabels[action], counts[action]))
    .join(", ");
}

function hasUsefulFile(dir, { excludeDirs = [], excludeFiles = [] } = {}) {
  if (!fs.existsSync(dir)) return false;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".gitkeep" || excludeFiles.includes(entry.name)) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (excludeDirs.includes(entry.name)) {
        continue;
      }
      if (hasUsefulFile(fullPath, { excludeDirs, excludeFiles })) {
        return true;
      }
    } else if (entry.isFile()) {
      return true;
    }
  }
  return false;
}

function readProjectTemplate(lang) {
  const projectFile = path.join(getSourceAi(lang), "project", "project.md");
  if (!fs.existsSync(projectFile)) return null;
  return fs.readFileSync(projectFile, "utf8");
}

function projectStillLooksFresh(lang) {
  const projectFile = path.join(TARGET_AI, "project", "project.md");
  if (!fs.existsSync(projectFile)) return true;
  const template = readProjectTemplate(lang);
  if (!template) return false;
  return fs.readFileSync(projectFile, "utf8") === template;
}

function proposalState() {
  const proposalDir = path.join(TARGET_AI, "project", "proposals", "final-shape-updates");
  if (!fs.existsSync(proposalDir)) return null;
  const proposalFiles = listFiles(proposalDir)
    .filter((file) => file.endsWith(".md") && file !== "_template.md");
  let hasProposed = false;
  for (const file of proposalFiles) {
    const content = fs.readFileSync(path.join(proposalDir, file), "utf8");
    const statusMatch = content.match(/^status:\s*["']?([^"'\s]+)["']?\s*$/m);
    const status = statusMatch ? statusMatch[1] : null;
    if (/^status:\s*["']?accepted["']?\s*$/m.test(content)) {
      return "accepted";
    }
    if (!status || status === "proposed") {
      hasProposed = true;
    }
  }
  return hasProposed ? "proposed" : null;
}

function readTaskReadiness() {
  const taskPath = path.join(TARGET_AI, "project", "task.md");
  if (!fs.existsSync(taskPath)) return null;
  const content = fs.readFileSync(taskPath, "utf8");
  const match = content.match(/^readiness:\s*["']?([^"'\s]+)["']?\s*$/m);
  return match ? match[1] : null;
}

function readResultStatus() {
  const resultPath = path.join(TARGET_AI, "project", "result.json");
  if (!fs.existsSync(resultPath)) return null;
  try {
    const result = JSON.parse(fs.readFileSync(resultPath, "utf8"));
    return result && typeof result.status === "string" ? result.status : null;
  } catch {
    return "invalid";
  }
}

function printNextDecision(text, command, reason, { verbose = false, commandType = "agent" } = {}) {
  console.log(`${text.nextAction}:`);
  if (command) {
    const intro = commandType === "shell" ? text.nextRunCommand : text.nextTellAgent;
    console.log(`${intro}
  ${command}`);
  } else {
    console.log(`  ${text.nextNoAction}`);
  }
  if (verbose && reason) {
    console.log(`
${text.nextReason}: ${reason}`);
  }
}

function init({ lang = DEFAULT_LANG, verbose = false, quiet = false, manageEntrypoints = true } = {}) {
  const text = getText(lang);
  if (!SUPPORTED_LANGS.has(lang)) {
    console.error(`[${text.fail}] ${text.invalidLang}: ${lang}`);
    process.exitCode = 1;
    return;
  }

  const sourceAi = getSourceAi(lang);
  if (!fs.existsSync(sourceAi)) {
    console.error(`[${text.fail}] ${text.sourceMissing}: ${sourceAi}`);
    process.exitCode = 1;
    return;
  }

  ensureDir(TARGET_AI);

  const changes = [];
  changes.push(...copyTree(path.join(sourceAi, "template"), path.join(TARGET_AI, "template"), true)
    .map((change) => ({ ...change, path: path.join("ai/template", change.path) })));

  const readmeChange = copyFile(sourceAi, TARGET_AI, "README.md", !fs.existsSync(path.join(TARGET_AI, "README.md")));
  changes.push({ ...readmeChange, path: path.join("ai", readmeChange.path) });

  changes.push(...copyTree(path.join(sourceAi, "project"), path.join(TARGET_AI, "project"), false)
    .map((change) => ({ ...change, path: path.join("ai/project", change.path) })));

  if (manageEntrypoints) {
    changes.push(...ensureRootEntrypoints(lang));
  }

  if (!quiet) {
    const sourceNotice = isSourceCheckout() ? `\n${text.sourceCheckoutNotice}` : "";
    console.log(`${text.ready}

${text.initGuide}${sourceNotice}

${text.check}: ${commandHint("doctor")}
`);

    if (verbose) {
      console.log(`${text.files}: ${summarizeChanges(changes, lang)}`);
      printChanges(text.details, changes, lang);
    }
  }
}

function refresh({ lang = DEFAULT_LANG, title } = {}) {
  const text = getText(lang);
  if (!SUPPORTED_LANGS.has(lang)) {
    console.error(`[${text.fail}] ${text.invalidLang}: ${lang}`);
    process.exitCode = 1;
    return;
  }

  const projectPath = path.join(TARGET_AI, "project");

  if (!fs.existsSync(projectPath)) {
    init({ lang, verbose: false, quiet: false });
    console.log(`[${text.pass}] ${text.refreshNoProject}`);
    return;
  }

  ensureDir(TARGET_AI);
  const backupPath = uniqueBackupPath(path.join(TARGET_AI, `project.backup.${formatTimestamp()}`));
  fs.renameSync(projectPath, backupPath);

  init({ lang, verbose: false, quiet: true, manageEntrypoints: false });

  const importPath = path.join(TARGET_AI, "project", "inbox", "raw", "old-project");
  ensureDir(importPath);
  copyTree(backupPath, importPath, false);

  console.log(`${title || text.refreshTitle}
[${text.pass}] ${text.refreshBackedUp}: ${path.relative(process.cwd(), backupPath)}
[${text.pass}] ${text.refreshImported}: ${path.relative(process.cwd(), importPath)}
[${text.pass}] ${text.refreshReady}

${text.then}
  ${text.refreshPrompt}
`);
}

function next({ lang = readInstalledLang(), verbose = false } = {}) {
  const text = getText(lang);
  if (!SUPPORTED_LANGS.has(lang)) {
    console.error(`[${text.fail}] ${text.invalidLang}: ${lang}`);
    process.exitCode = 1;
    return;
  }

  console.log(`${text.nextTitle}\n`);
  if (verbose) {
    printSourceCheckoutNotice(lang);
  }

  const templatePath = path.join(TARGET_AI, "template");
  const projectPath = path.join(TARGET_AI, "project");
  if (!fs.existsSync(templatePath) || !fs.existsSync(projectPath)) {
    printNextDecision(text, commandHint("init"), text.nextReasons.missingInstall, {
      verbose,
      commandType: "shell"
    });
    return;
  }

  const state = proposalState();
  if (state === "accepted") {
    printNextDecision(text, text.strategyApplyPrompt, text.nextReasons.proposalAccepted, { verbose });
    return;
  }
  if (state === "proposed") {
    if (!verbose) {
      console.log(`${text.nextReviewProposal}`);
    }
    printNextDecision(text, text.strategyApplyPrompt, text.nextReasons.proposalProposed, { verbose });
    return;
  }

  if (hasUsefulFile(path.join(projectPath, "inbox", "ideas"))) {
    printNextDecision(text, text.strategyPrompt, text.nextReasons.ideas, { verbose });
    return;
  }

  if (hasUsefulFile(path.join(projectPath, "inbox"), { excludeDirs: ["ideas", "processed"] })) {
    printNextDecision(text, text.executePrompt, text.nextReasons.inbox, { verbose });
    return;
  }

  if (projectStillLooksFresh(lang)) {
    printNextDecision(text, text.startPrompt, text.nextReasons.freshProject, { verbose });
    return;
  }

  const readiness = readTaskReadiness();
  if (readiness && readiness !== "ready_to_execute") {
    printNextDecision(text, text.nextContinuePrompt, text.nextReasons.draftTask, { verbose });
    return;
  }

  const resultStatus = readResultStatus();
  if (readiness === "ready_to_execute" && resultStatus !== "success") {
    const reason = resultStatus ? text.nextReasons.failedResult : text.nextReasons.readyTask;
    printNextDecision(text, text.nextContinuePrompt, reason, { verbose });
    return;
  }

  if (resultStatus && resultStatus !== "success") {
    printNextDecision(text, text.nextContinuePrompt, text.nextReasons.failedResult, { verbose });
    return;
  }

  printNextDecision(text, null, text.nextReasons.clean, { verbose });
}

function update({ lang = readInstalledLang() } = {}) {
  const text = getText(lang);
  if (!SUPPORTED_LANGS.has(lang)) {
    console.error(`[${text.fail}] ${text.invalidLang}: ${lang}`);
    process.exitCode = 1;
    return;
  }

  const sourceTemplate = path.join(getSourceAi(lang), "template");
  const targetTemplate = path.join(TARGET_AI, "template");
  if (!fs.existsSync(sourceTemplate)) {
    console.error(`[${text.fail}] ${text.sourceMissing}: ${sourceTemplate}`);
    process.exitCode = 1;
    return;
  }
  ensureDir(targetTemplate);
  const changes = copyTree(sourceTemplate, targetTemplate, true)
    .map((change) => ({ ...change, path: path.join("ai/template", change.path) }));
  changes.push(...ensureRootEntrypoints(lang));
  printChanges(text.updateTitle, changes, lang);
  console.log(`[${text.pass}] ${text.updated} ${readVersion(sourceTemplate) || text.unknown}. ${text.projectNotModified}`);
}

function reconcile({ lang = readInstalledLang() } = {}) {
  const text = getText(lang);
  if (!SUPPORTED_LANGS.has(lang)) {
    console.error(`[${text.fail}] ${text.invalidLang}: ${lang}`);
    process.exitCode = 1;
    return;
  }

  console.log(`${text.reconcileTitle}

${text.reconcilePut}
  ai/project/inbox/

${text.reconcileAsk}
  ${text.reconcilePrompt}
`);
}

function strategy({ lang = readInstalledLang() } = {}) {
  const text = getText(lang);
  if (!SUPPORTED_LANGS.has(lang)) {
    console.error(`[${text.fail}] ${text.invalidLang}: ${lang}`);
    process.exitCode = 1;
    return;
  }

  console.log(`${text.strategyTitle}

${text.strategyPut}
  ai/project/inbox/ideas/

${text.strategyAsk}
  ${text.strategyPrompt}

${text.strategyReview}
  ${text.strategyApplyPrompt}
`);
}

function isPermissionError(error) {
  return error && (error.code === "EACCES" || error.code === "EPERM");
}

function parseJsonFile(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function valueMatchesType(value, type) {
  if (type === "array") return Array.isArray(value);
  if (type === "integer") return Number.isInteger(value);
  if (type === "number") return typeof value === "number" && Number.isFinite(value);
  if (type === "object") return value !== null && typeof value === "object" && !Array.isArray(value);
  return typeof value === type;
}

function valuesEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function validateJsonSchema(value, schema, location = "$") {
  const errors = [];

  if (schema.const !== undefined && !valuesEqual(value, schema.const)) {
    errors.push(`${location} must be ${JSON.stringify(schema.const)}`);
  }

  if (schema.enum && !schema.enum.some((candidate) => valuesEqual(value, candidate))) {
    errors.push(`${location} must be one of ${schema.enum.map((item) => JSON.stringify(item)).join(", ")}`);
  }

  if (schema.type && !valueMatchesType(value, schema.type)) {
    errors.push(`${location} must be ${schema.type}`);
    return errors;
  }

  if (schema.minimum !== undefined && typeof value === "number" && value < schema.minimum) {
    errors.push(`${location} must be >= ${schema.minimum}`);
  }

  if (schema.minLength !== undefined && typeof value === "string" && value.length < schema.minLength) {
    errors.push(`${location} must have length >= ${schema.minLength}`);
  }

  if (schema.required && valueMatchesType(value, "object")) {
    for (const key of schema.required) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) {
        errors.push(`${location}.${key} is required`);
      }
    }
  }

  if (schema.properties && valueMatchesType(value, "object")) {
    for (const [key, childSchema] of Object.entries(schema.properties)) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        errors.push(...validateJsonSchema(value[key], childSchema, `${location}.${key}`));
      }
    }
  }

  if (schema.items && Array.isArray(value)) {
    value.forEach((item, index) => {
      errors.push(...validateJsonSchema(item, schema.items, `${location}[${index}]`));
    });
  }

  if (schema.allOf) {
    for (const childSchema of schema.allOf) {
      if (childSchema.if) {
        if (validateJsonSchema(value, childSchema.if, location).length === 0 && childSchema.then) {
          errors.push(...validateJsonSchema(value, childSchema.then, location));
        }
      } else {
        errors.push(...validateJsonSchema(value, childSchema, location));
      }
    }
  }

  return errors;
}

function checkSchemaValidation(file, schemaFile, text) {
  const fullPath = path.join(process.cwd(), file);
  const schemaPath = path.join(process.cwd(), schemaFile);
  if (!fs.existsSync(fullPath) || !fs.existsSync(schemaPath)) {
    return { ok: true, messages: [] };
  }

  let value;
  try {
    value = parseJsonFile(fullPath);
  } catch {
    return { ok: false, messages: [`${file} ${text.invalidJson}`] };
  }

  let schema;
  try {
    schema = parseJsonFile(schemaPath);
  } catch {
    return { ok: false, messages: [`${schemaFile} ${text.invalidJson}`] };
  }

  const errors = validateJsonSchema(value, schema);
  if (errors.length > 0) {
    return { ok: false, messages: [`${file} ${text.invalidSchema}: ${errors.slice(0, 3).join("; ")}`] };
  }

  return { ok: true, messages: [`${file} JSON`, `${file} schema`] };
}

function printFatal(error, lang) {
  const text = getText(lang);
  if (isPermissionError(error)) {
    const target = error.dest || error.path || process.cwd();
    console.error(`[${text.fail}] ${text.permissionDenied}: ${target}`);
    console.error(text.permissionHint);
    process.exitCode = 1;
    return;
  }
  console.error(error && error.stack ? error.stack : String(error));
  process.exitCode = 1;
}

function doctor({ verbose = false } = {}) {
  const lang = readInstalledLang();
  const text = getText(lang);
  console.log(`${text.doctorTitle}\n`);
  if (verbose) {
    printSourceCheckoutNotice(lang);
    console.log(`${text.templateVersion}: ${readVersion(path.join(TARGET_AI, "template")) || text.unknown}`);
    console.log(`${text.templateLang}: ${lang}\n`);
  }

  let missing = 0;
  let warnings = 0;
  const detailLines = [];
  const installedVersion = readVersion(path.join(TARGET_AI, "template"));
  const packageVersion = readPackageVersion();

  for (const file of REQUIRED_FILES) {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      detailLines.push(`[${text.missing}] ${file}`);
      missing += 1;
      continue;
    }
    const content = fs.readFileSync(fullPath, "utf8");
    if (
      ["ai/project/project.md", "ai/project/runtime.md", "ai/project/task.md"].includes(file) &&
      content.trim().length === 0
    ) {
      detailLines.push(`[${text.warn}] ${file} ${text.empty}`);
      warnings += 1;
      continue;
    }
    if (verbose) {
      detailLines.push(`[${text.pass}] ${file}`);
    }
  }

  for (const file of RECOMMENDED_FILES) {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      detailLines.push(`[${text.warn}] ${file} ${text.missing}`);
      warnings += 1;
      continue;
    }
    if (verbose) {
      detailLines.push(`[${text.pass}] ${file}`);
    }
  }

  if (hasAllRootEntrypoints()) {
    if (verbose) {
      detailLines.push(`[${text.pass}] ${text.entrypointReady}`);
    }
  } else {
    detailLines.push(`[${text.warn}] ${text.entrypointMissing}`);
    warnings += 1;
  }

  const schemaChecks = [
    ["ai/project/result.json", "ai/template/schemas/result.schema.json"],
    ["ai/project/metrics.json", "ai/template/schemas/metrics.schema.json"]
  ];
  for (const [file, schemaFile] of schemaChecks) {
    const check = checkSchemaValidation(file, schemaFile, text);
    if (!check.ok) {
      missing += 1;
      for (const message of check.messages) {
        detailLines.push(`[${text.fail}] ${message}`);
      }
    } else if (verbose) {
      for (const message of check.messages) {
        detailLines.push(`[${text.pass}] ${message}`);
      }
    }
  }

  const taskPath = path.join(process.cwd(), "ai/project/task.md");
  if (fs.existsSync(taskPath)) {
    const taskContent = fs.readFileSync(taskPath, "utf8");
    const hasFrontMatter = taskContent.startsWith("---\n");
    const hasRequiredTaskFields = TASK_HEALTH_PATTERNS.every((pattern) => pattern.test(taskContent));
    if (hasFrontMatter && hasRequiredTaskFields) {
      if (verbose) {
        detailLines.push(`[${text.pass}] ai/project/task.md front matter`);
      }
    } else {
      detailLines.push(`[${text.warn}] ai/project/task.md ${text.taskFrontMatterIncomplete}`);
      warnings += 1;
    }
  }

  if (installedVersion && packageVersion && installedVersion !== packageVersion) {
    detailLines.push(`[${text.warn}] ai/template/VERSION ${text.versionMismatch}: ${installedVersion} != ${packageVersion}`);
    warnings += 1;
  }

  if (missing > 0) {
    console.log(`${text.status}: ${text.needsRepair}`);
    console.log(`${text.nextAction}: ${commandHint("init")}`);
    process.exitCode = 1;
  } else if (warnings > 0) {
    console.log(`${text.status}: ${text.readyWithWarnings}`);
    console.log(`${text.nextAction}: ${text.repairHint}`);
  } else {
    console.log(`${text.status}: ${text.readyToRun}`);
  }

  if (detailLines.length > 0) {
    console.log(`\n${text.diagnosticDetails}:`);
    for (const line of detailLines) {
      console.log(line);
    }
  }
}

const args = process.argv.slice(2);
const command = args[0] || "help";
const verbose = args.includes("--verbose");
const requestedLang = parseLang(
  args,
  command === "update" ||
    command === "doctor" ||
    command === "reconcile" ||
    command === "strategy" ||
    command === "refresh" ||
    command === "improve-context" ||
    command === "next"
    ? readInstalledLang()
    : DEFAULT_LANG
);

try {
  if (command === "init") {
    init({ lang: requestedLang, verbose });
  } else if (command === "next") {
    next({ lang: requestedLang, verbose });
  } else if (command === "refresh") {
    refresh({ lang: requestedLang });
  } else if (command === "improve-context") {
    refresh({ lang: requestedLang, title: getText(requestedLang).improveContextTitle });
  } else if (command === "update") {
    update({ lang: requestedLang });
  } else if (command === "reconcile") {
    reconcile({ lang: requestedLang });
  } else if (command === "strategy") {
    strategy({ lang: requestedLang });
  } else if (command === "doctor") {
    doctor({ verbose });
  } else {
    usage(requestedLang);
    if (command !== "help" && command !== "--help" && command !== "-h") {
      process.exitCode = 1;
    }
  }
} catch (error) {
  printFatal(error, requestedLang);
}
