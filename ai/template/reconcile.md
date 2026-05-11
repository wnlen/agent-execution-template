# AI 上下文整合

不要总结这个文件。
执行下面的上下文整合流程。

你正在把新的权威资料吸收到现有 AI Execution Template 项目上下文中。
这不是重新引导，也不是全量覆盖。

目标：合并新资料中的长期有效事实，修正过期或不准确的旧上下文，保留仍然正确的既有内容。

## 适用场景

当项目已经使用一段时间后，出现更完整、更权威的业务、产品、架构或流程资料时，使用本流程。

新资料默认放在：

- `ai/project/inbox/*.md`
- `docs/**`

`ai/project/inbox/` 是待吸收资料区。资料被整合确认后，可以保留用于追溯，也可以移动到项目文档或归档。

## 先读

1. `ai/template/protocol.md`
2. `ai/template/rules/core.md`
3. `ai/project/project.md`
4. `ai/project/runtime.md`
5. `ai/project/refs/*.md`
6. 人类指定的新资料；未指定时，读取 `ai/project/inbox/*.md`

不要默认读取 `ai/project/archive/**`、源码、测试、配置或依赖文件，除非人类明确要求用它们核对事实。

## 整合原则

- 不要直接覆盖整套文件。
- 保留仍然正确的既有上下文。
- 将新资料拆分进合适位置：
  - 项目身份、用户、稳定约定 -> `ai/project/project.md`
  - 当前仍有效的执行上下文 -> `ai/project/runtime.md`
  - 架构 / API / 模块边界 -> `ai/project/refs/architecture.md`
  - 命令 -> `ai/project/refs/commands.md`
  - 约束 -> `ai/project/refs/constraints.md`
  - 持久决策 -> `ai/project/refs/decisions.md`
- 不要把 `refs/*` 写成原文堆砌；只吸收结构化、长期有效、可复用的内容。
- `task.md`、`result.json`、`result.md`、`metrics.json` 通常不参与业务上下文整合，除非人类明确要求吸收其中仍长期有效的事实。

## 两阶段流程

### 阶段 1：整合计划

先输出整合计划，不要修改文件。

整合计划必须包含：

1. 建议新增的内容
2. 建议修正的内容
3. 与现有上下文冲突的内容
4. 建议废弃或降级的内容
5. 需要人类确认的问题，最多 3 个
6. 预计会更新的文件

如果没有需要确认的问题，明确写“无需额外确认”。

阶段 1 结束时必须停止，等待人类确认。

### 阶段 2：应用整合

只有在人类明确确认整合计划后，才更新文件。

允许更新：

- `ai/project/project.md`
- `ai/project/runtime.md`
- `ai/project/refs/*.md`

除非人类明确要求，否则不要修改：

- 源码、测试、配置、依赖文件
- `ai/project/task.md`
- `ai/project/result.json`
- `ai/project/result.md`
- `ai/project/metrics.json`
- `ai/project/archive/**`

## 最终交接

应用整合后，最终回复必须包含：

```text
上下文整合已完成。

已更新：
- file

关键变化：
- 新增：
- 修正：
- 废弃：

仍不确定：
- 最多 3 条；没有则写“无”

我建议下一步做：
1. 优先任务：
   原因：
2. 备选任务：
   原因：

请直接回复：
- 确认，按建议 1 起草任务
- 确认，但改做：<一句话任务>
- 修正：<你要改的地方>
```

不要让人类自己去文件管理器里寻找变化；文件路径只作为可追溯记录。
