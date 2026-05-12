# ai/ Execution Layer

Copy this folder into a target software project.

```text
template is protocol
project is the field workspace
```

## Files

- `template/prompt.md`: AI startup prompt.
- `template/bootstrap.md`: project discovery and context bootstrap prompt.
- `template/reconcile.md`: merge new authoritative material into existing project context.
- `template/VERSION`: installed template version.
- `template/protocol.md`: bootstrap flow, execution flow, model division, sync rules.
- `template/rules/core.md`: bootstrap scope, readiness, risk, refs, permissions, runtime governance.
- `template/rules/output.md`: result and metrics output rules.
- `template/schemas/`: optional result and metrics validation.
- `project/project.md`: stable project identity.
- `project/runtime.md`: current execution context.
- `project/task.md`: current task contract.
- `project/result.json`: latest authoritative execution result.
- `project/result.md`: latest human-readable execution summary.
- `project/metrics.json`: latest model, token, time, success, and reuse signals.
- `project/refs/final-shape.md`: project North Star / final shape.
- `project/refs/module-map.md`: current module map.
- `project/refs/roadmap.md`: staged roadmap.
- `project/refs/`: detailed references loaded only when needed.
- `project/inbox/ideas/`: product, business, architecture, or direction ideas waiting for evaluation.
- `project/inbox/raw/`: raw long-form inputs, interviews, notes, or fragments.
- `project/inbox/`: new material waiting to be absorbed, such as authoritative business docs.
- `project/proposals/final-shape-updates/`: North Star and roadmap amendment proposals.
- `project/proposals/final-shape-updates/_template.md`: direction amendment proposal template.
- `project/archive/`: historical tasks/results, not read by default.

## Normal Use

1. During initialization, tell the AI tool: `Start initializing this project`.
2. The AI summarizes project context, confirmation points, and the recommended next step in chat.
3. Reply with corrections, or say: `Continue this project`.
4. To absorb new material, put it in `project/inbox/`, then say: `Reconcile the new material in ai/project/inbox/`.
5. For a new direction idea, put it in `project/inbox/ideas/` and have the AI produce a `strategy_update` proposal.
6. After human confirmation, run `apply_strategy_update` to merge it into the official direction docs.
7. Review `project/result.json`, `project/result.md`, and `project/metrics.json` after execution.
8. Archive old task/result files if needed.

## Context Reconcile

When more complete or more authoritative material appears, put it in:

```text
ai/project/inbox/
```

Then ask the AI tool:

```text
Reconcile the new material in ai/project/inbox/
```

The workflow produces a reconciliation plan first and updates `project.md`, `runtime.md`, and `refs/*` only after confirmation.

## Direction Amendments

The North Star, module map, and roadmap belong to the project direction layer:

```text
ai/project/refs/final-shape.md
ai/project/refs/module-map.md
ai/project/refs/roadmap.md
```

Routine execution tasks must not edit these files directly. Put new ideas in:

```text
ai/project/inbox/ideas/
```

Then have the AI produce a `strategy_update` proposal. After human
confirmation, use `apply_strategy_update` to merge it into the official
direction documents.

## Sync Rules

From the template repo into a real project:

- Overwrite only `ai/template/**`.
- Never overwrite `ai/project/**`.

From a real project back into the template repo:

- Return only `ai/template/**`.
- Never return `ai/project/**`.

## Bootstrap Rule

- The human provides intent, hard constraints, and final acceptance.
- The agent drafts `project/project.md` and relevant `project/refs/*` from existing docs, manifests, refs, and project files.
- The agent drafts `project/task.md` after the human provides the current task goal.
- The human reviews and confirms project and task drafts before execution.
- Bootstrap may write only project context files, plus `project/task.md` when a current task is provided.
- Bootstrap must not edit source code, tests, configuration, dependency files, generated files, runtime files, result files, or metrics files.
- Ask at most 3 clarification questions.
- Ask only when the answer changes scope, risk, permission, or acceptance.
- Repeated assumptions should become `project/runtime.md` update proposals.

## Model Division Protocol

- Model policy lives in `project/task.md.model_policy`.
- Use `cheap` by default for routine execution.
- Use `standard` for moderate implementation complexity.
- Use `strong` only for planning, risk judgment, architecture review, failure review, or acceptance judgment.
- Record actual tier, trigger, role, and escalation reason in `project/metrics.json`.
