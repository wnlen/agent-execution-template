# 架构

## 系统概览

Agent Execution Template 是一个 Node.js CLI + 文件模板协议项目。

运行形态：

```text
npx / node bin/agent-execution-template.js
        |
        v
读取 package/template 源
        |
        v
在目标仓库创建或更新 ai/template/**
        |
        v
创建缺失但不覆盖已有的 ai/project/**
        |
        v
AI Coding Agent 读取 ai/template/* 和 ai/project/* 执行任务
```

协议形态：

```text
ai/template/** = 可复用协议
ai/project/**  = repo-local 项目现场
```

## 主要模块

- CLI
  - 职责：命令解析、语言选择、模板复制、刷新备份、下一步提示、doctor 检查。
  - 边界：只提供文件协议安装和检查；不运行 Agent、不调度 worker、不管理 session。
  - 证据：`bin/agent-execution-template.js`

- 模板源
  - 职责：提供中文和英文安装内容。
  - 边界：`template/<lang>/ai/template/**` 可覆盖升级；`template/<lang>/ai/project/**` 只用于创建缺失项目现场文件。
  - 证据：`template/zh/ai/**`、`template/en/ai/**`

- Dogfood 安装态
  - 职责：本仓库自身使用的 `ai/**`。
  - 边界：`ai/template/**` 必须镜像中文模板；`ai/project/**` 是本仓库现场，不回流模板。
  - 证据：`test/check-release.js`

- 协议文档
  - 职责：定义定位、目录、命令、执行闭环、风险门、模型分工、refs、结果和 runtime 治理。
  - 边界：SPEC 是完整规范；README 是用户入口；模板协议是 Agent 执行入口。
  - 证据：`docs/SPEC.md`、`README*.md`、`ai/template/*.md`

- 测试
  - 职责：在临时项目中验证 CLI 行为，并检查发布一致性。
  - 边界：不测试外部 Agent 行为，只测试本包可控的文件和输出契约。
  - 证据：`test/selftest.js`、`test/check-release.js`

## 数据流

### 初始化

```text
用户运行 init
-> CLI 选择 zh/en 模板源
-> 覆盖或创建 ai/template/**
-> 创建缺失的 ai/project/**
-> 保留已有 ai/project/**
-> 输出下一步自然语言提示
```

### 升级

```text
用户运行 update
-> CLI 读取已安装语言或显式 --lang
-> 只覆盖 ai/template/**
-> 不修改 ai/project/**
-> 输出更新结果
```

### 刷新上下文

```text
用户运行 refresh / improve-context
-> 旧 ai/project/** 备份为 ai/project.backup.<timestamp>
-> 新 ai/project/** 从模板生成
-> 旧上下文复制到 ai/project/inbox/raw/old-project/
-> 输出让 AI 整合旧上下文的提示
```

### 执行协议

```text
AI 读取 ai/template/protocol.md + rules + project/runtime/task
-> 判断 bootstrap / reconcile / strategy / task draft / execution
-> 在允许范围内修改文件或停止确认
-> 写 result.json / result.md / metrics.json
```

## API 流程

本项目没有 HTTP API。公共接口是 npm bin 命令：

- `agent-execution-template init [--lang zh|en] [--verbose]`
- `agent-execution-template next [--lang zh|en]`
- `agent-execution-template refresh [--lang zh|en]`
- `agent-execution-template improve-context [--lang zh|en]`
- `agent-execution-template update [--lang zh|en]`
- `agent-execution-template reconcile [--lang zh|en]`
- `agent-execution-template strategy [--lang zh|en]`
- `agent-execution-template doctor`

## 部署形态

- npm 包：`@wnlen/agent-execution-template`
- bin 入口：`bin/agent-execution-template.js`
- 发布内容：`bin`、`docs`、`template`、`test`、`README.md`
- 本地维护命令：`node bin/agent-execution-template.js <command>`
- 用户项目安装命令：`npx -y @wnlen/agent-execution-template <command>`
