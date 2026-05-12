# 协议

AI Execution Template v0.8 将可复用协议和项目专属执行上下文分开。

```text
ai/template/ = 可复用执行协议
ai/project/  = 当前项目执行工作区
```

`template` 是协议，`project` 是现场工作区。

项目现场不仅保存当前任务，也保存方向层。方向层用于回答“为什么做、往哪里长”，
执行层用于回答“这次做什么、如何验收”。

```text
ai/project/refs/final-shape.md = 项目北极星说明书
ai/project/refs/module-map.md  = 当前模块地图
ai/project/refs/roadmap.md     = 阶段路线图
ai/project/task.md             = 当前执行契约
```

## 执行流程

```text
项目引导 / 上下文整合 / 策略修订 -> 项目确认 -> 任务草稿 -> 任务确认 -> 计划 -> 执行 -> 复核 -> 结果
```

1. 项目发现时，执行 `ai/template/bootstrap.md`；不要总结它。
2. 引导结束时使用“引导后交接”，在聊天里给出可确认摘要和推荐下一步，
   不要只要求人类打开文件检查。
3. 任务执行时，执行 `ai/template/prompt.md`；不要总结它。
4. 当出现新的权威资料时，放入 `ai/project/inbox/`，执行 `ai/template/reconcile.md`；
   不要总结它。整合必须先出计划，等确认后再更新上下文。
5. 当出现会改变项目最终形态、模块边界或路线图的灵感时，先放入
   `ai/project/inbox/ideas/`，再创建 `strategy_update` 任务生成提案。
6. 只有人类确认提案后，才能创建 `apply_strategy_update` 任务修改
   `final-shape.md`、`module-map.md` 或 `roadmap.md`。
7. 如果 `ai/project/task.md` 缺失或不完整，根据当前目标和已确认的项目上下文起草它，
   然后用“任务草稿交接”停止。
8. 任务确认后，检查就绪度、风险、模型策略、引用、权限和验收。
9. 只在项目任务边界内执行。
10. 写入 `ai/project/result.json`、`ai/project/result.md` 和 `ai/project/metrics.json`。

## 引导模式

引导模式准备稳定的项目理解：

- `ai/project/project.md`
- `ai/project/refs/*.md`

当 `ai/project/project.md` 为空、只有占位内容、过期、不完整，或用户要求整理项目上下文时，
使用引导模式。

引导模式必须：

- 先只读取批准的引导来源；
- 将稳定项目事实总结到 `ai/project/project.md`；
- 当能推断持久架构、命令、约束或决策事实时，更新聚焦的引用文件；
- 只有在人类同时提供当前任务时，才创建 `ai/project/task.md`，且只起草任务契约；
- 将未知事实标记为 `Unknown`，不要猜测；
- 只有答案会改变范围、风险、权限或验收时，最多问 3 个问题；
- 写完项目上下文草稿后停止；如果已提供当前任务，也可以同时写任务草稿后停止；
- 永远不要编辑源码、业务、配置、依赖或生成文件。

### 引导读取范围

按下面顺序读取高价值来源：

1. 根目录文档：
   - `README*`
   - `AGENTS.md`
   - `CLAUDE.md`
   - `CONTRIBUTING*`
   - `CHANGELOG*`
2. 包和构建元数据：
   - `package.json`
   - `pyproject.toml`
   - `Cargo.toml`
   - `go.mod`
   - `pom.xml`
   - `build.gradle*`
   - `Makefile`
3. 项目文档：
   - `docs/**`
   - 优先阅读概览、架构、安装、测试、部署、API、ADR 和决策文件。
4. 现有 AI 上下文：
   - `ai/project/refs/*.md`
5. 浅层仓库结构：
   - 只查看源码、测试、配置和文档目录。

如果文档和清单缺失或不足，可以有限读取代码进行推断：

- 先检查顶层目录和文件名；
- 检查可能的入口目录，例如 `src/`、`app/`、`lib/`、`packages/`、
  `services/`、`cmd/`、`internal/`、`server/`、`client/`、`test/`、`tests/`；
- 只读取足够识别项目目的、模块边界、命令和约束的路由、模块、配置和测试文件；
- 除非人类明确授权，不要读取整个代码库。

默认不要读取：

- `node_modules`、`vendor`、`.venv` 等依赖目录；
- `dist`、`build`、`target`、`coverage` 等生成输出；
- 锁文件，除非用于推断包管理器；
- `.env*` 等密钥或环境文件；
- 归档或历史目录，除非用户明确引用。

如果仓库很大，先读取根目录文档和清单文件，再询问是否扩展读取范围。

### 引导输出

`ai/project/project.md` 应包含长期有效的项目身份：

- 名称、目的和主要用户；
- 语言、框架、包管理器和测试运行器；
- 源码、测试、配置和文档布局；
- 稳定约束、约定和重要未知项。

`ai/project/refs/*.md` 应包含聚焦的持久上下文：

- 项目北极星、最终形态和任务价值判断标准；
- 当前模块地图、阶段路线和方向约束；
- 架构和模块边界；
- 运行、构建、测试和验证命令；
- 安全、兼容性、性能、数据和部署约束；
- 只有存在证据时才记录的决策。

推荐路由：

```text
最终形态 / 北极星 / 任务价值判断 -> ai/project/refs/final-shape.md
当前模块结构 / 边界 / 依赖方向     -> ai/project/refs/module-map.md
阶段目标 / 近期路线 / 暂缓事项     -> ai/project/refs/roadmap.md
架构 / API / 技术模块边界          -> ai/project/refs/architecture.md
命令 / 验证方式                    -> ai/project/refs/commands.md
不可破坏约束                       -> ai/project/refs/constraints.md
已确认关键决策                     -> ai/project/refs/decisions.md
```

写完草稿后，使用 `ai/template/bootstrap.md` 中的“引导后交接”停止。
如果人类没有提供当前任务，必须推荐下一步最值得做的任务。
如果人类已经提供当前任务，可以同时起草 `ai/project/task.md`，但不要执行。

## 任务草稿模式

任务草稿模式准备当前执行契约：

- `ai/project/task.md`

当项目上下文已确认，但 `ai/project/task.md` 为空、只有占位内容、不完整，
或人类提供了新的任务目标且引导模式尚未起草任务时，使用任务草稿模式。

任务草稿模式应该：

- 读取已确认的 `ai/project/project.md`；
- 读取相关 `ai/project/refs/*.md`；
- 将当前人类目标转换为任务类型、优先级、风险、范围、权限、命令策略、
  模型策略和验收标准；
- 只为范围、风险、权限或验收阻塞项最多问 3 个问题；
- 写完任务草稿后，使用 `ai/template/prompt.md` 中的“任务草稿交接”停止；
- 永远不要编辑源码或业务文件。

## 上下文整合模式

上下文整合模式吸收新的权威资料，并修正现有长期上下文。

新资料优先放入：

- `ai/project/inbox/*.md`
- `docs/**`

用户可以直接说“整合 ai/project/inbox/ 里的新资料”。使用上下文整合模式时，
执行 `ai/template/reconcile.md`。

上下文整合模式必须：

- 读取现有 `ai/project/project.md`、`ai/project/runtime.md` 和 `ai/project/refs/*.md`；
- 读取人类指定的新资料；未指定时读取 `ai/project/inbox/*.md`；
- 先输出整合计划，不修改文件；
- 等人类确认后，才更新 `ai/project/project.md`、`ai/project/runtime.md` 和 `ai/project/refs/*.md`；
- 不要默认修改 `task.md`、`result.*`、`metrics.json`、源码、测试、配置或依赖文件；
- 不要把新资料整段塞进 refs，而是吸收长期有效、结构化、可复用的事实。

如果新资料会改变 `final-shape.md`、`module-map.md` 或 `roadmap.md` 的方向性内容，
上下文整合只能提出 `strategy_update` 建议，不能直接修改这些文件。

## 策略修订模式

策略修订模式处理项目方向、最终形态、模块边界或路线图的变更。

使用场景：

- `ai/project/inbox/ideas/` 中出现新的产品、业务、架构或方向灵感；
- 用户要求更新北极星、最终形态、产品宪法、模块地图或路线图；
- 普通任务发现当前执行目标可能与项目方向冲突。

### `strategy_update`

`strategy_update` 只生成提案，不写代码，不修改正式方向文件。

必须读取：

- `ai/project/refs/final-shape.md`
- `ai/project/refs/module-map.md`
- `ai/project/refs/roadmap.md`
- `ai/project/refs/decisions.md`
- `ai/project/refs/constraints.md`
- 人类指定的新资料；未指定时读取 `ai/project/inbox/ideas/*`

输出到：

```text
ai/project/proposals/final-shape-updates/YYYYMMDD-topic.md
```

应以 `ai/project/proposals/final-shape-updates/_template.md` 为结构模板。

提案必须包含：

1. 新灵感摘要
2. 与当前 `final-shape.md` 的一致点
3. 冲突点
4. 应该吸收的部分
5. 应该拒绝的部分
6. 对模块地图的影响
7. 对路线图的影响
8. 建议修改 diff
9. 风险
10. 是否推荐合并

阶段结束后停止，等待人类确认。不要修改 `final-shape.md`、`module-map.md`、
`roadmap.md`、源码、测试、配置或依赖文件。

### `apply_strategy_update`

`apply_strategy_update` 只负责应用已经确认的提案。

必须满足：

- 人类明确确认某个 proposal 可以合并；
- proposal 状态已经是 `accepted`，或在执行前根据人类明确确认从
  `proposed` 更新为 `accepted`；
- `task.md.permission.modify.allowed` 包含将被修改的正式方向文件；
- 只应用提案中已确认的内容，不顺手扩写新方向。

允许更新：

- `ai/project/refs/final-shape.md`
- `ai/project/refs/module-map.md`
- `ai/project/refs/roadmap.md`
- 必要时更新 `ai/project/refs/decisions.md` 或 `constraints.md`

应用后必须：

- 将 proposal 状态更新为 `applied`；
- 填写 `applied_at`；
- 在 `result.md` 中列出已合并的 proposal、修改文件和未合并事项。

如果人类拒绝提案，应保留 proposal 文件，将 `status` 更新为 `rejected`，
不要删除历史提案。

## 最少人类输入

人类通常只需要提供意图，并确认生成的项目和任务契约。
Agent 应从现有文档、清单、引用和项目文件中起草常规细节。

- 最多问 3 个澄清问题。
- 只在答案会改变范围、风险、权限或验收时提问。
- 不要询问可以从项目文件中安全推断的细节。
- 将安全的不确定性转换为 `ai/project/result.json` 中的显式假设。
- 如果验收仍不可验证，以 `status = "blocked"` 停止。
- 如果任务可执行，不要再请求人类交互，直接推进。

## 模型分工

遵守 `ai/project/task.md.model_policy`。

- 默认使用 `cheap`。
- 需要判断时升级。
- 记录升级原因。

常规执行使用默认档位。只有触发升级条件且所需角色列在 `strong_model_roles`
中时，才使用 `strong`。

如果宿主无法切换模型，停止，或将任务标记为 `partial` / `blocked`，
并写明需要的强模型角色。

## 同步规则

从模板仓库导入真实项目时：

- 只覆盖 `ai/template/**`。
- 永远不要覆盖 `ai/project/**`。

从真实项目回流改进到模板仓库时：

- 只回流 `ai/template/**`。
- 永远不要回流 `ai/project/**`。
