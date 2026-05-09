# AI Execution Template

[English](README.md) | 简体中文

[![npm](https://img.shields.io/npm/v/@wnlen/ai-execution-template?color=cb3837)](https://www.npmjs.com/package/@wnlen/ai-execution-template)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![protocol](https://img.shields.io/badge/protocol-v0.7-blue.svg)](docs/SPEC.md)
[![agent agnostic](https://img.shields.io/badge/agent-agnostic-111111.svg)](#适配工具)

> 一个 30 秒可安装的 AI Coding Agent 执行协议。
> 把它装进任意代码仓库，描述一次项目和任务，让 AI 在可复用、可验证、可复盘的协议里执行。

```bash
npx @wnlen/ai-execution-template init
```

然后告诉你的 AI 编程工具：

```text
Read ai/template/prompt.md
```

AI Execution Template 不是新的 Agent 框架。它是代码仓库和 Codex、Claude Code、Cursor、Aider 等 AI Coding Agent 之间缺失的执行层。

它把 AI 编程从：

```text
聊天提示词 -> 临时改代码 -> 验证不清楚 -> 上下文丢在聊天记录里
```

变成：

```text
项目契约 -> 有边界的任务 -> 按协议执行 -> 结果落盘
```

## 为什么需要它

AI Coding Agent 已经很强，但大多数项目仍然在用松散聊天上下文驱动它们。这会带来一些稳定复现的问题：

- 每次都要重新解释项目背景。
- AI 容易越过任务边界，做多、改多。
- 风险、权限、验收标准没有明确落到文件里。
- 代码改了，但验证记录不可靠。
- 有价值的执行历史散落在聊天记录中。
- 模板升级容易误伤项目自己的上下文。
- 便宜模型和强模型没有清晰分工。

AI Execution Template 用一个很小的项目内文件协议解决这些问题：

```text
ai/template/  可复用执行协议
ai/project/   当前项目现场
```

`update` 只刷新协议区，项目现场保持受保护。

## 快速开始

在当前仓库安装协议：

```bash
npx @wnlen/ai-execution-template init
```

填写项目上下文和当前任务：

```text
ai/project/project.md
ai/project/task.md
```

启动 AI Agent 时输入：

```text
Read ai/template/prompt.md
```

查看执行结果：

```text
ai/project/result.md
ai/project/result.json
ai/project/metrics.json
```

检查安装状态：

```bash
npx @wnlen/ai-execution-template doctor
```

只升级可复用协议文件：

```bash
npx @wnlen/ai-execution-template update
```

## 你会得到什么

| 能力 | 含义 |
| --- | --- |
| 可安装执行协议 | 几秒钟给任意仓库加入 AI 执行契约。 |
| Agent 无关 | 可用于 Codex、Claude Code、Cursor、Aider 和其他编程 Agent。 |
| 保护项目现场 | `update` 刷新 `ai/template/**`，不会覆盖 `ai/project/**`。 |
| 有边界的任务执行 | 目标、范围、权限、风险和验收标准集中在任务文件里。 |
| 可审计结果 | 每次执行都可以留下人类可读结果、机器可读事实和 metrics。 |
| Token-efficient 模型策略 | 便宜模型处理边界清楚的工作，强模型只用于关键判断点。 |
| 可升级模板 | 协议可以持续改进，不丢失项目本地记忆。 |
| Doctor 检查 | 执行前检查必要文件和模板版本。 |

## 安装后的结构

```text
ai/
  README.md

  template/
    VERSION
    prompt.md
    protocol.md
    rules/
      core.md
      output.md
    schemas/
      result.schema.json
      metrics.schema.json

  project/
    project.md
    runtime.md
    task.md
    result.json
    result.md
    metrics.json
    refs/
    archive/
```

核心设计就是这条边界：

- `ai/template/**` 是可复用协议，可以安全地从 npm 包升级。
- `ai/project/**` 是项目现场，保存本地上下文、任务、参考资料、结果和 metrics。

## 命令

### `init`

```bash
npx @wnlen/ai-execution-template init
```

在当前项目创建 `ai/`。

- 更新或创建 `ai/template/**`。
- 创建缺失的 `ai/project/**` 文件。
- 保留已有的 `ai/project/**` 文件。

### `update`

```bash
npx @wnlen/ai-execution-template update
```

只更新 `ai/template/**`。

当协议升级，但项目上下文不应该被覆盖时使用它。

### `doctor`

```bash
npx @wnlen/ai-execution-template doctor
```

检查已安装模板版本和必要文件。

输出状态包括：

- `[OK]` 文件存在且可用。
- `[WARN]` 必要的项目上下文文件为空。
- `[MISSING]` 必要文件缺失。

## 执行模型

AI Execution Template 定义了一个简单循环：

```text
Task -> Plan -> Execute -> Review -> Result
```

重点不是构建复杂调度器，而是让一次 AI 辅助编码任务足够清晰，可以执行、验证、重跑和审计。

协议会记录：

- 任务契约；
- 假设和风险；
- 验证尝试；
- 人类可读结果；
- 机器可读执行事实；
- 模型档位和成本信号。

## Token-Efficient 设计

可选的 token-efficient profile 给 Agent 一条模型分工规则：

- `cheap` 模型处理有边界的阅读、小改动、草稿、重复检查和机械整理。
- `standard` 模型处理中等复杂度实现。
- `strong` 模型用于规划、架构评审、风险判断、失败复盘和验收争议。

目标不是单纯减少 token，而是提高每单位模型成本产出的可接受工作量。

更多内容见 [Token-Efficient AI Execution Protocol v0.1](docs/token-efficient-protocol-v0.1.md)。

## 适配工具

AI Execution Template 有意保持工具无关。只要一个 Agent 能读取项目文件并遵循指令，就可以使用它。

常见组合：

- Codex
- Claude Code
- Cursor
- Aider
- 自定义编程 Agent
- 用于边界清晰任务的低成本模型执行器

## 适合谁

- 在多个仓库里频繁使用 AI Coding Agent 的开发者。
- 想要可重复 AI 执行流程，但不想引入完整 Agent 平台的团队。
- 任务边界、验证和审计记录很重要的项目。
- 默认使用便宜模型，只在关键判断点升级模型的工作流。
- 希望 AI 上下文存在于文件里，而不是只存在于聊天记录里的仓库。

## 它不是什么

AI Execution Template 不是：

- IDE；
- Agent 平台；
- 多 Agent 调度器；
- 云服务；
- 提示词合集；
- Codex、Claude Code、Cursor 或 Aider 的替代品。

它是一个小型文件协议，用来让这些工具在真实软件项目中表现得更稳定。

## 规格

- [完整规格](docs/SPEC.md)
- [Token-efficient 协议 profile](docs/token-efficient-protocol-v0.1.md)

当前包信息：

```text
Package:  @wnlen/ai-execution-template
Protocol: v0.7
License:  MIT
```

## 开发

运行自测：

```bash
npm test
```

测试会验证核心 CLI 契约：

- `init` 创建预期的协议和项目文件。
- `update` 不覆盖 `ai/project/**`。
- `doctor` 正确报告缺失文件和空的必要文件。

## 贡献

欢迎提交 issue 和 pull request。

适合贡献的方向包括：

- 更清晰的任务契约；
- 更安全的 project/template 边界；
- 更好的结果 schema；
- 更好的模型成本和验证 metrics；
- 更贴近真实 AI Coding Agent 工作流的示例；
- 更适合团队采用的文档。

## 许可证

[MIT](LICENSE)
