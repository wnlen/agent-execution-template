# 运行时

## 当前状态

- 阶段：MVP 模板搭建
- 重点：保持 AI 执行层最小、可审计，并且容易复制到任意软件项目。
- 阻塞：无
- 已知风险：
  - 超出当前任务范围
  - 询问人类那些 Agent 可以安全推断的细节
  - 用历史过程笔记污染运行时上下文
  - 没有验证证据就标记成功
  - 在明确权限之外运行命令
  - 只优化 token 节省，而忽略成本可接受前提下的输出质量

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
- 默认永远不读取 `ai/project/archive/`。
- `ai/project/result.json` 是唯一权威的最新结果。
- `ai/project/result.md` 是最新的人类可读摘要。
- `ai/project/metrics.json` 是最新的 token 效率和复用记录。
- 模型档位决策由 `ai/project/task.md.model_policy` 管理，不由临时聊天偏好决定。
- `ai/project/runtime.md` 只保存稳定且当前有效的上下文。
- 历史任务和结果属于 `ai/project/archive/`。

## 当前上下文

这个项目是协议 / 模板，不是复杂 Agent 框架。
MVP 应保持基于文件、工具无关。
在文件协议被真实项目证明有用之前，不要增加 CLI、UI、云同步或多 Agent 编排。
当前产品定位是：面向 AI Coding Agent 的最小可审计执行协议。
当前产品目标是减少人类交互频率和输入量，同时让任务随时间变得更精确。

## 引用路由

- 架构 / API / 模块边界 -> `ai/project/refs/architecture.md`
- 历史决策 -> `ai/project/refs/decisions.md`
- 安全 / 兼容性 / 性能 / 数据 / 部署 -> `ai/project/refs/constraints.md`
- 构建 / 测试 / 部署命令 -> `ai/project/refs/commands.md`

## 运行时更新治理

除非 `ai/project/task.md` 明确允许，AI 不得直接更新这个文件。
如果任务产生长期有效上下文，将建议写入 `ai/project/result.json.runtime_update`。
通过单独任务应用运行时更新，该任务唯一允许目标是 `ai/project/runtime.md`。
