# AI 执行提示

不要总结这个文件。
按下面流程执行。你正在 Agent Execution Template 工作区内操作。

本文件只负责路由。项目工作流必须由 slash command 触发；普通问答、协议解释、
设计讨论或只读咨询只读取回答所需文件，不进入 bootstrap / reconcile / strategy /
execution，不写 `ai/project/task.md`、`ai/project/result.*` 或
`ai/project/metrics.json`。

## Slash Commands

正式入口：

- `/init`
- `/init-with-inbox`
- `/reconcile`
- `/strategy`
- `/apply-strategy`
- `/continue`
- `/next`
- `/doctor`
- `/update`
- `/refresh`
- `/improve-context`
- `/help`

如果用户没有给出 slash command，但明确要求实现、修复、修改、提交、发布或执行项目任务，
按 `/continue` 的执行入口处理；否则保持只读回答。

## 路由

收到 slash command 后，先读取最小状态：

1. `ai/project/project.md`（如果存在）
2. `ai/project/task.md`（如果存在）
3. `ai/project/inbox/`、`ai/project/inbox/ideas/` 和
   `ai/project/proposals/final-shape-updates/` 的浅层列表

然后选择模式：

- `/help`：只读展示 slash command 列表和用途，不修改文件。
- `/next`：只读判断下一步。优先提示待确认方向提案、待处理 ideas、待吸收 inbox、
  待初始化上下文、待确认任务、失败结果或继续执行入口；不修改文件。
- `/doctor`：如果当前任务契约允许运行命令，可运行
  `node bin/agent-execution-template.js doctor` 或项目约定的 doctor 命令；否则只提示用户运行
  `npx -y @wnlen/agent-execution-template doctor`。
- `/update`：如果当前任务契约明确允许更新协议，可运行 update；否则只提示用户运行
  `npx -y @wnlen/agent-execution-template update`。
- `/refresh` 或 `/improve-context`：如果当前任务契约明确允许重整上下文，可执行 refresh；
  否则只提示用户运行 `npx -y @wnlen/agent-execution-template refresh`。
- `/init`：执行 `ai/template/bootstrap.md`，初始化项目上下文，写完上下文确认后停止。
- `/init-with-inbox`：先检查 `ai/project/project.md`。若已存在且有效，执行
  `ai/template/reconcile.md`，不要重新 bootstrap；若为空、占位或不完整，执行
  `ai/template/bootstrap.md`，并把 `ai/project/inbox/*.md` 与
  `ai/project/inbox/raw/*.md` 纳入引导输入；上下文确认后停止。
- `/reconcile`：执行 `ai/template/reconcile.md`。默认只处理
  `ai/project/inbox/*.md` 和 `ai/project/inbox/raw/*.md`；`processed/` 不触发整合，
  `ideas/` 优先走 `/strategy`。
- `/strategy`：读取 `ai/template/protocol.md`、`ai/template/rules/core.md` 和相关方向 refs，
  走 `strategy_update`，生成提案后停下确认。
- `/apply-strategy`：读取 `ai/template/protocol.md` 和 `ai/template/rules/core.md`，
  只应用人类已经明确确认的 proposal。若 proposal 仍为 `proposed`，先改为 `accepted`。
- `/continue`：如果 `ai/project/project.md` 为空、占位或不完整，先执行 `/init`。
  如果 `ai/project/task.md` 为空、占位或不完整，按当前目标和已确认上下文起草任务，
  然后停下确认。只有当 `project.md` 和 `task.md` 足以定义身份、目标、范围、权限和验收时，
  才读取 `ai/template/protocol.md`、`ai/template/rules/core.md`、
  `ai/template/execution-policy.md` 并进入执行模式。

## 任务草稿交接

在任务草稿模式中：

1. 读取已确认的 `ai/project/project.md` 和相关 `ai/project/refs/*.md`。
2. 根据用户目标、项目上下文和仓库事实推断目标、范围、验收、权限、验证方式和初始风险；
   不要求用户逐项提供。
3. 起草 `ai/project/task.md`。单 L1、Green、低风险任务默认使用 compact task contract：
   只写目标、范围、验收、权限、验证命令和最小 `execution_policy.task_tree`。
   多 L1、Yellow/Red、跨模块、连续执行或高不确定任务才使用 expanded task contract。
4. 执行前列出 L1 清单并标注 Green / Yellow / Red，写入 `execution_policy.task_tree`。
   L1 < 2 用 `normal`；L1 >= 2 自动用 `bounded_continuous`。完整默认规则由
   `ai/template/execution-policy.md` 承载，不要把 `checkpoint_budget`、`model_policy`
   等内部控制字段机械复制到简单任务草稿里。
5. 本轮新建或重写 `task.md` 时，将 `readiness` 设为 `draft_for_confirmation` 并停止；
   草稿不能直接执行。
6. 只有既有任务为 `ready_to_execute` 且无 Red 预检项，才进入执行；否则设为 `blocked`。
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
- /continue
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
- /apply-strategy
- 或修正意见
```

在执行模式中，读取：

1. `ai/project/project.md`
2. `ai/project/runtime.md`
3. `ai/project/task.md`

然后按 `ai/template/execution-policy.md` 规划：列 L1，标注 Green / Yellow / Red，
写入 `execution_policy.task_tree`，并按 L1 数量选择 `normal` 或 `bounded_continuous`。
只有 `readiness = ready_to_execute` 才能执行；本轮新建或重写任务契约时先停下确认。
L1 必须是可独立验收的垂直切片。执行 L1 前规划 L2，执行 L2 前按需规划 L3；
默认最多 3 层，必要时允许 L4。每完成一个 L1，在清单中打勾并划掉；仅在 L1
开始/完成、Red/blocked、范围变化或最终收尾时写回 `task_tree`。Red 停止确认；
Green 自动继续；Yellow 只做当前 L1/L2 内的局部低风险修正。用户可见输出遵守
“用户可见输出”规则。最后写入：

- `ai/project/result.json`
- `ai/project/result.md`
- `ai/project/metrics.json`

保持终端输出简短，并遵守 `ai/template/rules/output.md`。
