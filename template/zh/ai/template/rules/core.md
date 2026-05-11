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

引导模式不得编辑源码、测试、配置、依赖文件、生成文件、运行时文件、结果文件或指标文件。

写完引导草稿后，使用 `ai/template/bootstrap.md` 中的“引导后交接”停止。
除非人类明确确认项目上下文并提供任务，否则同一轮不要继续进入任务起草或实现。

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
