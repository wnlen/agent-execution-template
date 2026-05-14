# Execution Policy

Do not summarize this file.
During task execution, use this file to choose `normal` or `bounded_continuous`.

## Default Policy

The default execution policy is `auto`: before each execution, the AI first
decomposes the task and judges risk, then chooses `normal` or
`bounded_continuous`. Continuous execution does not depend on a human keyword.

Pre-execution planning must:

- Infer goal, scope, acceptance, permissions, and verification method from the
  human goal, project context, and repository facts.
- List the L1 task checklist and assign Green / Yellow / Red risk to each L1.
- Use `normal` if there are fewer than 2 L1 tasks.
- Automatically use `bounded_continuous` if there are 2 or more L1 tasks.
- Stop for human confirmation first if any L1 is Red; Green and Yellow do not
  block startup.
- Write the task tree to `execution_policy.task_tree` in `ai/project/task.md`.

## Task Tree

Execute the task tree in L1 -> L2 -> L3 order.

- Before executing an L1, plan its naturally derived L2 tasks.
- Before executing an L2, plan L3 tasks if it still needs decomposition.
- Default to at most 3 levels. Add L4 dynamically only when L3 would otherwise
  be too large, unverifiable, or hard to revert.
- Every L1/L2/L3/L4 node must have risk, expected edit scope, acceptance method,
  and evidence requirements.
- Show the L1 checklist as task items; when an L1 is complete, check it off and
  strike it through.
- During execution, update each `task_tree` node status: `pending`, `running`,
  `done`, or `blocked`.

Recommended node shape:

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

## Risk Rubric

Green:

- Inside current task scope;
- no new permission, command, network access, or destructive action is needed;
- acceptance is clear;
- no product direction, core architecture, data structure, security boundary,
  payment, account, or permission change is needed.

Yellow:

- Still inside current task scope;
- local uncertainty or local verification failure exists;
- a low-risk local correction can continue the work;
- no permission, scope, command, or acceptance expansion is needed.

Red:

- Permission expansion, unallowed command, network access, or destructive action
  is needed;
- product direction, core architecture, data structure, security boundary,
  payment, account, or permission would change;
- many files must be deleted, a core module must be rewritten, or multiple
  high-cost options require judgment;
- acceptance cannot be defined, or task goal materially conflicts with project direction.

Only Red stops for human confirmation. Green continues automatically. Yellow
continues after local low-risk correction.

## Checkpoint

Emit checkpoints only when risk rises, a boundary is about to change, a vertical
slice is complete, or final review is about to start. Do not report just to
spend checkpoint budget.

Every checkpoint must include:

```text
## Checkpoint
### Task Tree
### Progress
### Completed
### Evidence
### Drift Risk: Green / Yellow / Red
### Recommended Next Step
### Auto-Continue Decision
```

Evidence must include changed files, commands run, verification results, or why
verification was not possible. A purely subjective Green is not valid.

## Model Policy

Continuous execution does not change `model_policy`. Still escalate through
`model_policy` for planning, architecture, failure review, or acceptance
disputes, and record the reason in `ai/project/metrics.json`.
