---
task_id: ""
type: "bugfix | feature | refactor | docs | config | test | research | strategy_update | apply_strategy_update"
priority: "P0 | P1 | P2 | P3"
risk_level: "low | medium | high"
depends_on_previous_result: false
model_policy:
  default_tier: "cheap"
  allowed_tiers:
    - cheap
    - standard
    - strong
  escalation_allowed: true
  escalation_triggers:
    - ambiguous_goal
    - ambiguous_acceptance
    - high_risk_change
    - architecture_boundary
    - repeated_failure
    - verification_dispute
  strong_model_roles:
    - planning
    - risk_judgment
    - architecture_review
    - failure_review
    - acceptance_judgment
refs:
  required: []
  optional: []
permission:
  modify:
    allowed: []
    denied: []
  commands:
    allowed: []
    denied: []
  network: false
  destructive_actions: false
  runtime_update: "propose_only"
---

# 任务

这个文件是当前执行契约。优先在引导模式中，根据简短人类目标和仓库上下文生成，
然后由人类在执行前检查。

优先使用安全假设，少问额外问题；但不要猜测范围、风险、权限或验收。

## 目标

描述这个任务的准确目标。如果由简短人类请求生成，保留用户意图并明确写出假设。

如果 `type = strategy_update`，目标是生成方向修订提案，不写代码。
如果 `type = apply_strategy_update`，目标是把已确认提案合并进正式方向文档。

## 范围

允许范围：

-

范围外：

-

## 相关文件

-

## 约束

- 不要重构无关模块。
- 除非任务要求，不要修改公共 API。
- 除非明确授权，不要编辑 `ai/project/runtime.md`。
- 除非 `type = apply_strategy_update` 且已有确认过的提案，不要修改
  `ai/project/refs/final-shape.md`、`module-map.md` 或 `roadmap.md`。

## 验收

任务完成条件：

-

## 权限

只修改 YAML front matter 允许列表中的文件。
只运行 YAML front matter 中列出且 `ai/project/refs/commands.md` 允许的命令。

## 模型策略

默认使用 `model_policy.default_tier` 声明的模型档位。
不要用 `strong` 做常规执行。只为 `model_policy` 声明的角色和触发条件使用 `strong`，
并在 `ai/project/metrics.json` 中记录原因。

## 停止条件

如果出现以下情况，停止并写入 `status = "blocked"` 的 `ai/project/result.json`、
`ai/project/result.md` 和 `ai/project/metrics.json`：

- 必需文件缺失。
- 目标含糊。
- 验收不可验证。
- 范围要求修改允许范围之外的文件。
- 必需引用缺失。
- 必需命令无法运行。
- 风险等级高但没有明确授权。
