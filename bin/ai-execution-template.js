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

const TEXT = {
  zh: {
    usage: `AI Execution Template

用法:
  ai-execution-template init [--lang zh|en] [--verbose]
  ai-execution-template update [--lang zh|en]
  ai-execution-template doctor
`,
    unknown: "未知",
    sourceMissing: "找不到模板来源",
    ready: "AI Execution Template 已就绪。",
    start: "开始:",
    startPrompt: "严格执行 ai/template/bootstrap.md，不要总结它。",
    then: "然后:",
    reviewProject: "检查 ai/project/project.md 和 ai/project/refs/*",
    giveTask: "给出修正意见，或提供一个任务目标",
    confirmTask: "确认 ai/project/task.md 后，运行:",
    executePrompt: "严格执行 ai/template/prompt.md，执行已确认的任务。",
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
  ai-execution-template doctor
`,
    unknown: "unknown",
    sourceMissing: "Template source not found",
    ready: "AI Execution Template ready.",
    start: "Start:",
    startPrompt: "Execute ai/template/bootstrap.md exactly. Do not summarize.",
    then: "Then:",
    reviewProject: "Review ai/project/project.md and ai/project/refs/*",
    giveTask: "Give corrections or a task goal",
    confirmTask: "Confirm ai/project/task.md, then run:",
    executePrompt: "Follow ai/template/prompt.md and execute the confirmed task.",
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

  if (missing > 0) {
    console.log(`\n[${text.fail}] ${text.runInit}`);
    process.exitCode = 1;
  } else if (warnings > 0) {
    console.log(`\n[${text.pass}] ${text.readyWithWarnings}`);
  } else {
    console.log(`\n[${text.pass}] ${text.readyToRun}`);
  }
}

const args = process.argv.slice(2);
const command = args[0] || "help";
const verbose = args.includes("--verbose");
const requestedLang = parseLang(args, command === "update" || command === "doctor" ? readInstalledLang() : DEFAULT_LANG);

if (command === "init") {
  init({ lang: requestedLang, verbose });
} else if (command === "update") {
  update({ lang: requestedLang });
} else if (command === "doctor") {
  doctor();
} else {
  usage(requestedLang);
  if (command !== "help" && command !== "--help" && command !== "-h") {
    process.exitCode = 1;
  }
}
