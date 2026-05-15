# 项目北极星说明书

这个文件是项目方向的宪法层，也可以叫 Product Constitution / Final Shape Spec。
它稳定保存项目最终形态和判断标准，但允许通过明确流程修订。

普通执行任务不能直接修改本文件。新的灵感应先进入 `ai/project/inbox/ideas/`，
再通过 `strategy_update` 生成提案，经人类确认后，由 `apply_strategy_update` 合并。

## 一句话定位

Agent Execution Template 是一个 30 秒可安装、可升级、保护用户项目现场的 AI Repo Execution Protocol。

证据：`README.md`、`README.zh-CN.md`、`docs/SPEC.md`

## 本质问题

AI Coding Agent 已经足够强，但多数仓库仍用松散聊天上下文驱动执行，导致项目背景重复解释、任务边界漂移、风险和验收隐含、验证记录不可靠、执行历史丢失，以及模板升级误伤项目上下文。

证据：`README.zh-CN.md` 的“为什么需要它”、`docs/SPEC.md` 的“解决的问题”

## 目标用户

- 经常在多个仓库里使用 AI Coding Agent 的开发者。
- 需要可复用、可审计 AI 执行流程，但不想引入完整 Agent 平台的团队。
- 希望 AI 上下文、任务契约、验收和执行记录存在于仓库文件中的维护者。
- 默认使用便宜模型、只在关键判断点升级模型的工作流使用者。

证据：`README.md` / `README.zh-CN.md` 的 Designed For / 适合谁

## 核心痛点

- 项目上下文和当前任务意图散落在聊天记录中。
- `project.md` / `task.md` 这类关键上下文经常需要人手写。
- AI 容易越过任务范围，修改无关文件或在风险不明时继续执行。
- 修改完成后缺少可靠验证、可复盘结果和机器可读事实。
- 项目长期方向、模块边界和当前任务之间缺少明确门禁。

证据：`README.zh-CN.md`、`docs/SPEC.md`

## 最终产品形态

一个 npm 发布的双语模板包，提供：

- `agent-execution-template` CLI；
- 可安装到任意仓库的 `ai/template/**` 可复用协议；
- 受保护的 `ai/project/**` 项目现场；
- bootstrap、reconcile、strategy update、task execution 和 result/metrics 闭环；
- 中英双语模板；
- 自测和 release consistency 检查。

证据：`package.json`、`docs/SPEC.md`、`README.md`

## 当前阶段不做什么

- 不做 IDE。
- 不做 Agent 平台。
- 不做多 Agent 调度器。
- 不做 workspace / sandbox / session runtime。
- 不做多仓库上下文管理器。
- 不做云同步。
- 不做生产部署或发布流水线。
- 不替代 Codex、Claude Code、Cursor、Aider 或其他 AI Coding Agent。

证据：`README.md` / `README.zh-CN.md` 的 Not This / 它不是什么、`docs/SPEC.md` 的“当前能力边界”

## 核心模块边界

- CLI：负责安装、升级、检查、刷新和打印下一步提示。
- 模板协议区：负责通用 AI 执行协议、引导、任务执行、整合、输出和 schema。
- 项目现场区：负责单个仓库的项目身份、运行上下文、任务、结果、metrics、refs、inbox 和 proposals。
- 测试与发布检查：负责验证 CLI 契约、模板结构、中英文布局和版本一致性。

证据：`docs/SPEC.md` 的目录结构、CLI 命令、自测与发布检查；`test/selftest.js`、`test/check-release.js`

## 长期护城河

- repo-local 文件协议比聊天提示词更稳定、可审计、可复用。
- `template/project` 双区设计保护用户现场，同时允许协议持续升级。
- 方向层和任务层分离，避免普通执行任务顺手改项目宪法。
- 双语模板和 Agent 无关设计降低接入门槛。
- 结果、metrics 和 schema 让执行事实可被机器检查。

证据：`README.md`、`docs/SPEC.md`

## 任务是否值得做的判断标准

- 是否强化“仓库内 AI 执行协议”定位，而不是滑向 Agent 平台、调度器或外部 runtime。
- 是否减少人类重复输入，同时保持 scope、risk、permission、acceptance 清晰。
- 是否保护 `ai/project/**` 不被模板升级覆盖。
- 是否让执行更可验证、可复盘、可审计。
- 是否改善中英文模板一致性、CLI 使用体验或 release consistency。
- 是否服务方向层、任务契约、验证证据或模型分工闭环。

## 项目是否跑偏的判断标准

- 开始实现 workspace 切换、session 生命周期、worker 调度、多仓库上下文管理或云平台能力。
- 普通任务绕过 proposal 流程直接修改北极星、模块地图或路线图。
- `update`、`init` 或其他命令覆盖用户 `ai/project/**` 现场。
- 文档、模板、CLI 和测试之间出现版本或语义不一致。
- 引入复杂框架或 UI，但没有直接增强仓库内执行协议。
- 将验证、风险、权限或验收重新隐回聊天上下文。

## 修订规则

- 灵感不能直接改本文件。
- AI 不能在普通执行任务中顺手改本文件。
- 修改必须经过 `proposal -> review -> human confirm -> update`。
- 已确认修改应同步评估 `module-map.md`、`roadmap.md`、`decisions.md` 和 `constraints.md`。
