# 决策

在这里记录持久技术决策。

## D001 - 使用 template/project 双区结构

状态：accepted

原因：协议需要可升级，同时不能覆盖用户项目现场。

影响：

- `ai/template/**` 放通用协议，可以由 `update` 覆盖。
- `ai/project/**` 放项目身份、任务、refs、结果和 metrics，不允许 `update` 覆盖。
- `init` 创建缺失项目文件，但保留已有项目现场。

证据：`README.md`、`docs/SPEC.md`

## D002 - 默认中文模板，支持英文模板

状态：accepted

原因：包面向中文用户默认低摩擦安装，同时需要英文项目可用。

影响：

- `init` 默认安装 `template/zh/ai/**`。
- `init --lang en` 安装 `template/en/ai/**`。
- `update` 默认沿用 `ai/template/LANG`，也可显式 `--lang zh|en`。
- release check 要求中英文模板文件布局一致。

证据：`README.md`、`README.zh-CN.md`、`docs/SPEC.md`、`test/check-release.js`

## D003 - 方向变化必须走 strategy_update proposal

状态：accepted

原因：普通执行任务如果直接改北极星、模块地图或路线图，会破坏项目方向治理。

影响：

- 新方向或灵感进入 `ai/project/inbox/ideas/`。
- `strategy_update` 只生成 proposal，不改正式方向文件。
- 人类确认后，`apply_strategy_update` 才能合并正式方向文件。

证据：`README.md`、`docs/SPEC.md`、`ai/template/protocol.md`

## D004 - 引入边界内连续执行

状态：accepted

原因：减少人类交互频率，同时保留 Red 风险门和证据化 checkpoint。

影响：

- `task.md.execution_policy.mode = auto`。
- L1 少于 2 个使用 `normal`，L1 为 2 个或更多自动使用 `bounded_continuous`。
- L1 必须是可独立验收的垂直切片。
- Red 停止确认，Yellow 只允许局部低风险修正。

证据：`README.md`、`docs/SPEC.md`、`ai/template/execution-policy.md`、`ai/project/inbox/processed/授权式连续执行协议.md`

## D005 - Agent Execution Template 不承担外部 runtime 能力

状态：accepted

原因：项目边界是仓库内 AI 执行协议，不是 workspace/session/sandbox runtime 或多 Agent 调度器。

影响：

- 不实现 workspace 切换、多仓库上下文管理、sandbox 生命周期、session fork/rollback 或 worker 调度。
- 与外部运行时集成时，不应把业务任务定义、仓库内文件修改规则、acceptance criteria 或具体编码上下文移出本协议。

证据：`README.md`、`README.zh-CN.md`、`docs/SPEC.md`

## D006 - 使用 Node.js 标准库实现 CLI

状态：accepted

原因：当前 CLI 主要做文件复制、目录检查、JSON/schema 校验和提示输出，标准库足够，能保持包轻量。

影响：

- `bin/agent-execution-template.js` 使用 `fs`、`path` 等标准库。
- `package.json` 当前无生产依赖。
- 复杂度继续增长时，可考虑内部拆分模块，但不应为简单 CLI 引入重框架。

证据：`package.json`、`bin/agent-execution-template.js`
