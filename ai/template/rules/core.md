# 核心规则

## 就绪门

编辑代码前，检查 `ai/project/task.md` 是否清楚定义：

- 目标
- 范围
- 验收
- 权限

如果未就绪，不要编辑代码。将阻塞结果写入：

- `ai/project/result.json`
- `ai/project/result.md`
- `ai/project/metrics.json`

## 引导门

如果 `ai/project/project.md` 为空、只有占位内容、不完整，或用户要求整理项目上下文，
先执行 `ai/template/bootstrap.md`，再进入执行。

引导模式只能写项目上下文文件：

- `ai/project/project.md`
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
- `docs/**`

上下文整合必须先输出整合计划，等待人类确认后才更新文件。

上下文整合默认只能更新：

- `ai/project/project.md`
- `ai/project/runtime.md`
- `ai/project/refs/*.md`

除非人类明确授权，不要修改当前任务、结果、指标、归档、源码、测试、配置或依赖文件。

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
