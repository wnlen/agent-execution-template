# AI 执行引导

不要总结这个文件。
执行下面的引导流程。

你正在为 AI Execution Template 整理项目上下文。

目标：建立后续任务会依赖的稳定项目理解。
这是发现与确认步骤，不是实现步骤。

你的任务是检查项目，创建或更新 `ai/project/project.md`
以及相关的 `ai/project/refs/*`，然后在“引导后交接”处停止。

## 先读

1. `ai/template/protocol.md`
2. `ai/template/rules/core.md`
3. 现有的 `ai/project/project.md`
4. 如果存在，读取现有的 `ai/project/refs/*.md`

## 引导任务

创建或更新：

- `ai/project/project.md`
- 能推断项目方向、最终形态或任务价值判断时，更新 `ai/project/refs/final-shape.md`
- 能推断模块职责、边界或依赖方向时，更新 `ai/project/refs/module-map.md`
- 能推断阶段目标、近期路线或暂缓事项时，更新 `ai/project/refs/roadmap.md`
- 能推断架构时，更新 `ai/project/refs/architecture.md`
- 能推断运行、测试、构建命令时，更新 `ai/project/refs/commands.md`
- 能推断约束时，更新 `ai/project/refs/constraints.md`
- 只有存在持久决策证据时，更新 `ai/project/refs/decisions.md`

只有在人类同时提供当前任务时，才创建 `ai/project/task.md`。
如果创建了 `ai/project/task.md`，只起草任务契约，不进入执行。

引导期间不要编辑源码、测试、应用配置、依赖文件、生成文件、
运行时文件、结果文件或指标文件。

## 阅读顺序

按下面顺序读取高价值项目证据：

1. 根目录文档：`README*`、`AGENTS.md`、`CLAUDE.md`、`CONTRIBUTING*`、`CHANGELOG*`
2. 清单文件：`package.json`、`pyproject.toml`、`Cargo.toml`、`go.mod`、
   `pom.xml`、`build.gradle*`、`Makefile`
3. 项目文档：`docs/**`，优先阅读概览、架构、安装、测试、部署、API、ADR 和决策文件
4. 现有 AI 引用：`ai/project/refs/*.md`
5. 源码、测试、配置和文档目录的浅层仓库结构

如果文档和清单缺失或不足，可以有限读取代码进行推断：

- 先检查顶层目录和文件名；
- 检查可能的入口目录，例如 `src/`、`app/`、`lib/`、`packages/`、
  `services/`、`cmd/`、`internal/`、`server/`、`client/`、`test/`、`tests/`；
- 只读取足够识别项目目的、模块边界、命令和约束的路由、模块、配置和测试文件；
- 除非人类明确授权，不要读取整个代码库。

除非人类明确引用或授权，不要读取依赖目录、构建产物、覆盖率输出、锁文件
（推断包管理器除外）、密钥文件、环境文件或归档目录。

## 确认维度

读取后，总结并请人类确认或修正这些点：

- 项目名称、目的和主要用户；
- 一句话定位、最终形态和任务是否值得做的判断标准；
- 当前模块地图、模块边界和依赖方向；
- 当前阶段、近期路线和当前阶段不做什么；
- 技术栈、包管理器和测试运行器；
- 源码、测试、配置和文档布局；
- 主要模块和边界；
- 重要的运行、构建、测试和验证命令；
- 持久约束、安全边界、兼容性要求和高风险区域；
- 会影响后续任务精度的未知项。

一次最多问 3 个问题。只问答案会改变项目身份、命令、边界、约束、风险、
权限或验收的问题。

## 输出规则

- 未知事实标记为 `Unknown`；不要把猜测当成事实。
- 对 `final-shape.md`、`module-map.md`、`roadmap.md` 的初始化内容必须标明证据来源；
  如果证据不足，保持占位或写 `Unknown`，不要编造愿景。
- 有帮助时，在相关文件中记录证据来源。
- 保持 `ai/project/project.md` 稳定、长期有效。
- 保持 `ai/project/refs/*.md` 聚焦；不要把引用文件写成项目流水账。
- 写完草稿并请求确认后停止。
- 不要在同一轮执行实现工作。

## 引导后交接

写完项目上下文草稿后，不要只要求人类打开文件检查。
你必须在最终回复中给出可确认摘要，让人类可以直接在聊天里确认或修正。

如果人类在引导请求中已经给出当前任务目标，你必须同时起草 `ai/project/task.md`，
并把项目理解摘要和任务草稿摘要一起交给人类确认。

如果人类没有给出当前任务目标，你必须根据项目现状推荐下一步最值得做的任务。

最终回复必须使用这个结构之一。

当没有当前任务目标时：

```text
引导已完成，我已写入项目上下文。

我对项目的理解：
- 项目：
- 技术栈：
- 主要模块：
- 北极星：
- 路线图：
- 常用命令：
- 重要约束：
- 仍不确定：最多 3 条；没有则写“无”

我建议下一步做：
1. 优先任务：
   原因：
2. 备选任务：
   原因：

已写入：
- ai/project/project.md
- ai/project/refs/final-shape.md
- ai/project/refs/module-map.md
- ai/project/refs/roadmap.md
- ai/project/refs/architecture.md
- ai/project/refs/commands.md
- ai/project/refs/constraints.md
- ai/project/refs/decisions.md

请直接回复：
- 确认，按建议 1 起草任务
- 确认，但改做：<一句话任务>
- 修正：<你要改的地方>
```

当已经有当前任务目标时：

```text
引导已完成，我已同时写入项目上下文和任务草稿。

我对项目的理解：
- 项目：
- 技术栈：
- 主要模块：
- 北极星：
- 路线图：
- 常用命令：
- 重要约束：
- 仍不确定：最多 3 条；没有则写“无”

任务草稿摘要：
- 目标：
- 范围：
- 不做：
- 验收：
- 风险：
- 需要权限：

已写入：
- ai/project/project.md
- ai/project/refs/final-shape.md
- ai/project/refs/module-map.md
- ai/project/refs/roadmap.md
- ai/project/refs/architecture.md
- ai/project/refs/commands.md
- ai/project/refs/constraints.md
- ai/project/refs/decisions.md
- ai/project/task.md

请直接回复：
- 确认，执行
- 修正：<你要改的地方>
```

如果仍有重要未知项，只在“仍不确定”中列出最多 3 条。
不要让人类主动去文件管理器里寻找问题；文件路径只作为可追溯记录。
