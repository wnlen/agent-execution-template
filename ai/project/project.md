# 项目

这个文件是 Agent Execution Template 使用的稳定项目身份。
依据根目录 README、`docs/SPEC.md`、`package.json`、`test/*` 和当前仓库结构初始化。
未知事实标记为 `Unknown`。

## 身份

- 名称：Agent Execution Template
- 目的：提供一个可安装、可升级、保护项目现场的 AI Repo Execution Protocol，让 AI Coding Agent 在真实软件仓库内按明确任务契约执行、验证并记录结果。
- 主要用户：
  - 在多个仓库里使用 Codex、Claude Code、Cursor、Aider 或自定义 AI Coding Agent 的开发者。
  - 希望 AI 上下文、任务边界、验收标准和执行记录落到文件里的团队。
  - 想要重复使用 AI 执行协议，但不想引入完整 Agent 平台或多 Agent 调度系统的项目维护者。

## 技术

- 语言：JavaScript / Markdown / JSON Schema
- 框架：无运行时框架；Node.js CLI
- 包管理器：npm
- 测试运行器：Node.js 脚本，通过 `npm test` 运行 `test/selftest.js` 和 `test/check-release.js`

## 结构

- 源码：`bin/agent-execution-template.js`
- 测试：`test/selftest.js`、`test/check-release.js`
- 配置：`package.json`
- 文档：`README.md`、`README.zh-CN.md`、`docs/SPEC.md`、`docs/token-efficient-protocol-v0.1.md`
- 发布模板：`template/zh/ai/**`、`template/en/ai/**`
- Dogfood 工作区：`ai/**`
- 示例：`examples/tasks/**`、`examples/results/**`
- 方向文档：`ai/project/refs/final-shape.md`、`module-map.md`、`roadmap.md`

## 稳定约束

- `ai/template/**` 是可升级、可覆盖、可回流模板仓库的协议区。
- `ai/project/**` 是用户项目现场；`init` 只创建缺失文件，`update` 绝不覆盖它。
- 本项目不是 IDE、Agent 平台、多 Agent 调度器、云服务、workspace/session/sandbox runtime 或具体 AI Coding Agent 的替代品。
- 协议定位是仓库内 AI 执行规则；外部 workspace、session、sandbox、worker 调度应由外部运行时承担。
- 方向变化必须经过 `strategy_update -> human confirm -> apply_strategy_update`，普通执行任务不能直接修改北极星、模块地图或路线图。
- 执行成功必须有验证证据；无验证通过不得标记 `success`。
- 中英文模板文件布局必须一致；`template/zh/ai/template/**`、`template/en/ai/template/**` 和根目录 `ai/template/**` 的一致性由 release check 约束。

## 未知项

- 真实外部用户数量、团队采用方式和高频使用场景：Unknown
- 未来是否提供 OpenClaw 或其他外部运行时的正式集成适配器：Unknown
- 最低支持 Node.js 版本：Unknown

## 备注

这个文件只保存稳定项目身份和长期约定。
项目方向和最终形态放在 `ai/project/refs/final-shape.md`。
当前模块结构放在 `ai/project/refs/module-map.md`。
阶段路线放在 `ai/project/refs/roadmap.md`。
当前执行上下文放在 `ai/project/runtime.md`。
