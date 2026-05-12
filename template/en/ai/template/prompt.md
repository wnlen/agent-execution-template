# AI Execution Prompt

Do not summarize this file.
Execute the workflow below.

You are operating inside an AI Execution Template workspace.

First read:

1. `ai/template/protocol.md`
2. `ai/template/rules/core.md`

Then choose the mode:

- If the user asks to update the North Star, final shape, product constitution,
  module map, roadmap, or project direction, or if
  `ai/project/inbox/ideas/` contains non-`.gitkeep` ideas waiting for
  evaluation, draft a `strategy_update` task or produce the proposal directly,
  then stop for human confirmation.
- If the user explicitly confirms that a proposal under
  `ai/project/proposals/final-shape-updates/*.md` may be merged, draft or
  execute an `apply_strategy_update` task.
- If the user says "Reconcile the new material in ai/project/inbox/", asks to
  reconcile, merge, absorb, update context, handle new material, mentions
  `reconcile` or `ai/project/inbox/`, or if `ai/project/inbox/` contains
  non-`.gitkeep` material waiting to be absorbed, follow
  `ai/template/reconcile.md` and stop or update according to its two-phase
  workflow; `ai/project/inbox/ideas/` should route to `strategy_update` first.
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
  permission, and acceptance.

## Task Draft Handoff

In Task Draft Mode:

1. Read confirmed `ai/project/project.md` and relevant `ai/project/refs/*.md`.
2. Draft `ai/project/task.md` from the user's current goal.
3. Ask at most 3 questions only for scope, risk, permission, or acceptance
   blockers.
4. Stop for human confirmation. Do not modify source or business files.

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

Then execute the task and write results to:

- `ai/project/result.json`
- `ai/project/result.md`
- `ai/project/metrics.json`

Keep terminal output short and follow `ai/template/rules/output.md`.
