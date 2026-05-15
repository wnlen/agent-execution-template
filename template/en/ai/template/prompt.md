# AI Execution Prompt

Do not summarize this file.
Execute the workflow below.

You are operating inside an Agent Execution Template workspace.

This file only routes the workflow. First read minimal state:

1. `ai/project/project.md` if present
2. `ai/project/task.md` if present
3. Shallow listings of `ai/project/inbox/`, `ai/project/inbox/ideas/`, and `ai/project/proposals/final-shape-updates/`

Then choose the mode:

- If the user asks to update the North Star, final shape, product constitution,
  module map, roadmap, or project direction, or if
  `ai/project/inbox/ideas/` contains non-`.gitkeep` ideas waiting for
  evaluation, read `ai/template/protocol.md`, `ai/template/rules/core.md`, and
  relevant direction refs, then draft a `strategy_update` task or produce the
  proposal directly, then stop for human confirmation.
- If the user explicitly confirms that a proposal under
  `ai/project/proposals/final-shape-updates/*.md` may be merged, draft or
  execute an `apply_strategy_update` task after reading
  `ai/template/protocol.md` and `ai/template/rules/core.md`. If the proposal is
  still `proposed`, update it to `accepted` based on that explicit confirmation.
- If the user says "Start initializing this project and absorb the material in ai/project/inbox/",
  or asks to initialize while also absorbing material from
  `ai/project/inbox/`, inspect `ai/project/project.md` first. If it already
  exists and is not empty, placeholder-only, or clearly incomplete, follow
  `ai/template/reconcile.md` instead of bootstrapping again. If it is empty,
  placeholder-only, or clearly incomplete, follow `ai/template/bootstrap.md`
  and treat `ai/project/inbox/*.md` and `ai/project/inbox/raw/*.md` as part of
  the bootstrap input for this run; stop after project-context confirmation.
- If the user says "Reconcile the new material in ai/project/inbox/", asks to
  reconcile, merge, absorb, update context, handle new material, mentions
  `reconcile` or `ai/project/inbox/`, or if `ai/project/inbox/` contains
  non-`.gitkeep` material waiting to be absorbed, follow
  `ai/template/reconcile.md` and stop or update according to its two-phase
  workflow; `ai/project/inbox/processed/` is already processed material and
  should not trigger reconciliation, while `ai/project/inbox/ideas/` should
  route to `strategy_update` first. Even if the human says to reconcile the
  whole inbox, default to only `ai/project/inbox/*.md` and
  `ai/project/inbox/raw/*.md`.
- If the user says "Start initializing this project", asks to initialize,
  organize, or generate project context, or if `ai/project/project.md` is
  empty, placeholder-only, or incomplete, follow `ai/template/bootstrap.md`
  and stop after project-context confirmation.
- If `ai/project/task.md` is empty, placeholder-only, or incomplete, draft it
  from the user's current goal and confirmed project context, then stop for
  human confirmation.
- If the user says "Continue this project" without a more specific goal, first
  judge the best next step globally: prioritize pending context confirmation,
  pending task confirmation, failed results, unfinished tasks, or obvious
  risks; then recommend a next step or draft `ai/project/task.md`. Do not make
  the human hunt through files for gaps.
- Use Execution Mode only after `ai/project/project.md` and
  `ai/project/task.md` are ready enough to define identity, goal, scope,
  permission, and acceptance. Only then read `ai/template/protocol.md`,
  `ai/template/rules/core.md`, and `ai/template/execution-policy.md`.

## Task Draft Handoff

In Task Draft Mode:

1. Read confirmed `ai/project/project.md` and relevant `ai/project/refs/*.md`.
2. Infer goal, scope, acceptance, permissions, verification method, and initial
   risk from the user's current goal, project context, and repository facts; do
   not require the human to provide each field upfront.
3. Draft `ai/project/task.md`. For a single-L1, Green, low-risk task, default to
   a compact task contract: write only the goal, scope, acceptance, permissions,
   verification commands, and minimal `execution_policy.task_tree`. Use an
   expanded task contract only for multi-L1, Yellow/Red, cross-module,
   continuously executed, or highly uncertain tasks.
4. Before execution, list the L1 checklist, mark each L1 Green / Yellow / Red,
   and write it to `execution_policy.task_tree`. Use `normal` if there are
   fewer than 2 L1 tasks; automatically use `bounded_continuous` if there are 2
   or more L1 tasks. The complete default rules live in
   `ai/template/execution-policy.md`; do not mechanically copy internal control
   fields such as `checkpoint_budget` or `model_policy` into simple task drafts.
5. If this run creates or rewrites `ai/project/task.md`, set `readiness` to
   `draft_for_confirmation` and stop at the handoff; do not execute while the
   task is still a draft.
6. Enter Execution Mode only when an existing task is explicitly
   `ready_to_execute` and no Red preflight item exists; if it cannot execute,
   set it to `blocked`.
7. Do not modify source or business files in Task Draft Mode.

End Task Draft Mode with:

```text
Task draft is ready.

Please review:
- ai/project/task.md

Confirm or correct:
1. Goal and acceptance
2. Allowed and denied scope
3. Permissions, commands, and risk level

Reply with:
- Confirmed, execute
- Or corrections
```

## Strategy Update Handoff

In `strategy_update`:

1. Read `final-shape.md`, `module-map.md`, `roadmap.md`, `decisions.md`,
   `constraints.md`, and relevant `inbox/ideas/*`.
2. Use `ai/project/proposals/final-shape-updates/_template.md` as the
   structural template and generate
   `ai/project/proposals/final-shape-updates/YYYYMMDD-topic.md`.
3. Stop for human confirmation. Do not modify official direction files or
   source code.

End with:

```text
Direction amendment proposal is ready.

Please review:
- ai/project/proposals/final-shape-updates/YYYYMMDD-topic.md

Reply with:
- Confirmed, merge this proposal
- Or corrections
```

In Execution Mode, read:

1. `ai/project/project.md`
2. `ai/project/runtime.md`
3. `ai/project/task.md`

Then follow `ai/template/execution-policy.md` for pre-execution planning: list
the L1 checklist, mark each L1 Green / Yellow / Red, and write it to
`execution_policy.task_tree`. Automatically choose `normal` or
`bounded_continuous` from the L1 count. Execute only when
`readiness = ready_to_execute`; if this run creates or rewrites the task
contract, stop at the confirmation handoff. Each L1 must be an independently
acceptable vertical slice. Plan L2 before executing an L1, and plan L3 as needed
before executing an L2; default to at most 3 levels, with L4 allowed when
needed. When an L1 is complete, check it off and strike it through; write back
`task_tree` when an L1 starts or completes, on Red/blocked, on scope change, or
at final wrap-up. Only Red stops for human confirmation; Green continues
automatically, and Yellow only permits local low-risk correction inside the
current L1/L2. User-visible output follows the "User-Visible Output" rules in
`ai/template/execution-policy.md`. Write results to:

- `ai/project/result.json`
- `ai/project/result.md`
- `ai/project/metrics.json`

Keep terminal output short and follow `ai/template/rules/output.md`.
