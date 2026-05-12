#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const PACKAGE_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_ROOT = path.join(PACKAGE_ROOT, "template");
const TARGET_AI = path.join(process.cwd(), "ai");
const DEFAULT_LANG = "zh";
const SUPPORTED_LANGS = new Set(["zh", "en"]);

const REQUIRED_FILES = [
  "ai/template/LANG",
  "ai/template/VERSION",
  "ai/template/bootstrap.md",
  "ai/template/prompt.md",
  "ai/template/reconcile.md",
  "ai/template/protocol.md",
  "ai/template/rules/core.md",
  "ai/template/rules/output.md",
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
  "ai/project/inbox/raw/.gitkeep",
  "ai/project/proposals/final-shape-updates/.gitkeep",
  "ai/project/proposals/final-shape-updates/_template.md",
  "ai/project/refs/final-shape.md",
  "ai/project/refs/module-map.md",
  "ai/project/refs/roadmap.md"
];

const JSON_HEALTH_FILES = [
  "ai/project/result.json",
  "ai/project/metrics.json"
];

const TASK_HEALTH_PATTERNS = [
  /^task_id:\s*/m,
  /^type:\s*/m,
  /^priority:\s*/m,
  /^risk_level:\s*/m,
  /^model_policy:/m,
  /^refs:/m,
  /^permission:/m
];

const TEXT = {
  zh: {
    usage: `AI Execution Template

用法:
  ai-execution-template init [--lang zh|en] [--verbose]
  ai-execution-template next [--lang zh|en]
  ai-execution-template refresh [--lang zh|en]
  ai-execution-template improve-context [--lang zh|en]
  ai-execution-template update [--lang zh|en]
  ai-execution-template reconcile [--lang zh|en]
  ai-execution-template strategy [--lang zh|en]
  ai-execution-template doctor
`,
    unknown: "未知",
    sourceMissing: "找不到模板来源",
    ready: "AI Execution Template 已就绪。",
    initGuide: `[初始化]
1. 直接初始化
   对 AI 说: 开始初始化这个项目
2. 带资料初始化
   先放到: ai/project/inbox/
   对 AI 说: 开始初始化这个项目，并吸收 ai/project/inbox/ 里的资料

[后续]
1. 继续推进
   对 AI 说: 继续推进这个项目
2. 吸收新资料
   先放到: ai/project/inbox/
   对 AI 说: 整合 ai/project/inbox/ 里的新资料
3. 优化上下文
   运行命令: npx -y @wnlen/ai-execution-template refresh
4. 评估方向
   先放到: ai/project/inbox/ideas/
   对 AI 说: 把 ai/project/inbox/ideas/ 里的新灵感生成方向修订提案
5. 查看下一步
   运行命令: npx -y @wnlen/ai-execution-template next

[区分标准]
  资料 = 已确定的事实、文档、流程、接口、业务规则
  方向 = 还没决定的新想法、产品策略、架构调整、路线变化`,
    start: "开始:",
    startPrompt: "开始初始化这个项目",
    then: "然后:",
    reviewProject: "按 AI 输出确认或修正项目上下文",
    giveTask: "需要执行任务时，说：继续推进这个项目",
    confirmTask: "需要吸收新资料时，先放入 ai/project/inbox/，然后说:",
    executePrompt: "整合 ai/project/inbox/ 里的新资料",
    strategyHint: "需要修订方向时，先放入 ai/project/inbox/ideas/，然后生成 strategy_update 提案。",
    files: "文件",
    check: "检查",
    details: "详情:",
    refreshTitle: "AI Execution Template 项目上下文重整",
    improveContextTitle: "AI Execution Template 上下文总结优化",
    refreshBackedUp: "已备份旧项目上下文",
    refreshImported: "已将旧项目上下文放入",
    refreshReady: "新的 ai/project/** 已生成。",
    refreshPrompt: "整合 ai/project/inbox/ 里的新资料，基于旧上下文重新生成更精良的 ai/project/",
    refreshNoProject: "未发现旧 ai/project/**，已执行普通初始化。",
    updateTitle: "AI Execution Template 更新",
    updated: "已将 ai/template/** 更新到",
    projectNotModified: "ai/project/** 未修改。",
    doctorTitle: "AI Execution Template 检查",
    templateVersion: "模板版本",
    templateLang: "模板语言",
    missing: "缺失",
    warn: "警告",
    pass: "通过",
    fail: "失败",
    empty: "为空",
    invalidJson: "JSON 无效",
    taskFrontMatterIncomplete: "任务 front matter 缺少关键字段",
    versionMismatch: "模板版本与包版本不一致",
    runInit: "请运行 npx -y @wnlen/ai-execution-template init",
    readyWithWarnings: "已就绪，但存在警告",
    readyToRun: "已就绪",
    invalidLang: "不支持的语言，请使用 zh 或 en",
    reconcileTitle: "AI Execution Template 上下文整合",
    reconcilePut: "把新的业务、产品、架构或流程资料放到:",
    reconcileAsk: "然后对 AI 说:",
    reconcilePrompt: "整合 ai/project/inbox/ 里的新资料",
    strategyTitle: "AI Execution Template 方向修订",
    strategyPut: "把新的产品、业务、架构或方向灵感放到:",
    strategyAsk: "然后对 AI 说:",
    strategyPrompt: "把 ai/project/inbox/ideas/ 里的新灵感生成方向修订提案",
    strategyReview: "人类确认提案后，再说:",
    strategyApplyPrompt: "确认，合并这个提案",
    nextTitle: "AI Execution Template 下一步",
    nextRunInit: "当前项目还没有安装模板。先运行:",
    nextTellAgent: "把这句话发给你的 AI coding 工具:",
    nextRunCommand: "运行这个命令:",
    nextReviewProposal: "已有方向修订提案。先审查提案；确认后对 AI 说:",
    repairHint: "缺失的 project 推荐文件可通过重新运行 init 安全补齐；已有 ai/project/** 不会被覆盖。",
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
    usage: `AI Execution Template

Usage:
  ai-execution-template init [--lang zh|en] [--verbose]
  ai-execution-template next [--lang zh|en]
  ai-execution-template refresh [--lang zh|en]
  ai-execution-template improve-context [--lang zh|en]
  ai-execution-template update [--lang zh|en]
  ai-execution-template reconcile [--lang zh|en]
  ai-execution-template strategy [--lang zh|en]
  ai-execution-template doctor
`,
    unknown: "unknown",
    sourceMissing: "Template source not found",
    ready: "AI Execution Template ready.",
    initGuide: `[Initialize]
1. Initialize directly
   Tell the AI: Start initializing this project
2. Initialize with material
   Put it in: ai/project/inbox/
   Tell the AI: Start initializing this project and absorb the material in ai/project/inbox/

[Follow-up]
1. Continue work
   Tell the AI: Continue this project
2. Absorb new material
   Put it in: ai/project/inbox/
   Tell the AI: Reconcile the new material in ai/project/inbox/
3. Improve context
   Run: npx -y @wnlen/ai-execution-template refresh
4. Evaluate direction
   Put it in: ai/project/inbox/ideas/
   Tell the AI: Generate a direction amendment proposal from ai/project/inbox/ideas/
5. Show next step
   Run: npx -y @wnlen/ai-execution-template next

[Rule of thumb]
  Material = confirmed facts, docs, workflows, APIs, or business rules
  Direction = undecided ideas, product strategy, architecture changes, or roadmap changes`,
    start: "Start:",
    startPrompt: "Start initializing this project",
    then: "Then:",
    reviewProject: "Confirm or correct the project context from the agent output",
    giveTask: "When you want to execute work, say: Continue this project",
    confirmTask: "When you need to absorb new material, put it in ai/project/inbox/, then say:",
    executePrompt: "Reconcile the new material in ai/project/inbox/",
    strategyHint: "When direction changes, put ideas in ai/project/inbox/ideas/ and produce a strategy_update proposal.",
    files: "Files",
    check: "Check",
    details: "Details:",
    refreshTitle: "AI Execution Template project context refresh",
    improveContextTitle: "AI Execution Template project context improvement",
    refreshBackedUp: "Backed up old project context",
    refreshImported: "Imported old project context into",
    refreshReady: "Generated a fresh ai/project/**.",
    refreshPrompt: "Reconcile the new material in ai/project/inbox/ and regenerate a stronger ai/project/ from the old context",
    refreshNoProject: "No old ai/project/** found; ran normal init.",
    updateTitle: "AI Execution Template update",
    updated: "Updated ai/template/** to",
    projectNotModified: "ai/project/** was not modified.",
    doctorTitle: "AI Execution Template Doctor",
    templateVersion: "Template version",
    templateLang: "Template language",
    missing: "MISSING",
    warn: "WARN",
    pass: "OK",
    fail: "FAIL",
    empty: "is empty",
    invalidJson: "contains invalid JSON",
    taskFrontMatterIncomplete: "task front matter is missing required fields",
    versionMismatch: "template version does not match package version",
    runInit: "Run npx -y @wnlen/ai-execution-template init",
    readyWithWarnings: "Ready to run with warnings",
    readyToRun: "Ready to run",
    invalidLang: "Unsupported language. Use zh or en",
    reconcileTitle: "AI Execution Template Context Reconcile",
    reconcilePut: "Put new business, product, architecture, or process material in:",
    reconcileAsk: "Then tell your agent:",
    reconcilePrompt: "Reconcile the new material in ai/project/inbox/",
    strategyTitle: "AI Execution Template Strategy Update",
    strategyPut: "Put new product, business, architecture, or direction ideas in:",
    strategyAsk: "Then tell your agent:",
    strategyPrompt: "Generate a direction amendment proposal from ai/project/inbox/ideas/",
    strategyReview: "After human confirmation, say:",
    strategyApplyPrompt: "Confirmed, merge this proposal",
    nextTitle: "AI Execution Template next step",
    nextRunInit: "This project has not installed the template yet. Run:",
    nextTellAgent: "Send this to your AI coding tool:",
    nextRunCommand: "Run this command:",
    nextReviewProposal: "A direction amendment proposal exists. Review it first; after confirmation, tell the AI:",
    repairHint: "Missing recommended project files can be safely added by running init again; existing ai/project/** files are not overwritten.",
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

function readInstalledLang() {
  const langFile = path.join(TARGET_AI, "template", "LANG");
  if (!fs.existsSync(langFile)) return DEFAULT_LANG;
  const lang = fs.readFileSync(langFile, "utf8").trim();
  return SUPPORTED_LANGS.has(lang) ? lang : DEFAULT_LANG;
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

function init({ lang = DEFAULT_LANG, verbose = false, quiet = false } = {}) {
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

  if (!quiet) {
    console.log(`${text.ready}

${text.initGuide}

${text.files}: ${summarizeChanges(changes, lang)}
${text.check}: npx -y @wnlen/ai-execution-template doctor
`);

    if (verbose) {
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

  init({ lang, verbose: false, quiet: true });

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

function next({ lang = readInstalledLang() } = {}) {
  const text = getText(lang);
  if (!SUPPORTED_LANGS.has(lang)) {
    console.error(`[${text.fail}] ${text.invalidLang}: ${lang}`);
    process.exitCode = 1;
    return;
  }

  console.log(`${text.nextTitle}\n`);

  const templatePath = path.join(TARGET_AI, "template");
  const projectPath = path.join(TARGET_AI, "project");
  if (!fs.existsSync(templatePath) || !fs.existsSync(projectPath)) {
    console.log(`${text.nextRunInit}
  npx -y @wnlen/ai-execution-template init
`);
    return;
  }

  const state = proposalState();
  if (state === "accepted") {
    console.log(`${text.nextTellAgent}
  ${text.strategyApplyPrompt}
`);
    return;
  }
  if (state === "proposed") {
    console.log(`${text.nextReviewProposal}
  ${text.strategyApplyPrompt}
`);
    return;
  }

  if (hasUsefulFile(path.join(projectPath, "inbox", "ideas"))) {
    console.log(`${text.nextTellAgent}
  ${text.strategyPrompt}
`);
    return;
  }

  if (hasUsefulFile(path.join(projectPath, "inbox"), { excludeDirs: ["ideas"] })) {
    console.log(`${text.nextTellAgent}
  ${text.executePrompt}
`);
    return;
  }

  if (projectStillLooksFresh(lang)) {
    console.log(`${text.nextTellAgent}
  ${text.startPrompt}
`);
    return;
  }

  console.log(`${text.nextTellAgent}
  ${lang === "zh" ? "继续推进这个项目" : "Continue this project"}
`);
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

function doctor() {
  const lang = readInstalledLang();
  const text = getText(lang);
  console.log(`${text.doctorTitle}\n`);
  console.log(`${text.templateVersion}: ${readVersion(path.join(TARGET_AI, "template")) || text.unknown}`);
  console.log(`${text.templateLang}: ${lang}\n`);

  let missing = 0;
  let warnings = 0;
  const installedVersion = readVersion(path.join(TARGET_AI, "template"));
  const packageVersion = readPackageVersion();

  for (const file of REQUIRED_FILES) {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      console.log(`[${text.missing}] ${file}`);
      missing += 1;
      continue;
    }
    const content = fs.readFileSync(fullPath, "utf8");
    if (
      ["ai/project/project.md", "ai/project/runtime.md", "ai/project/task.md"].includes(file) &&
      content.trim().length === 0
    ) {
      console.log(`[${text.warn}] ${file} ${text.empty}`);
      warnings += 1;
      continue;
    }
    console.log(`[${text.pass}] ${file}`);
  }

  for (const file of RECOMMENDED_FILES) {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      console.log(`[${text.warn}] ${file} ${text.missing}`);
      warnings += 1;
      continue;
    }
    console.log(`[${text.pass}] ${file}`);
  }

  for (const file of JSON_HEALTH_FILES) {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      continue;
    }
    try {
      JSON.parse(fs.readFileSync(fullPath, "utf8"));
      console.log(`[${text.pass}] ${file} JSON`);
    } catch {
      console.log(`[${text.fail}] ${file} ${text.invalidJson}`);
      missing += 1;
    }
  }

  const taskPath = path.join(process.cwd(), "ai/project/task.md");
  if (fs.existsSync(taskPath)) {
    const taskContent = fs.readFileSync(taskPath, "utf8");
    const hasFrontMatter = taskContent.startsWith("---\n");
    const hasRequiredTaskFields = TASK_HEALTH_PATTERNS.every((pattern) => pattern.test(taskContent));
    if (hasFrontMatter && hasRequiredTaskFields) {
      console.log(`[${text.pass}] ai/project/task.md front matter`);
    } else {
      console.log(`[${text.warn}] ai/project/task.md ${text.taskFrontMatterIncomplete}`);
      warnings += 1;
    }
  }

  if (installedVersion && packageVersion && installedVersion !== packageVersion) {
    console.log(`[${text.warn}] ai/template/VERSION ${text.versionMismatch}: ${installedVersion} != ${packageVersion}`);
    warnings += 1;
  }

  if (missing > 0) {
    console.log(`\n[${text.fail}] ${text.runInit}`);
    process.exitCode = 1;
  } else if (warnings > 0) {
    console.log(`\n[${text.pass}] ${text.readyWithWarnings}`);
    console.log(text.repairHint);
  } else {
    console.log(`\n[${text.pass}] ${text.readyToRun}`);
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
    next({ lang: requestedLang });
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
    doctor();
  } else {
    usage(requestedLang);
    if (command !== "help" && command !== "--help" && command !== "-h") {
      process.exitCode = 1;
    }
  }
} catch (error) {
  printFatal(error, requestedLang);
}
