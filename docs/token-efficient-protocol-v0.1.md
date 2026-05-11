# Token 高效 AI 执行协议 v0.1

这个 profile 建立在 AI Execution Template 文件协议 v0.8 之上。
目标不是孤立地最小化 token 使用量，而是在减少人类交互频率和输入量的同时，
用单位模型成本产出更多可接受的工作。

## 核心原则

默认使用低成本执行。只在关键判断点升级。

## 模型角色

- 强模型：规划、需求判断、架构复核、失败复盘、验收争议。
- 低成本模型：有边界的读取、小改动、草稿、重复检查、机械清理。

## 模型分工协议

模型分工在每个任务的 `ai/project/task.md.model_policy` 中声明。

```yaml
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
```

协议定义的是档位，不是某个供应商的具体模型名。

- `cheap`：文件读取、上下文清理、任务起草、小改动、检查、结果写入。
- `standard`：中等实现工作或跨模块编辑。
- `strong`：规划、风险判断、架构复核、失败复盘、验收判断。

如果需要升级但宿主无法切换模型，Agent 应停止，或将任务标记为
`partial` / `blocked`，并记录所需的强模型角色。

模型策略执行情况记录在 `ai/project/metrics.json`。

## 执行形态

```text
项目引导 -> 项目确认 -> 任务草稿 -> 任务确认 -> 计划 -> 执行 -> 复核 -> 结果
```

在基础循环被真实项目证明可靠之前，不要增加动态 DAG、多 Agent 通信或模型矩阵。

## 必需记录

- `ai/template/`：可复用执行协议。
- `ai/project/task.md`：目标、范围、权限、风险和验收标准。
- `ai/project/runtime.md`：每次运行都会读取的紧凑稳定上下文。
- `ai/project/result.json`：机器可读事实、验证、假设和下一步。
- `ai/project/result.md`：人类可读摘要。
- `ai/project/metrics.json`：模型档位、token 估算、耗时、成功状态、人工修复和复用潜力。

## 升级触发条件

在以下情况升级到更强模型：

- 目标或验收标准含糊。
- 任务触及高风险区域。
- 需要架构或公共契约判断。
- 执行器反复失败。
- 验证结果存在争议，或无法自信解释。

在 `ai/project/metrics.json` 中记录升级。

## 最少人类输入规则

人类通常只需要确认生成的项目上下文和任务契约。
Agent 应从现有文档、清单、有限代码读取、项目上下文、历史结果和引用中起草
`ai/project/project.md`、refs 和 `ai/project/task.md`。

- 最多问 3 个澄清问题。
- 只在答案会改变范围、风险、权限或验收时提问。
- 优先使用显式假设，而不是低价值来回确认。
- 将重复假设转成 `ai/project/runtime.md` 更新建议。
- 将重复成功模式转成未来任务模板或技能。

## 五条操作规则

1. 强模型是顾问，不是默认执行器。
2. 低成本模型处理边界清楚、验收明确的小任务。
3. 任务应足够原子，能够独立执行、验证和重跑。
4. 每次运行都必须留下可审计的任务、输入、输出、失败、成本和验证记录。
5. 每次运行都应为未来的技能、规则、模板或评估创造原材料。
