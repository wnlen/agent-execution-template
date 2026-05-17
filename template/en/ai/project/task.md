---
task_id: ""
type: "bugfix | feature | refactor | docs | config | test | research | strategy_update | apply_strategy_update"
priority: "P0 | P1 | P2 | P3"
risk_level: "low | medium | high"
readiness: "draft_for_confirmation | ready_to_execute | blocked"
depends_on_previous_result: false
execution_policy:
  mode: "auto | normal | bounded_continuous"
  task_tree:
    - id: "L1-1"
      title: ""
      risk: "Green | Yellow | Red"
      status: "pending | running | done | blocked"
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

# Task

This file is the current execution contract. Prefer generating it in Bootstrap
Mode from a short human goal plus repository context, then have a human review
it before execution.

Prefer safe assumptions over extra questions. The AI should infer scope, risk,
permissions, and acceptance from the human goal, project context, and repository
facts. If inference would cross permission or safety boundaries, or acceptance
cannot be defined, set `readiness` to `blocked` or mark the relevant task node
`Red` and wait for human confirmation.
If this run creates or rewrites the task contract, keep
`readiness = draft_for_confirmation` by default and stop at the handoff. Enter
execution only when an existing task is explicitly `ready_to_execute`.

Default to a compact task contract. A single-L1, Green, low-risk task should
write only the goal, scope, acceptance, permissions, verification commands, and
minimal `execution_policy.task_tree`. Multi-L1, Yellow/Red, cross-module,
continuously executed, or highly uncertain tasks may expand checkpoint, model
policy, risk gate, and fuller task-tree fields as needed. The complete default
rules live in `ai/template/execution-policy.md`.

## Goal

Describe the exact goal of this task. If generated from a short human request,
preserve the user's intent and make assumptions explicit.

If `type = strategy_update`, the goal is to produce a direction amendment
proposal, not code. If `type = apply_strategy_update`, the goal is to merge a
confirmed proposal into the official direction documents.

## Scope

Allowed scope:

- 

Out of scope:

- 

## Related Files

- 

## Constraints

- Do not refactor unrelated modules.
- Do not modify public API unless required by the task.
- Do not edit `ai/project/runtime.md` unless explicitly authorized.
- Do not modify `ai/project/refs/final-shape.md`, `module-map.md`, or
  `roadmap.md` unless `type = apply_strategy_update` and a confirmed proposal
  exists.

## Acceptance

The task is complete when:

- 

## Execution Policy

Default to `auto`. The AI decides during pre-execution planning whether to use
continuous execution; it does not wait for a human keyword. If planning finds
fewer than 2 L1 tasks, use `normal`; if it finds 2 or more L1 tasks, use
`bounded_continuous` automatically. Each L1 must be an independently acceptable
vertical slice.

`bounded_continuous` means bounded continuous execution:

- The AI infers goal, scope, acceptance, permissions, and risk from the human
  goal, project context, and repository facts; the human does not need to
  provide each field upfront.
- `readiness = ready_to_execute` means no Red preflight item exists and the task
  may execute.
- `readiness = draft_for_confirmation` means human confirmation is required
  before execution.
- `readiness = blocked` means the task cannot execute and must produce a
  blocked result.
- If this run creates or rewrites `ai/project/task.md`, stop at the confirmation
  handoff; do not execute while the task is still a draft.
- Before execution, write the L1 checklist to `execution_policy.task_tree`.
- Before execution, list the L1 task checklist; mark each L1 complete with a
  checked and struck-through item.
- Each L1 must be an independently acceptable vertical slice. Do not split a
  single mechanical step into L1 tasks, and do not merge multiple independently
  acceptable user-visible outcomes into one L1.
- Before executing an L1, plan the naturally derived L2 tasks; if an L2 still
  needs decomposition, plan L3 tasks.
- Default to at most 3 levels; add L4 dynamically only when leaving it out
  would make L3 too large or unverifiable.
- The AI assigns Green / Yellow / Red risk to every task node.
- Only Red stops for human confirmation; Green continues automatically, and
  Yellow only permits local low-risk correction inside the current L1/L2. It
  must not change public interfaces, data models, permissions, security,
  architecture direction, or acceptance.
- `progress_unit` defaults to `vertical_slice`: each work loop should produce
  a reviewable increment.
- Compact tasks should not expand internal control fields such as
  `checkpoint_budget` or `model_policy`.
- Expanded tasks may add checkpoint budgets, model policy, risk gates, and
  fuller node fields as needed.
- Emit checkpoints only when risk changes from Green to Yellow/Red, scope or
  permission is about to expand, an L1 vertical slice is complete, verification
  failed but execution is about to continue, or final wrap-up is about to start.
- Every checkpoint must include evidence: changed files, commands run,
  verification results, or why verification was not possible.
- `task_tree` write-back frequency: write the L1 checklist before execution;
  update an L1 when it starts or completes; write back immediately on Red,
  blocked, scope change, or final wrap-up; do not write back every tiny L3
  operation.
- After completion, run one final review; only re-check Yellow, Red, failed
  verification, or high-impact modules.
- Continuous execution does not change model policy; escalate through
  `model_policy` for judgment, architecture, failure review, or acceptance
  disputes.

## Permission

Modify files only under the allowlist in the YAML front matter.
Run only commands listed in the YAML front matter and allowed by `ai/project/refs/commands.md`.

## Model Policy

Default to the model tier declared in `model_policy.default_tier`.
Do not use `strong` for routine execution. Use `strong` only for the roles and
triggers declared in `model_policy`, then record the reason in `ai/project/metrics.json`.

## Stop Conditions

Stop and write `ai/project/result.json`, `ai/project/result.md`, and `ai/project/metrics.json` with blocked status if:

- Required files are missing.
- Goal is ambiguous.
- Acceptance cannot be verified.
- Scope requires modifying files outside allowed range.
- Required refs are missing.
- Required command cannot be run.
- Risk level is high without explicit authorization.
- A Red checkpoint appears during continuous execution.
- The task would change product direction, core architecture, public API,
  persistent data structures, security boundaries, payment, accounts, or
  permissions.
- The task would delete files beyond the current L1's directly related files,
  rewrite a core module, or require choosing between multiple high-cost options.
