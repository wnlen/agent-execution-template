---
task_id: ""
type: "bugfix | feature | refactor | docs | config | test | research | strategy_update | apply_strategy_update"
priority: "P0 | P1 | P2 | P3"
risk_level: "low | medium | high"
readiness: "draft_for_confirmation | ready_to_execute | blocked"
depends_on_previous_result: false
execution_policy:
  mode: "auto | normal | bounded_continuous"
  activation_rule: "auto_enable_when_l1_count_gte_2"
  max_depth: 3
  allow_depth_4_when_needed: true
  progress_unit: "vertical_slice"
  l1_granularity: "independently_acceptable_vertical_slice"
  write_back_policy: "l1_start_done_red_blocked_scope_change_final"
  task_tree:
    - id: "L1-1"
      title: ""
      risk: "Green | Yellow | Red"
      status: "pending | running | done | blocked"
      scope:
        allowed: []
        denied: []
      acceptance: []
      evidence: []
      children: []
  checkpoint_budget:
    l1: 0
    l2: 0
    l3: 0
    l4: 0
  checkpoint_triggers:
    - before_crossing_boundary
    - after_vertical_slice
    - before_final_review
  auto_continue:
    green: true
    yellow: "low_risk_only"
    red: false
  risk_gate:
    green: "continue"
    yellow: "continue_with_local_fix"
    red: "stop_for_human"
  evidence_required: true
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

当前执行契约。优先由引导模式根据人类目标和仓库上下文生成，执行前由人类检查。

优先安全假设，少问问题。AI 基于目标、上下文和仓库事实推断范围、风险、权限和验收；
若会越权、触碰安全边界或验收不可定义，将 `readiness` 设为 `blocked` 或把相关节点设为
`Red`，等待确认。本轮新建或重写任务契约时，默认保持 `draft_for_confirmation` 并停下交接；
只有既有任务为 `ready_to_execute` 时才执行。

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

## 执行策略

默认 `auto`：AI 执行前规划并决定是否连续执行，不等用户口令。L1 < 2 用 `normal`；
L1 >= 2 自动用 `bounded_continuous`。

`bounded_continuous` 表示边界内连续执行：

- 目标、范围、验收、权限和风险由 AI 基于目标、上下文和仓库事实推断；不要求用户逐项提供。
- `readiness = ready_to_execute` 表示没有 Red 预检项，可以执行。
- `readiness = draft_for_confirmation` 表示需要人类确认后才能执行。
- `readiness = blocked` 表示当前任务不可执行，必须写 blocked 结果。
- 本轮新建或重写 `task.md` 时必须停在确认交接；草稿不能执行。
- 执行前必须把 L1 清单写入 `execution_policy.task_tree`。
- 执行前必须列出 L1 清单；每个 L1 用待办表示，完成后打勾并划掉。
- L1 必须是可独立验收的垂直切片；不要把单个机械步骤拆成 L1，也不要把多个
  可独立验收的用户可见结果合并成一个 L1。
- 执行 L1 前规划 L2；L2 仍过大时规划 L3。
- 默认最多 3 层；不拆 L4 会导致 L3 过大或不可验证时，才允许 L4。
- 每个节点都由 AI 生成 Green / Yellow / Red 风险评级。
- 只有 Red 停下来让人类确认；Green 自动继续，Yellow 只允许当前 L1/L2 内的局部
  低风险修正，不能改变公共接口、数据模型、权限、安全、架构方向或验收标准。
- `progress_unit` 默认为 `vertical_slice`：每轮都应产生可检查增量。
- `checkpoint_budget` 是上限，不是必须用完；不要为消耗预算而汇报。
- 只有在风险从 Green 变 Yellow/Red、即将扩大范围或权限、完成 L1 垂直切片、
  验证失败后准备继续、准备最终收尾时才输出 Checkpoint。
- 每个 Checkpoint 必须包含证据：已改文件、已运行命令、验证结果或无法验证的原因。
- `task_tree` 写回：执行前写 L1 清单；L1 开始/完成、Red、blocked、范围变化或收尾时写回；
  不为微小 L3 操作写回。
- 完成后只做一次总复盘；只对 Yellow、Red、失败验证或高影响模块做二次抽检。
- 连续执行不改变模型策略；涉及判断、架构、失败复盘或验收争议时仍按 `model_policy` 升级。

## 权限

只修改 YAML front matter 允许列表中的文件。
只运行 YAML front matter 中列出且 `ai/project/refs/commands.md` 允许的命令。

## 模型策略

默认使用 `model_policy.default_tier`。不要用 `strong` 做常规执行；只在
`model_policy` 声明的角色和触发条件下使用，并在 `metrics.json` 记录原因。

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
- 连续执行中出现 Red 检查点。
- 需要改变产品方向、核心架构、公共 API、持久化数据结构、安全边界、支付、账号或权限。
- 需要删除超过当前 L1 直接相关的文件、重写核心模块，或在多个高成本方案之间取舍。
