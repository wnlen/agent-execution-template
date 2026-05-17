<!-- agent-execution-template:start -->
## Agent Execution Template

本仓库已安装 Agent Execution Template，协议位于 `ai/`。
此托管块会有意同时写入 `AGENTS.md` 和 `CLAUDE.md`，用于适配不同 AI 工具的自动发现约定。

强制路由：
- 处理任何项目执行请求前，必须先读取并遵守 `ai/template/prompt.md`。
- 项目工作流由 `/init`、`/reconcile`、`/strategy`、`/continue` 等 slash command 触发。
- 普通问答或设计讨论只做只读回答；除非用户给出 slash command，否则不要进入执行工作流。
<!-- agent-execution-template:end -->
