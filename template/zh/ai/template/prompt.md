# AI 执行提示

不要总结这个文件。
执行下面的工作流。

你正在 Agent Execution Template 工作区内操作。

先读取：

1. `ai/template/protocol.md`
2. `ai/template/rules/core.md`
3. `ai/template/execution-policy.md`

然后选择模式：

- 如果用户要求更新北极星、最终形态、产品宪法、模块地图、路线图、项目方向，
  或 `ai/project/inbox/ideas/` 里存在 `.gitkeep` 之外的待评估灵感，按 `strategy_update`
  起草方向修订任务或直接生成提案，然后停止等待人类确认。
- 如果用户明确确认某个
  `ai/project/proposals/final-shape-updates/*.md` 可以合并，按
  `apply_strategy_update` 起草或执行应用任务；如果 proposal 仍为
  `proposed`，先根据这次明确确认更新为 `accepted`。
- 如果用户说“开始初始化这个项目，并吸收 ai/project/inbox/ 里的资料”，
  或要求初始化时一并吸收 `ai/project/inbox/` 里的资料，先检查
  `ai/project/project.md`。如果它已经存在且不是空文件、占位内容或明显不完整，
  执行 `ai/template/reconcile.md`，不要重新 bootstrap；如果它为空、只有占位内容或
  明显不完整，执行 `ai/template/bootstrap.md`，并把 `ai/project/inbox/*.md` 与
  `ai/project/inbox/raw/*.md` 视为本次引导输入的一部分；在项目上下文确认后停止。
- 如果用户说“整合 ai/project/inbox/ 里的新资料”，要求整合/合并/吸收/
  更新上下文/处理新资料，提到 `reconcile` 或 `ai/project/inbox/`，
  或 `ai/project/inbox/` 里存在 `.gitkeep` 之外的待吸收资料，执行 `ai/template/reconcile.md`，
  并按它的两阶段流程停止或更新；但 `ai/project/inbox/processed/` 是已处理资料，
  不应触发整合，`ai/project/inbox/ideas/` 应优先走 `strategy_update`。即使用户说
  “整合整个 inbox”，默认也只处理 `ai/project/inbox/*.md` 和
  `ai/project/inbox/raw/*.md`。
- 如果用户说“开始初始化这个项目”、要求初始化/整理/生成项目上下文，
  或 `ai/project/project.md` 为空、只有占位内容、
  或不完整，执行 `ai/template/bootstrap.md`，并在项目上下文确认后停止。
- 如果 `ai/project/task.md` 为空、只有占位内容、或不完整，根据用户当前目标和
  已确认的项目上下文起草它，然后停止等待人类确认。
- 如果用户说“继续推进这个项目”，且没有更具体目标，先全局判断当前最值得做的
  下一步：优先处理待确认上下文、待确认任务、失败结果、未完成任务或明显风险；
  然后给出建议或起草 `ai/project/task.md`，不要让人类自己去文件管理器里找问题。
- 只有当 `ai/project/project.md` 和 `ai/project/task.md` 已经足够定义身份、
  目标、范围、权限和验收时，才进入执行模式。

## 任务草稿交接

在任务草稿模式中：

1. 读取已确认的 `ai/project/project.md` 和相关 `ai/project/refs/*.md`。
2. 根据用户当前目标、项目上下文和仓库事实，推断目标、范围、验收、权限、
   验证方式和初始风险；不要要求用户逐项提供。
3. 起草 `ai/project/task.md`，并将 `execution_policy.mode` 设为 `auto`。
4. 执行前列出 L1 任务清单并标注 Green / Yellow / Red，同时写入
   `execution_policy.task_tree`。L1 少于 2 个时使用 `normal`；L1 为 2 个或更多时
   自动使用 `bounded_continuous`。
5. 本轮如果新建或重写了 `ai/project/task.md`，将 `readiness` 设为
   `draft_for_confirmation` 并停止交接；不要在任务仍是草稿时直接执行。
6. 只有已有任务明确处于 `ready_to_execute`，且没有 Red 预检项时，才能进入执行模式；
   如果不可执行，设为 `blocked`。
7. 不要在任务草稿模式中修改源码或业务文件。

任务草稿模式必须以下面结构结束：

```text
任务草稿已准备好。

请检查：
- ai/project/task.md

请确认或修正：
1. 目标和验收标准
2. 允许和禁止的范围
3. 权限、命令和风险等级

请回复：
- 已确认，执行
- 或修正意见
```

## 策略修订交接

在 `strategy_update` 中：

1. 读取 `final-shape.md`、`module-map.md`、`roadmap.md`、`decisions.md`、
   `constraints.md` 和相关 `inbox/ideas/*`。
2. 以 `ai/project/proposals/final-shape-updates/_template.md` 为结构模板，
   生成 `ai/project/proposals/final-shape-updates/YYYYMMDD-topic.md`。
3. 停止等待人类确认。不要修改正式方向文件或源码。

结束时使用：

```text
方向修订提案已准备好。

请检查：
- ai/project/proposals/final-shape-updates/YYYYMMDD-topic.md

请回复：
- 确认，合并这个提案
- 或修正意见
```

在执行模式中，读取：

1. `ai/project/project.md`
2. `ai/project/runtime.md`
3. `ai/project/task.md`

然后按 `ai/template/execution-policy.md` 做执行前规划：列出 L1 清单，给每个 L1
标注 Green / Yellow / Red，并写入 `execution_policy.task_tree`。根据 L1 数量自动选择
`normal` 或 `bounded_continuous`。只有 `readiness = ready_to_execute` 才能执行；
如果本轮新建或重写任务契约，先停在确认交接。L1 必须是可独立验收的垂直切片。
执行 L1 前规划 L2，执行 L2 前按需规划 L3；默认最多 3 层，必要时允许 L4。
每完成一个 L1，在清单中打勾并划掉；开始或完成 L1、出现 Red/blocked、范围变化
或最终收尾时写回 `task_tree`。只有 Red 停止等待人类确认；Green 自动继续，Yellow
只做当前 L1/L2 内的局部低风险修正。用户可见输出遵守
`ai/template/execution-policy.md` 的“用户可见输出”规则。最后把结果写入：

- `ai/project/result.json`
- `ai/project/result.md`
- `ai/project/metrics.json`

保持终端输出简短，并遵守 `ai/template/rules/output.md`。
