# AI 执行引导

不要总结这个文件。
按下面流程整理项目上下文。

目标：建立后续任务依赖的稳定项目理解。这是发现与确认，不是实现。

检查项目，创建或更新 `ai/project/project.md` 和相关 `ai/project/refs/*`，
然后在“引导后交接”处停止。

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

只有人类同时提供当前任务时，才创建 `ai/project/task.md`。只起草任务契约，不执行。

引导期间不要编辑源码、测试、配置、依赖、生成文件、运行时、结果或指标文件。

## 阅读顺序

按下面顺序读取高价值项目证据：

1. 根目录文档：`README*`、`AGENTS.md`、`CLAUDE.md`、`CONTRIBUTING*`、`CHANGELOG*`
2. 清单文件：`package.json`、`pyproject.toml`、`Cargo.toml`、`go.mod`、
   `pom.xml`、`build.gradle*`、`Makefile`
3. 项目文档：`docs/**`，优先阅读概览、架构、安装、测试、部署、API、ADR 和决策文件
4. 现有 AI 引用：`ai/project/refs/*.md`
5. 源码、测试、配置和文档目录的浅层仓库结构

文档和清单不足时，可有限读取代码推断：

- 先检查顶层目录和文件名；
- 检查可能的入口目录，例如 `src/`、`app/`、`lib/`、`packages/`、
  `services/`、`cmd/`、`internal/`、`server/`、`client/`、`test/`、`tests/`；
- 只读取足够识别目的、模块边界、命令和约束的路由、模块、配置和测试文件；
- 除非人类明确授权，不要读取整个代码库。

除非人类明确引用或授权，不要读取依赖目录、构建产物、覆盖率输出、锁文件
（推断包管理器除外）、密钥文件、环境文件或归档目录。

## 确认维度

读取后，请人类确认或修正：

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

最多问 3 个问题。只问会改变身份、命令、边界、约束、风险、权限或验收的问题。

## 输出规则

- 未知事实标记为 `Unknown`；不要把猜测当成事实。
- 若本次吸收 `ai/project/inbox/*.md` 或 `ai/project/inbox/raw/*.md`，写入上下文后移到
  `ai/project/inbox/processed/`，保留相对路径：`ai/project/inbox/raw/file.md` ->
  `ai/project/inbox/processed/raw/file.md`。文件名冲突时加日期或序号。不要移动
  `ai/project/inbox/ideas/**`。
- 未吸收资料必须留在原位置，并在最终回复中说明原因。
- `final-shape.md`、`module-map.md`、`roadmap.md` 的初始化内容必须标明证据来源；
  证据不足时保持占位或写 `Unknown`，不要编造愿景。
- 有帮助时，在相关文件中记录证据来源。
- 保持 `ai/project/project.md` 稳定、长期有效。
- 保持 `ai/project/refs/*.md` 聚焦；不要把引用文件写成项目流水账。
- 写完草稿并请求确认后停止。
- 不要在同一轮执行实现工作。

## 引导后交接

写完上下文草稿后，不要只要求人类打开文件检查。最终回复必须给出可确认摘要，
让人类能直接在聊天里确认或修正。

如果引导请求已包含当前任务目标，必须同时起草 `ai/project/task.md`，
并交付项目理解摘要和任务草稿摘要。

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

已吸收资料：
- file；没有则写“无”

未吸收资料：
- file：原因；没有则写“无”

冲突处理：
- 冲突或取舍；没有则写“无”

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

已吸收资料：
- file；没有则写“无”

未吸收资料：
- file：原因；没有则写“无”

冲突处理：
- 冲突或取舍；没有则写“无”

请直接回复：
- 确认，执行
- 修正：<你要改的地方>
```

重要未知项只在“仍不确定”中列最多 3 条。
不要让人类主动去文件管理器里寻找问题；文件路径只作为可追溯记录。
