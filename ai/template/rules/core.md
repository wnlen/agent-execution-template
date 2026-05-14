# 核心规则

## 就绪门

编辑代码前，检查 `ai/project/task.md` 是否清楚定义：

- 目标
- 范围
- 验收
- 权限
- 执行策略

如果未就绪，不要编辑代码。将阻塞结果写入：

- `ai/project/result.json`
- `ai/project/result.md`
- `ai/project/metrics.json`

## 引导门

如果 `ai/project/project.md` 为空、只有占位内容、不完整，或用户要求整理项目上下文，
先执行 `ai/template/bootstrap.md`，再进入执行。

引导模式只能写项目上下文文件：

- `ai/project/project.md`
- `ai/project/refs/final-shape.md`
- `ai/project/refs/module-map.md`
- `ai/project/refs/roadmap.md`
- `ai/project/refs/architecture.md`
- `ai/project/refs/commands.md`
- `ai/project/refs/constraints.md`
- `ai/project/refs/decisions.md`

只有在人类同时提供当前任务目标时，引导模式才可以写 `ai/project/task.md`。
此时只能起草任务契约，不能进入实现。

引导模式不得编辑源码、测试、配置、依赖文件、生成文件、运行时文件、结果文件或指标文件。

写完引导草稿后，使用 `ai/template/bootstrap.md` 中的“引导后交接”停止。
交接必须在聊天里给出可确认摘要和推荐下一步，不要只让人类打开文件检查。
如果人类已经提供当前任务目标，可以同轮起草 `ai/project/task.md`，但仍必须停止等待确认，不能进入实现。

## 引导读取范围

默认只读取高价值项目来源：

- 根目录文档：`README*`、`AGENTS.md`、`CLAUDE.md`、`CONTRIBUTING*`、`CHANGELOG*`
- 清单文件：`package.json`、`pyproject.toml`、`Cargo.toml`、`go.mod`、
  `pom.xml`、`build.gradle*`、`Makefile`
- 项目文档：`docs/**`，优先阅读概览、架构、安装、测试、部署、API、ADR 和决策文件
- 现有 AI 引用：`ai/project/refs/*.md`
- 源码、测试、配置、文档目录的浅层列表
- 如果文档缺失或不足，有限读取可能的入口目录，例如 `src/`、`app/`、`lib/`、
  `packages/`、`services/`、`cmd/`、`internal/`、`server/`、`client/`、
  `test/`、`tests/`

除非用户明确授权或引用，不要读取依赖目录、构建产物、覆盖率输出、密钥文件、
环境文件或归档目录。

## 任务草稿门

如果项目上下文已确认，但 `ai/project/task.md` 为空、只有占位内容、不完整，
或人类提供了新的任务目标，根据已确认的项目上下文起草 `ai/project/task.md`，
并在实现前停止等待人类确认。

任务草稿模式只能写：

- `ai/project/task.md`

任务草稿模式必须以 `ai/template/prompt.md` 中的“任务草稿交接”结束。

## 上下文整合门

如果用户提供新的权威业务、产品、架构或流程资料，并希望合并到既有上下文，
或说“整合 ai/project/inbox/ 里的新资料”，执行 `ai/template/reconcile.md`，
不要重新 bootstrap，也不要全量覆盖。

新资料优先放在：

- `ai/project/inbox/*.md`
- `ai/project/inbox/raw/*.md`
- `docs/**`

已整合资料统一移动到 `ai/project/inbox/processed/`，默认不再触发上下文整合。

上下文整合必须先输出整合计划，等待人类确认后才更新文件。

上下文整合默认只能更新：

- `ai/project/project.md`
- `ai/project/runtime.md`
- `ai/project/refs/*.md`

如果新资料会改变北极星、模块地图或路线图的方向性内容，只能建议创建
`strategy_update` 提案，不能在上下文整合中直接修改：

- `ai/project/refs/final-shape.md`
- `ai/project/refs/module-map.md`
- `ai/project/refs/roadmap.md`

除非人类明确授权，不要修改当前任务、结果、指标、归档、源码、测试、配置或依赖文件。

## 边界内连续执行门

每次执行前，AI 必须读取 `ai/template/execution-policy.md`，先做任务分解和风险判断，
而不是等待用户显式说“启用连续执行”。

硬门禁：

- 只有 `ai/project/task.md.readiness = ready_to_execute` 才能执行；本轮新建或重写
  `task.md` 时必须停在确认交接。
- L1 必须是可独立验收的垂直切片，不是机械步骤清单。
- `execution_policy.task_tree` 必须记录 L1 清单和执行状态。
- 每个任务节点必须有 Green / Yellow / Red 风险评级。
- Yellow 只允许当前 L1/L2 内的局部低风险修正，不能改变公共接口、数据模型、
  权限、安全、架构方向或验收标准。
- 每个 Checkpoint 必须包含证据；不接受只有主观判断的 Green。
- Red 必须停止等待人类确认。
- 任何方向、核心架构、公共 API、持久化数据结构、安全、支付、账号、权限、大量删除、
  核心重写或高成本方案取舍，都必须停止。
- 需要扩大范围、权限、命令、网络或验收时，必须停止。
- `task_tree` 写回应集中在 L1 开始/完成、Red、blocked、范围变化和最终收尾，
  不要为每个微小 L3 操作写回。

目标、范围、验收和权限由 AI 推断，但不能越过项目规则、显式用户限制、
`permission.modify.denied`、安全边界或破坏性操作限制。

## 策略修订门

如果用户要求更新项目北极星、最终形态、产品宪法、模块地图、路线图或项目方向，
或 `ai/project/inbox/ideas/` 中存在 `.gitkeep` 之外的新灵感，执行
`strategy_update`。

`strategy_update` 只能：

- 读取正式方向文档、决策、约束和灵感输入；
- 以 `ai/project/proposals/final-shape-updates/_template.md` 为结构模板；
- 创建 `ai/project/proposals/final-shape-updates/YYYYMMDD-topic.md`；
- 将新提案状态写为 `proposed`；
- 停止等待人类确认。

它不能直接修改正式方向文档、源码、测试、配置或依赖文件。

只有人类明确确认某个 proposal 后，才可以执行 `apply_strategy_update`。
应用时：

- 被确认的提案应从 `proposed` 更新为 `accepted`，或已经是 `accepted`；
- 合并完成后，将提案更新为 `applied` 并填写 `applied_at`；
- 如果人类拒绝提案，保留文件并将 `status` 更新为 `rejected`；
- 只应用已确认内容，不顺手扩展新方向。

## 风险门

编辑代码或运行命令前，检查任务是否涉及：

- 数据迁移
- 认证 / 授权
- 支付 / 短信 / 外部回调
- 公共 API 变更
- 生产部署
- 大范围重构
- 不可逆或破坏性操作

如果风险高且 `ai/project/task.md` 中未明确授权，停止并写入阻塞结果。

## 引用加载

只在需要时，或 `ai/project/task.md` 要求时读取引用文件：

- 最终形态 / 北极星 / 任务价值判断 -> `ai/project/refs/final-shape.md`
- 当前模块结构 / 边界 / 依赖方向 -> `ai/project/refs/module-map.md`
- 阶段目标 / 近期路线 / 暂缓事项 -> `ai/project/refs/roadmap.md`
- 架构 / API / 模块边界 -> `ai/project/refs/architecture.md`
- 历史决策 -> `ai/project/refs/decisions.md`
- 安全 / 兼容性 / 性能 / 数据 / 部署 -> `ai/project/refs/constraints.md`
- 构建 / 测试 / 运行 / 部署命令 -> `ai/project/refs/commands.md`

在 `ai/project/result.json.refs_read` 中记录每个已读取引用及原因。

## 执行规则

- 当前任务优先。
- 不要扩大范围。
- 不要扫描无关文件。
- 不要重写无关模块。
- 先读文件，再做判断。
- 只修改 `ai/project/task.md` 允许的文件。
- 只运行 `ai/project/task.md` 和 `ai/project/refs/commands.md` 允许的命令。
- 优先做最小且安全的改动。
- 在 `ai/project/result.json` 中记录假设。
- 尽可能验证。
- 除非验证通过，不要标记 `status = "success"`。
- 除非 `ai/project/task.md` 明确允许，不要编辑 `ai/project/runtime.md`。
- 如果需要更新运行时上下文，在 `ai/project/result.json.runtime_update` 中提出建议。

## 运行时治理

`ai/project/runtime.md` 只存放稳定且当前有效的执行上下文。
它不是项目日志。历史任务和结果应放在 `ai/project/archive/`。
