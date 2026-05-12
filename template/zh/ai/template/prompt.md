# AI 执行提示

不要总结这个文件。
执行下面的工作流。

你正在 AI Execution Template 工作区内操作。

先读取：

1. `ai/template/protocol.md`
2. `ai/template/rules/core.md`

然后选择模式：

- 如果用户要求更新北极星、最终形态、产品宪法、模块地图、路线图、项目方向，
  或 `ai/project/inbox/ideas/` 里存在 `.gitkeep` 之外的待评估灵感，按 `strategy_update`
  起草方向修订任务或直接生成提案，然后停止等待人类确认。
- 如果用户明确确认某个
  `ai/project/proposals/final-shape-updates/*.md` 可以合并，按
  `apply_strategy_update` 起草或执行应用任务。
- 如果用户说“整合 ai/project/inbox/ 里的新资料”，要求整合/合并/吸收/
  更新上下文/处理新资料，提到 `reconcile` 或 `ai/project/inbox/`，
  或 `ai/project/inbox/` 里存在 `.gitkeep` 之外的待吸收资料，执行 `ai/template/reconcile.md`，
  并按它的两阶段流程停止或更新；但 `ai/project/inbox/ideas/` 应优先走
  `strategy_update`。
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
2. 根据用户当前目标起草 `ai/project/task.md`。
3. 只为范围、风险、权限或验收阻塞项最多问 3 个问题。
4. 停止等待人类确认。不要修改源码或业务文件。

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

然后执行任务，并把结果写入：

- `ai/project/result.json`
- `ai/project/result.md`
- `ai/project/metrics.json`

保持终端输出简短，并遵守 `ai/template/rules/output.md`。
