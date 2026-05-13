# AI Context Reconcile

Do not summarize this file.
Execute the context reconciliation workflow below.

You are absorbing new authoritative material into an existing Agent Execution Template project context.
This is not a fresh bootstrap and not a full overwrite.

Goal: merge long-lived facts from the new material, correct outdated or inaccurate context, and preserve existing context that is still correct.

## When To Use

Use this workflow when a project has been using the template for a while and a more complete or more authoritative business, product, architecture, or process document appears.

New material should usually live in:

- `ai/project/inbox/*.md`
- `ai/project/inbox/raw/*.md`
- `docs/**`

`ai/project/inbox/` is the intake area for material that has not yet been
absorbed. After reconciliation is confirmed, move processed material to
`ai/project/inbox/processed/` for traceability and to avoid repeated
reconciliation.

## First Read

1. `ai/template/protocol.md`
2. `ai/template/rules/core.md`
3. `ai/project/project.md`
4. `ai/project/runtime.md`
5. `ai/project/refs/*.md`
6. The new material named by the human; if none is named, read `ai/project/inbox/*.md`

Do not read `ai/project/inbox/processed/**`, `ai/project/archive/**`, source,
tests, config, or dependency files by default unless the human explicitly asks
you to use them for fact checking.

## Reconciliation Principles

- Do not overwrite the whole context set.
- Preserve existing context that is still correct.
- Split new material into the right places:
  - Project identity, users, and stable conventions -> `ai/project/project.md`
  - Current valid execution context -> `ai/project/runtime.md`
  - Final shape / North Star / task-worthiness criteria -> `ai/project/refs/final-shape.md`
  - Current module structure / boundaries / dependency direction -> `ai/project/refs/module-map.md`
  - Stage goals / near-term roadmap / deferred items -> `ai/project/refs/roadmap.md`
  - Architecture / API / module boundaries -> `ai/project/refs/architecture.md`
  - Commands -> `ai/project/refs/commands.md`
  - Constraints -> `ai/project/refs/constraints.md`
  - Durable decisions -> `ai/project/refs/decisions.md`
- Do not dump raw source text into `refs/*`; absorb structured, long-lived, reusable context.
- If new material would change directional content in the North Star, module
  map, or roadmap, only recommend creating a `strategy_update` proposal. Do not
  directly modify those direction files during context reconciliation.
- `task.md`, `result.json`, `result.md`, and `metrics.json` usually do not participate in business-context reconciliation unless the human explicitly asks you to extract long-lived facts from them.

## Two-Phase Workflow

### Phase 1: Reconciliation Plan

First produce a reconciliation plan. Do not modify files.

The plan must include:

1. Content to add
2. Content to correct
3. Conflicts with existing context
4. Content to remove or downgrade
5. Questions requiring human confirmation, at most 3
6. Files expected to change

If there are no questions requiring confirmation, explicitly write "no extra confirmation needed".

Stop at the end of Phase 1 and wait for human confirmation.

### Phase 2: Apply Reconciliation

Only update files after the human explicitly confirms the reconciliation plan.

Allowed targets:

- `ai/project/project.md`
- `ai/project/runtime.md`
- `ai/project/refs/*.md`
- `ai/project/inbox/processed/**`, for material processed in this run

Do not modify these unless the human explicitly asks:

- Source, tests, config, dependency files
- `ai/project/refs/final-shape.md`
- `ai/project/refs/module-map.md`
- `ai/project/refs/roadmap.md`
- `ai/project/task.md`
- `ai/project/result.json`
- `ai/project/result.md`
- `ai/project/metrics.json`
- `ai/project/archive/**`

After applying reconciliation, move the processed `ai/project/inbox/*.md`
material into `ai/project/inbox/processed/`. If a filename conflicts, keep the
original name and add a date or sequence number. Do not move
`ai/project/inbox/ideas/**`; direction ideas should continue through
`strategy_update`.

## Final Handoff

After applying reconciliation, the final response must include:

```text
Context reconciliation is complete.

Updated:
- file

Archived material:
- ai/project/inbox/processed/file.md

Key changes:
- Added:
- Corrected:
- Deprecated:

Still uncertain:
- Up to 3 items; write "none" if there are none

Recommended next step:
1. Priority task:
   Reason:
2. Alternative task:
   Reason:

Reply with:
- Confirm, draft task 1
- Confirm, but do: <one-sentence task>
- Correction: <what to change>
```

Do not make the human hunt through files to find changes; file paths are only for traceability.
