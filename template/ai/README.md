# ai/ Execution Layer

Copy this folder into a target software project.

```text
template is protocol
project is the field workspace
```

## Files

- `template/prompt.md`: AI startup prompt.
- `template/bootstrap.md`: project discovery and context bootstrap prompt.
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
- `project/refs/`: detailed references loaded only when needed.
- `project/archive/`: historical tasks/results, not read by default.

## Normal Use

1. Ask the AI tool to read `template/bootstrap.md`.
2. Review and confirm `project/project.md` and relevant `project/refs/*`.
3. Give the current task as a short goal.
4. Review and confirm the generated `project/task.md`.
5. Run execution with `template/prompt.md`.
6. Review `project/result.json`, `project/result.md`, and `project/metrics.json` after execution.
7. Archive old task/result files if needed.

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
