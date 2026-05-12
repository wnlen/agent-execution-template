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

const TEXT = {
  zh: {
    usage: `AI Execution Template

用法:
  ai-execution-template init [--lang zh|en] [--verbose]
  ai-execution-template update [--lang zh|en]
  ai-execution-template reconcile [--lang zh|en]
  ai-execution-template strategy [--lang zh|en]
  ai-execution-template doctor
`,
    unknown: "未知",
    sourceMissing: "找不到模板来源",
    ready: "AI Execution Template 已就绪。",
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
    repairHint: "缺失的 project 推荐文件可通过重新运行 init 安全补齐；已有 ai/project/** 不会被覆盖。",
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
  ai-execution-template update [--lang zh|en]
  ai-execution-template reconcile [--lang zh|en]
  ai-execution-template strategy [--lang zh|en]
  ai-execution-template doctor
`,
    unknown: "unknown",
    sourceMissing: "Template source not found",
    ready: "AI Execution Template ready.",
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
    repairHint: "Missing recommended project files can be safely added by running init again; existing ai/project/** files are not overwritten.",
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

function init({ lang = DEFAULT_LANG, verbose = false } = {}) {
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

  console.log(`${text.ready}

${text.start}
  ${text.startPrompt}

${text.then}
  ${text.reviewProject}
  ${text.giveTask}
  ${text.confirmTask}
    ${text.executePrompt}
  ${text.strategyHint}

${text.files}: ${summarizeChanges(changes, lang)}
${text.check}: npx -y @wnlen/ai-execution-template doctor
`);

  if (verbose) {
    printChanges(text.details, changes, lang);
  }
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

function doctor() {
  const lang = readInstalledLang();
  const text = getText(lang);
  console.log(`${text.doctorTitle}\n`);
  console.log(`${text.templateVersion}: ${readVersion(path.join(TARGET_AI, "template")) || text.unknown}`);
  console.log(`${text.templateLang}: ${lang}\n`);

  let missing = 0;
  let warnings = 0;

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
  command === "update" || command === "doctor" || command === "reconcile" || command === "strategy"
    ? readInstalledLang()
    : DEFAULT_LANG
);

if (command === "init") {
  init({ lang: requestedLang, verbose });
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
