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
- `project/refs/`：只在需要时加载的详细引用。
- `project/inbox/`：待吸收的新资料，例如更权威的业务文档。
- `project/archive/`：历史任务和结果，默认不读取。

## 常规用法

1. 初始化时，对 AI 工具说：`开始初始化这个项目`。
2. AI 会在聊天里给出项目上下文摘要、需要确认的点和建议下一步。
3. 回复修正意见，或说：`继续推进这个项目`。
4. 需要吸收新资料时，放入 `project/inbox/`，然后说：`整合 ai/project/inbox/ 里的新资料`。
5. 执行后检查 `project/result.json`、`project/result.md` 和 `project/metrics.json`。
6. 需要时归档旧任务和结果文件。

## 上下文整合

当出现更完整、更权威的新资料时，先放入：

```text
ai/project/inbox/
```

然后对 AI 工具说：

```text
整合 ai/project/inbox/ 里的新资料
```

整合流程会先给出计划，等你确认后才更新 `project.md`、`runtime.md` 和 `refs/*`。

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
