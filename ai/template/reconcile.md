# AI 上下文整合

不要总结这个文件。
按下面流程把新权威资料吸收到现有项目上下文。不是重新引导，也不是全量覆盖。

目标：合并新资料中的长期有效事实，修正过期或不准确的旧上下文，保留仍然正确的既有内容。

## 适用场景

当出现更完整、更权威的业务、产品、架构或流程资料时，使用本流程。

新资料默认放在：

- `ai/project/inbox/*.md`
- `ai/project/inbox/raw/*.md`
- `docs/**`

`ai/project/inbox/` 是待吸收区。资料确认整合后移到 `ai/project/inbox/processed/`，
用于追溯并避免重复整合。即使用户说“整合整个 inbox”，也默认只处理
`ai/project/inbox/*.md` 和 `ai/project/inbox/raw/*.md`；不要递归读取
`processed/**` 或 `ideas/**`。

## 先读

1. `ai/template/protocol.md`
2. `ai/template/rules/core.md`
3. `ai/project/project.md`
4. `ai/project/runtime.md`
5. `ai/project/refs/*.md`
6. 人类指定的新资料；未指定时，只读取 `ai/project/inbox/*.md`
   和 `ai/project/inbox/raw/*.md`

不要默认读取 `processed/**`、`ideas/**`、`archive/**`、源码、测试、配置或依赖；
除非人类明确要求用它们核对事实。

## 整合原则

- 不整套覆盖。
- 保留仍正确的既有上下文。
- 将新资料拆分进合适位置：
  - 项目身份、用户、稳定约定 -> `ai/project/project.md`
  - 当前仍有效的执行上下文 -> `ai/project/runtime.md`
  - 最终形态 / 北极星 / 任务价值判断 -> `ai/project/refs/final-shape.md`
  - 当前模块结构 / 边界 / 依赖方向 -> `ai/project/refs/module-map.md`
  - 阶段目标 / 近期路线 / 暂缓事项 -> `ai/project/refs/roadmap.md`
  - 架构 / API / 模块边界 -> `ai/project/refs/architecture.md`
  - 命令 -> `ai/project/refs/commands.md`
  - 约束 -> `ai/project/refs/constraints.md`
  - 持久决策 -> `ai/project/refs/decisions.md`
- `refs/*` 不堆原文；只吸收结构化、长期有效、可复用的内容。
- 新资料若改变北极星、模块地图或路线图，只建议创建 `strategy_update`，不要直接改方向文件。
- `task.md`、`result.json`、`result.md`、`metrics.json` 通常不参与整合；除非人类明确要求吸收其中的长期事实。

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

无问题时写“无需额外确认”。阶段 1 结束必须停止，等待确认。

### 阶段 2：应用整合

只有人类确认整合计划后才更新文件。

允许更新：

- `ai/project/project.md`
- `ai/project/runtime.md`
- `ai/project/refs/*.md`
- `ai/project/inbox/processed/**`，用于存放本次已整合资料

除非人类明确要求，否则不要修改：

- 源码、测试、配置、依赖文件
- `ai/project/refs/final-shape.md`
- `ai/project/refs/module-map.md`
- `ai/project/refs/roadmap.md`
- `ai/project/task.md`
- `ai/project/result.json`
- `ai/project/result.md`
- `ai/project/metrics.json`
- `ai/project/archive/**`

整合完成后，把本次已整合的 `ai/project/inbox/*.md` 和 `ai/project/inbox/raw/*.md`
移到 `ai/project/inbox/processed/`，保留相对路径：`ai/project/inbox/raw/file.md` ->
`ai/project/inbox/processed/raw/file.md`。文件名冲突时加日期或序号。不要移动 `ideas/**`；
方向灵感继续走 `strategy_update`。

## 最终交接

应用后，最终回复包含：

```text
上下文整合已完成。

已更新：
- file

已归档资料：
- ai/project/inbox/processed/file.md

未吸收资料：
- file：原因；没有则写“无”

关键变化：
- 新增：
- 修正：
- 废弃：

冲突处理：
- 冲突或取舍；没有则写“无”

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

不要让人类自己找变化；文件路径只作追溯。
