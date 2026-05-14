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
- Enter execution only when `ai/project/task.md` already exists and
  `readiness = ready_to_execute`. If this run creates or rewrites the task
  contract, stop at the confirmation handoff instead of executing from a draft.
- List the L1 task checklist and assign Green / Yellow / Red risk to each L1.
- Each L1 must be an independently acceptable vertical slice. Do not split a
  single mechanical step into L1 tasks, and do not merge multiple independently
  acceptable user-visible outcomes into one L1.
- Use `normal` if there are fewer than 2 L1 tasks.
- Automatically use `bounded_continuous` if there are 2 or more L1 tasks.
- Stop for human confirmation first if any L1 is Red; Green and Yellow do not
  block startup.
- Write the task tree to `execution_policy.task_tree` in `ai/project/task.md`.

## Task Tree

Execute the task tree in L1 -> L2 -> L3 order.

- L1 is a work increment that can be verified, rolled back, and explained to the
  user after completion.
- L2 is an implementation substep needed to finish that L1.
- L3 is a local operation step used when an L2 is still too large.
- Before executing an L1, plan its naturally derived L2 tasks.
- Before executing an L2, plan L3 tasks if it still needs decomposition.
- Default to at most 3 levels. Add L4 dynamically only when L3 would otherwise
  be too large, unverifiable, or hard to revert.
- Every L1/L2/L3/L4 node must have risk, expected edit scope, acceptance method,
  and evidence requirements.
- Show the L1 checklist as task items; when an L1 is complete, check it off and
  strike it through.
- Task tree write-back rule: write the L1 checklist before execution; update an
  L1 when it starts or completes; write back immediately on Red, blocked, scope
  change, or final wrap-up. Do not write back every tiny L3 operation.
- During execution, use `pending`, `running`, `done`, or `blocked` for node
  status.

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
- the correction affects only the current L1/L2 local implementation and does
  not change public interfaces, data models, permissions, security,
  architecture direction, or acceptance;
- no permission, scope, command, network, or acceptance expansion is needed.

Red:

- Permission expansion, unallowed command, network access, or destructive action
  is needed;
- product direction, core architecture, public APIs, persistent data structures,
  security boundary, payment, account, or permission would change;
- files beyond the current L1's directly related files must be deleted, a core
  module must be rewritten, or multiple high-cost options require judgment;
- acceptance cannot be defined, or task goal materially conflicts with project direction.

Only Red stops for human confirmation. Green continues automatically. Yellow
continues after local low-risk correction.

## Checkpoint

Emit checkpoints only when risk changes from Green to Yellow/Red, scope or
permission is about to expand, an L1 vertical slice is complete, verification
failed but execution is about to continue, or final review is about to start.
Do not report just to spend checkpoint budget.

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

## User-Visible Output

- Show the L1 checklist by default; do not show full L2/L3/L4 by default.
- Show risk conclusions and necessary reasons; do not output long internal reasoning.
- Show evidence; do not show internal protocol fields, full YAML,
  `checkpoint_budget`, or `model_policy`.
- Say little for Green, be brief for Yellow, and stop with clear reasons and
  options for Red.
- Final output must include status, completed items, verification results, and
  result files.

## Model Policy

Continuous execution does not change `model_policy`. Still escalate through
`model_policy` for planning, architecture, failure review, or acceptance
disputes, and record the reason in `ai/project/metrics.json`.
