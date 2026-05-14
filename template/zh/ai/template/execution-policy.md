# 执行策略

不要总结这个文件。
任务执行时按本文件选择 `normal` 或 `bounded_continuous`。

## 默认策略

默认执行策略是 `auto`：AI 在每次执行前先做任务分解和风险判断，再决定使用
`normal` 还是 `bounded_continuous`。启用连续执行不依赖用户说出特定口令。

执行前规划必须：

- 根据用户目标、项目上下文和仓库事实，推断目标、范围、验收、权限和验证方式。
- 列出 L1 任务清单，并为每个 L1 生成 Green / Yellow / Red 风险评级。
- 如果 L1 少于 2 个，使用 `normal`。
- 如果 L1 为 2 个或更多，自动启用 `bounded_continuous`。
- 如果任一 L1 为 Red，先停止并让人类确认；Green 和 Yellow 不阻塞启动。
- 将任务树写入 `ai/project/task.md` 的 `execution_policy.task_tree`。

## 任务树

任务树按 L1 -> L2 -> L3 执行。

- 执行某个 L1 前，先规划它自然衍生出的 L2。
- 执行某个 L2 前，如果仍需拆分，再规划 L3。
- 默认最多 3 层。只有当 L3 仍过大、不可验证或不可回退时，才动态增加 L4。
- L1/L2/L3/L4 都必须有风险评级、预期改动范围、验收方式和证据要求。
- L1 清单必须用待办列表展示；每完成一个 L1，就打勾并划掉。
- 执行中必须更新 `task_tree` 节点状态：`pending`、`running`、`done` 或 `blocked`。

推荐节点结构：

```yaml
id: "L1-1"
title: ""
risk: "Green | Yellow | Red"
status: "pending | running | done | blocked"
scope:
  allowed: []
  denied: []
acceptance: []
evidence: []
children: []
```

## 风险分级

Green：

- 在当前任务范围内；
- 不需要新增权限、命令、网络或破坏性操作；
- 验收方式明确；
- 不改变产品方向、核心架构、数据结构、安全边界、支付、账号或权限。

Yellow：

- 仍在当前任务范围内；
- 存在局部不确定或局部验证失败；
- 可以用低风险修正继续；
- 不需要扩大权限、范围、命令或验收。

Red：

- 需要扩大权限、运行未允许命令、访问网络或执行破坏性操作；
- 需要改变产品方向、核心架构、数据结构、安全边界、支付、账号或权限；
- 需要删除大量文件、重写核心模块或在多个高成本方案之间取舍；
- 验收不可定义，或任务目标和项目方向发生实质冲突。

只有 Red 停止等待人类确认。Green 自动继续。Yellow 做局部低风险修正后继续。

## Checkpoint

Checkpoint 只在风险升高、边界即将变化、完成垂直切片或准备收尾时输出。
不要为了消耗预算而汇报。

每个 Checkpoint 必须包含：

```text
## Checkpoint
### 任务树
### 当前完成度
### 已完成
### 证据
### 偏离风险：Green / Yellow / Red
### 下一步建议
### 是否自动继续
```

证据必须包含已改文件、已运行命令、验证结果，或无法验证的原因。
不接受只有主观判断的 Green。

## 模型策略

连续执行不改变 `model_policy`。遇到规划、架构、失败复盘或验收争议，
仍按 `model_policy` 升级，并在 `ai/project/metrics.json` 中记录原因。
