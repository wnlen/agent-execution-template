# Agent Execution Template

[English](README.md) | 简体中文

[![npm](https://img.shields.io/npm/v/@wnlen/agent-execution-template?color=cb3837)](https://www.npmjs.com/package/@wnlen/agent-execution-template)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![protocol](https://img.shields.io/badge/protocol-v0.8-blue.svg)](docs/SPEC.md)
[![agent agnostic](https://img.shields.io/badge/agent-agnostic-111111.svg)](#适配工具)

> 一个 30 秒可安装的 AI Coding Agent 执行协议。
> 把它装进任意代码仓库，让 AI 从现有文档整理项目上下文，人类确认任务契约，然后在可复用、可验证、可复盘的协议里执行。

```bash
npx -y @wnlen/agent-execution-template init
```

默认安装中文模板；也可以显式指定：

```bash
npx -y @wnlen/agent-execution-template init --lang zh
```

然后告诉你的 AI 编程工具：

```text
开始初始化这个项目
```

Agent Execution Template 不是新的 Agent 框架。它是代码仓库和 Codex、Claude Code、Cursor、Aider 等 AI Coding Agent 之间缺失的执行层。
更准确地说，它是 **AI Repo Execution Protocol**：只约束 AI 在某个仓库内如何读取上下文、确认任务、遵守文件修改边界、验收并记录结果。

它不管理 workspace 切换、Session 隔离、sandbox 生命周期或 worker 调度。这些属于外部 workspace/session runtime。

它把 AI 编程从：

```text
聊天提示词 -> 临时改代码 -> 验证不清楚 -> 上下文丢在聊天记录里
```

变成：

```text
整理项目 -> 确认上下文 -> 生成任务 -> 确认契约 -> 执行 -> 结果落盘
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
- 直接影响执行精度的两个文件经常还需要人手写。
- 执行很稳定，但缺少判断任务是否值得做、项目是否跑偏的方向层。

Agent Execution Template 用一个很小的项目内文件协议解决这些问题：

```text
ai/template/  可复用执行协议
ai/project/   当前项目现场和方向层
```

`update` 只刷新协议区，项目现场保持受保护。

## 快速开始

在当前仓库安装协议：

```bash
npx -y @wnlen/agent-execution-template init
```

英文项目可使用：

```bash
npx -y @wnlen/agent-execution-template init --lang en
```

让 Agent 从现有文档和 manifest 里整理项目上下文：

```text
开始初始化这个项目
```

`init` 会在仓库根目录安装 `AGENTS.md` 和 `CLAUDE.md` 兼容入口托管块。两者内容相同，
不是两套协议；它们分别适配通用 Agent / Codex 和 Claude Code 的自动发现约定。
支持这些入口的 AI 工具会先读取 `ai/template/prompt.md`，再路由到 `ai/template/bootstrap.md`。
如果你的 AI 工具没有自动读取根目录入口文件，请先让它读取 `AGENTS.md` 或
`CLAUDE.md`，再发送上面的初始化指令。

Agent 会生成项目上下文，并在聊天里给出需要确认的摘要、风险和建议下一步：

```text
ai/project/project.md
ai/project/refs/*
```

回复修正意见，或确认后继续：

```text
继续推进这个项目
```

Agent 会根据当前上下文起草或执行：

```text
ai/project/task.md
```

当任务草稿已确认后，也可以直接说：

```text
继续推进这个项目
```

查看执行结果：

```text
ai/project/result.md
ai/project/result.json
ai/project/metrics.json
```

检查安装状态：

```bash
npx -y @wnlen/agent-execution-template doctor
```

忘了下一步怎么走：

```bash
npx -y @wnlen/agent-execution-template next
```

重新总结和优化项目上下文：

```bash
npx -y @wnlen/agent-execution-template refresh
```

只升级可复用协议文件：

```bash
npx -y @wnlen/agent-execution-template update
```

查看方向修订入口：

```bash
npx -y @wnlen/agent-execution-template strategy
```

## 你会得到什么

| 能力 | 含义 |
| --- | --- |
| 可安装执行协议 | 几秒钟给任意仓库加入 AI 执行契约。 |
| Agent 无关 | 可用于 Codex、Claude Code、Cursor、Aider 和其他编程 Agent。 |
| Bootstrap 模式 | 读取受控范围内的文档和 manifest，必要时从代码做有边界推断，生成 `project.md` 和 refs 草稿后停下来等人确认。 |
| 项目北极星 | 在 `ai/project/refs/final-shape.md` 保存最终形态、价值判断和跑偏标准。 |
| 策略修订门禁 | 新方向先进入 `inbox/ideas/`，生成 proposal，人类确认后才合并进北极星、模块地图或路线图。 |
| 保护项目现场 | `update` 刷新 `ai/template/**`，不会覆盖 `ai/project/**`。 |
| 项目上下文重整 | `refresh` 备份旧 `ai/project/**`，生成新项目上下文，并把旧上下文放入 inbox 供 AI 整理。 |
| 自动连续执行 | AI 执行前自动拆 L1/L2/L3 任务树；L1 两个以上自动启用边界内连续执行，只有 Red 风险停下来确认。 |
| 可审计结果 | 每次执行都可以留下人类可读结果、机器可读事实和 metrics。 |
| Token-efficient 模型策略 | 便宜模型处理边界清楚的工作，强模型只用于关键判断点。 |
| 可升级模板 | 协议可以持续改进，不丢失项目本地记忆。 |
| Doctor 检查 | 执行前检查必要文件和模板版本。 |

## 自动连续执行怎么工作

用户仍然只需要说自然语言目标，例如：

```text
实现设置页，包括资料编辑、通知开关和导出入口
```

AI 会在执行前先拆 L1 任务。L1 必须是可独立验收的垂直切片，不是机械步骤清单：

```text
- [ ] L1-1 资料编辑 Green
- [ ] L1-2 通知开关 Green
- [ ] L1-3 导出入口 Yellow
```

简单任务不会被完整流程表单淹没。单 L1、Green、低风险任务使用 compact task
contract，只保留目标、范围、验收、权限、验证命令和最小 `task_tree`。多 L1、
Yellow/Red、跨模块、连续执行或高不确定任务才使用 expanded task contract。

因为 L1 有两个以上，协议会自动使用边界内连续执行。执行每个 L1 前，AI 再规划
自然衍生的 L2/L3；完成一个 L1 后，在清单中打勾并划掉。`task_tree` 只在
L1 开始/完成、Red/blocked、范围变化或最终收尾时写回，避免为微小步骤反复改文件。

只有 Red 风险会停下来让你确认。Green 自动继续，Yellow 只允许当前 L1/L2 内的
局部低风险修正，不能改变公共接口、数据模型、权限、安全、架构方向或验收标准。
用户默认只看 L1、风险结论、证据、Red 确认和最终结果；内部协议细节不默认展示。

如果 AI 本轮刚新建或重写了 `ai/project/task.md`，必须先停下来交接确认；
只有已有任务明确处于 `ready_to_execute` 时，才允许进入执行。

## 安装后的结构

```text
ai/
  README.md

  template/
    VERSION
    bootstrap.md
    execution-policy.md
    prompt.md
    reconcile.md
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
    inbox/
      ideas/
      raw/
    proposals/
      final-shape-updates/
    refs/
      final-shape.md
      module-map.md
      roadmap.md
    archive/
```

核心设计就是这条边界：

- `ai/template/**` 是可复用协议，可以安全地从 npm 包升级。
- `ai/project/**` 是项目现场，保存本地上下文、任务、参考资料、结果和 metrics。

## 命令

### `init`

```bash
npx -y @wnlen/agent-execution-template init
```

在当前项目创建 `ai/`。

- 更新或创建 `ai/template/**`。
- 创建缺失的 `ai/project/**` 文件。
- 保留已有的 `ai/project/**` 文件。
- 创建或更新根目录 `AGENTS.md` / `CLAUDE.md` 中的同内容兼容托管块，让不同 AI 工具能发现协议入口。
- 默认安装中文模板；英文模板使用 `--lang en`。

### `next`

```bash
npx -y @wnlen/agent-execution-template next
```

根据当前项目状态打印下一步：

- 未安装时，提示先运行 `init`。
- `ai/project/inbox/` 有资料时，提示执行上下文整合。
- `ai/project/inbox/ideas/` 有灵感时，提示生成方向修订提案。
- 有待确认方向提案时，提示先审查并确认。
- 没有待处理输入时，提示继续推进项目。

### `update`

```bash
npx -y @wnlen/agent-execution-template update
```

只更新 `ai/template/**`。

当协议升级，但项目上下文不应该被覆盖时使用它。
默认沿用 `ai/template/LANG` 中记录的已安装语言。

### `refresh`

```bash
npx -y @wnlen/agent-execution-template refresh
```

重新总结和优化项目上下文。

- 将旧 `ai/project/**` 改名备份为 `ai/project.backup.<timestamp>`。
- 生成新的 `ai/project/**`。
- 将旧上下文复制到 `ai/project/inbox/raw/old-project/`。
- 输出下一句要交给 AI 的整理指令。

也可以使用更直白的别名：

```bash
npx -y @wnlen/agent-execution-template improve-context
```

### `doctor`

```bash
npx -y @wnlen/agent-execution-template doctor
```

检查已安装模板版本和必要文件。

输出状态包括：

- `[通过]` 文件存在且可用。
- `[警告]` 必要的项目上下文文件为空。
- `[缺失]` 必要文件缺失。

### `reconcile`

```bash
npx -y @wnlen/agent-execution-template reconcile
```

打印上下文整合的最短操作说明。

### `strategy`

```bash
npx -y @wnlen/agent-execution-template strategy
```

打印方向修订的最短操作说明。新灵感先进入 `ai/project/inbox/ideas/`，
再由 AI 生成 `strategy_update` 提案；人类确认后再执行 `apply_strategy_update`。

## 执行模型

Agent Execution Template 定义了一个简单循环：

```text
项目引导 -> 项目确认 -> 任务草稿 -> 任务确认 -> 计划 -> 执行 -> 复核 -> 结果
```

重点不是构建复杂调度器，而是让一次 AI 辅助编码任务足够清晰，可以执行、验证、重跑和审计。

协议会记录：

- 允许读取的 bootstrap 来源；
- 任务契约；
- 假设和风险；
- 验证尝试；
- 人类可读结果；
- 机器可读执行事实；
- 模型档位和成本信号。

## 上下文整合

当项目使用一段时间后，出现更完整、更权威的业务、产品、架构或流程资料时，先放到：

```text
ai/project/inbox/
```

然后告诉 AI：

```text
整合 ai/project/inbox/ 里的新资料
```

AI 必须先输出整合计划，等待确认后，再把长期有效事实合并进 `project.md`、`runtime.md` 和 `refs/*`。
整合完成后，已处理资料统一移动到 `ai/project/inbox/processed/`，保留用于追溯。
默认只吸收 `ai/project/inbox/*.md` 和 `ai/project/inbox/raw/*.md`；
`processed/**` 不会再次参与整合，`ideas/**` 走方向修订提案。

## 项目北极星

长期方向不要塞进当前任务。Agent Execution Template 把方向层放在受保护的
`ai/project/**` 中：

```text
ai/project/refs/final-shape.md       # 项目北极星 / 最终形态
ai/project/refs/module-map.md        # 当前模块地图
ai/project/refs/roadmap.md           # 阶段路线图
ai/project/inbox/ideas/              # 新灵感输入区
ai/project/proposals/final-shape-updates/
ai/project/proposals/final-shape-updates/_template.md
```

普通执行任务不能直接修改北极星、模块地图或路线图。方向变化应走：

```text
idea -> strategy_update proposal -> human confirm -> apply_strategy_update
```

这样 `task.md` 负责当前施工单，`final-shape.md` 负责判断任务为什么值得做、项目往哪里生长。

## Token-Efficient 设计

可选的 token-efficient profile 给 Agent 一条模型分工规则：

- `cheap` 模型处理有边界的阅读、小改动、草稿、重复检查和机械整理。
- `standard` 模型处理中等复杂度实现。
- `strong` 模型用于规划、架构评审、风险判断、失败复盘和验收争议。

目标不是单纯减少 token，而是提高每单位模型成本产出的可接受工作量。

更多内容见 [Token-Efficient AI Execution Protocol v0.1](docs/token-efficient-protocol-v0.1.md)。

## 适配工具

Agent Execution Template 有意保持工具无关。只要一个 Agent 能读取项目文件并遵循指令，就可以使用它。

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
- 希望 AI 生成关键上下文文件、人类只确认边界和验收标准的用户。

## 它不是什么

Agent Execution Template 不是：

- IDE；
- Agent 平台；
- 多 Agent 调度器；
- workspace / sandbox / session 运行时；
- 多仓库上下文管理器；
- 云服务；
- 提示词合集；
- Codex、Claude Code、Cursor 或 Aider 的替代品。

它是一个小型文件协议，用来让这些工具在真实软件项目中表现得更稳定。

它不负责 workspace 切换、sandbox 生命周期、session fork / rollback 或 worker 调度。反过来，外部运行时不应该替代仓库内的任务定义、文件修改规则、acceptance criteria 或具体编码上下文。

## 规格

- [完整规格](docs/SPEC.md)
- [Token-efficient 协议 profile](docs/token-efficient-protocol-v0.1.md)

当前包信息：

```text
Package:  @wnlen/agent-execution-template
Protocol: v0.8
License:  MIT
```

## 开发

运行自测：

```bash
npm test
```

发布前检查：

```bash
npm run check:release
```

测试会验证核心 CLI 契约：

- `init` 创建预期的协议和项目文件。
- `update` 不覆盖 `ai/project/**`。
- `doctor` 正确报告缺失文件和空的必要文件。
- `check:release` 验证版本号、模板结构、安装态协议和规格文档一致。

维护这个 npm 包源码仓库时，用 `node bin/agent-execution-template.js <command>`
测试当前 checkout；用户项目才使用 `npx -y @wnlen/agent-execution-template <command>`。
维护者本地 `ai/project/**` 初始化内容不应作为产品改动提交。

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
