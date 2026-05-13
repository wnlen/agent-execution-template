# ai/ 执行层

把这个目录复制到目标软件项目中。

```text
template 是协议
project 是现场工作区
```

## 文件

- `template/prompt.md`：AI 启动提示。
- `template/bootstrap.md`：项目发现和上下文引导提示。
- `template/reconcile.md`：把新的权威资料合并进现有项目上下文。
- `template/VERSION`：已安装模板版本。
- `template/protocol.md`：引导流程、执行流程、模型分工、同步规则。
- `template/rules/core.md`：引导范围、就绪度、风险、引用、权限和运行时治理。
- `template/rules/output.md`：结果和指标输出规则。
- `template/schemas/`：可选的结果和指标校验。
- `project/project.md`：稳定项目身份。
- `project/runtime.md`：当前执行上下文。
- `project/task.md`：当前任务契约。
- `project/result.json`：最新权威执行结果。
- `project/result.md`：最新人类可读执行摘要。
- `project/metrics.json`：最新模型、token、耗时、成功和复用信号。
- `project/refs/final-shape.md`：项目北极星说明书 / 最终形态。
- `project/refs/module-map.md`：当前模块地图。
- `project/refs/roadmap.md`：阶段路线图。
- `project/refs/`：只在需要时加载的详细引用。
- `project/inbox/ideas/`：待评估的产品、业务、架构或方向灵感。
- `project/inbox/processed/`：已经吸收进上下文的新资料，保留用于追溯。
- `project/inbox/raw/`：长文本、访谈、碎片材料等原始输入。
- `project/inbox/`：待吸收的新资料，例如更权威的业务文档。
- `project/proposals/final-shape-updates/`：北极星和路线图修订提案。
- `project/proposals/final-shape-updates/_template.md`：方向修订提案模板。
- `project/archive/`：历史任务和结果，默认不读取。

## 常规用法

第一次接入项目时，对 AI 工具说：

```text
开始初始化这个项目
```

以后常用入口：

- 想让 AI 继续做事：`继续推进这个项目`
- 有新资料要吸收：放入 `project/inbox/`，然后说 `整合 ai/project/inbox/ 里的新资料`
- 想重新总结和优化项目上下文：运行 `npx -y @wnlen/agent-execution-template refresh`
- 有新方向或新想法要评估：放入 `project/inbox/ideas/`，然后说 `把 ai/project/inbox/ideas/ 里的新灵感生成方向修订提案`
- 忘了下一步怎么走：运行 `npx -y @wnlen/agent-execution-template next`

判断标准：

- 资料 = 已确定的事实、文档、流程、接口、业务规则。
- 方向 = 还没决定的新想法、产品策略、架构调整、路线变化。

执行后检查 `project/result.json`、`project/result.md` 和 `project/metrics.json`。
需要时归档旧任务和结果文件。

## 上下文整合

当出现更完整、更权威的新资料时，先放入：

```text
ai/project/inbox/
```

然后对 AI 工具说：

```text
整合 ai/project/inbox/ 里的新资料
```

整合流程会先给出计划，等你确认后才更新 `project.md`、`runtime.md` 和
`refs/*`。整合完成后，已处理资料统一移动到
`ai/project/inbox/processed/`。

默认只吸收 `ai/project/inbox/*.md` 和 `ai/project/inbox/raw/*.md`。
`processed/**` 是追溯区，不会再次参与整合；`ideas/**` 走方向修订提案。

## 方向修订

北极星、模块地图和路线图属于项目方向层：

```text
ai/project/refs/final-shape.md
ai/project/refs/module-map.md
ai/project/refs/roadmap.md
```

普通执行任务不能直接修改这些文件。新灵感先放入：

```text
ai/project/inbox/ideas/
```

然后让 AI 生成 `strategy_update` 提案。人类确认后，再用
`apply_strategy_update` 合并到正式方向文档。

## 同步规则

从模板仓库同步到真实项目：

- 只覆盖 `ai/template/**`。
- 永远不要覆盖 `ai/project/**`。

从真实项目回流到模板仓库：

- 只回流 `ai/template/**`。
- 永远不要回流 `ai/project/**`。

## 引导规则

- 人类提供意图、硬约束和最终验收。
- Agent 从现有文档、清单、引用和项目文件中起草 `project/project.md` 和相关 `project/refs/*`。
- 人类提供当前任务目标后，Agent 起草 `project/task.md`。
- 人类在执行前检查并确认项目和任务草稿。
- 引导只能写项目上下文文件；当提供当前任务时，也可以写 `project/task.md`。
- 引导不得编辑源码、测试、配置、依赖文件、生成文件、运行时文件、结果文件或指标文件。
- 最多问 3 个澄清问题。
- 只在答案会改变范围、风险、权限或验收时提问。
- 重复出现的假设应变成 `project/runtime.md` 更新建议。

## 模型分工协议

- 模型策略位于 `project/task.md.model_policy`。
- 常规执行默认使用 `cheap`。
- 中等实现复杂度使用 `standard`。
- 只有规划、风险判断、架构复核、失败复盘或验收判断才使用 `strong`。
- 在 `project/metrics.json` 中记录实际档位、触发条件、角色和升级原因。
