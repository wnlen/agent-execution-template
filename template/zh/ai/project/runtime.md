# 运行时

## 当前状态

- 阶段：方向层与执行层一致性收口
- 重点：保持文件协议可安装、可升级、可审计，并让项目方向治理与任务执行约束一致。
- 阻塞：无
- 已知风险：
  - 超出当前任务范围
  - 询问人类那些 Agent 可以安全推断的细节
  - 用历史过程笔记污染运行时上下文
  - 没有验证证据就标记成功
  - 在明确权限之外运行命令
  - 只优化 token 节省，而忽略成本可接受前提下的输出质量
  - 方向层已升级但规则、runtime 或 doctor 仍停留在旧语义

## 硬规则

- 当前任务优先。
- 不要扩大范围。
- 不要重写无关文件。
- 不要重复已知背景。
- 不要输出教程。
- 不要把猜测当成事实。
- 先读取相关文件，再做假设。
- 优先做最小且安全的改动。
- 修改后尽可能验证。
- 最终输出保持简短。
- 最小化人类交互；只为范围、风险、权限或验收阻塞项提问。
- 执行前最多问 3 个澄清问题。
- 除非 `ai/project/task.md` 明确允许，不要编辑 `ai/project/runtime.md`。
- 如果 `status = "success"`，`verification.passed` 必须为 `true`。
- 如果验证需要人工检查，除非人工验证已经完成，否则使用 `status = "partial"`。
- 默认使用 `cheap` 执行；只为规划、判断、重复失败或验收争议升级。
- 遵守 `ai/project/task.md.model_policy`；默认 `cheap`，需要判断时升级，并记录原因。

## 项目约束

- 引导读取集从 `ai/template/bootstrap.md`、`ai/template/protocol.md`、`ai/template/rules/core.md`、根目录文档、清单、文档、引用开始；当文档不足时，进行有限源码结构检查。
- 执行读取集是 `ai/template/prompt.md`、`ai/template/protocol.md`、`ai/template/rules/core.md`、`ai/project/project.md`、`ai/project/runtime.md` 和 `ai/project/task.md`。
- `ai/project/refs/` 文件只在任务要求或任务类型触发时加载。
- `ai/project/refs/final-shape.md`、`module-map.md`、`roadmap.md` 属于方向层正式文档。
- 方向层正式文档不能被普通 reconcile 或普通执行任务直接修改。
- 方向修订必须经过 `strategy_update` proposal 和 `apply_strategy_update`。
- 默认永远不读取 `ai/project/archive/`。
- `ai/project/result.json` 是唯一权威的最新结果。
- `ai/project/result.md` 是最新的人类可读摘要。
- `ai/project/metrics.json` 是最新的 token 效率和复用记录。
- 模型档位决策由 `ai/project/task.md.model_policy` 管理，不由临时聊天偏好决定。
- `ai/project/runtime.md` 只保存稳定且当前有效的上下文。
- 历史任务和结果属于 `ai/project/archive/`。

## 当前上下文

这个项目是协议 / 模板，不是复杂 Agent 框架。
当前产品定位是：面向 AI Coding Agent 的项目方向治理 + 可审计任务执行协议。
当前产品目标是减少人类交互频率和输入量，同时让任务随时间变得更精确，并减少长期方向漂移。
允许增加少量服务于协议采用和治理闭环的 CLI；不要引入 UI、云同步或多 Agent 编排。

## 引用路由

- 最终形态 / 北极星 / 任务价值判断 -> `ai/project/refs/final-shape.md`
- 当前模块结构 / 边界 / 依赖方向 -> `ai/project/refs/module-map.md`
- 阶段目标 / 近期路线 / 暂缓事项 -> `ai/project/refs/roadmap.md`
- 架构 / API / 模块边界 -> `ai/project/refs/architecture.md`
- 历史决策 -> `ai/project/refs/decisions.md`
- 安全 / 兼容性 / 性能 / 数据 / 部署 -> `ai/project/refs/constraints.md`
- 构建 / 测试 / 部署命令 -> `ai/project/refs/commands.md`

## 运行时更新治理

除非 `ai/project/task.md` 明确允许，AI 不得直接更新这个文件。
如果任务产生长期有效上下文，将建议写入 `ai/project/result.json.runtime_update`。
通过单独任务应用运行时更新，该任务唯一允许目标是 `ai/project/runtime.md`。
