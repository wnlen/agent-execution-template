<!-- agent-execution-template:start -->
## Agent Execution Template

本仓库已安装 Agent Execution Template，协议位于 `ai/`。
此托管块会有意同时写入 `AGENTS.md` 和 `CLAUDE.md`，用于适配不同 AI 工具的自动发现约定。

强制路由：
- 处理任何项目请求前，必须先读取并遵守 `ai/template/prompt.md`。
- 如果用户说“开始初始化这个项目”或要求初始化/整理项目上下文，在 `ai/template/prompt.md` 完成路由前，不要运行安装命令、不要创建 lockfile、不要编辑业务文件。
<!-- agent-execution-template:end -->
