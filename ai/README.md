# ai/ Execution Layer

Copy this folder into a target software project.

```text
template is protocol
project is the field workspace
```

## Files

- `template/prompt.md`: AI startup prompt.
- `template/protocol.md`: execution flow, human-minimal intake, model division, sync rules.
- `template/rules/core.md`: readiness, risk, refs, permissions, runtime governance.
- `template/rules/output.md`: result and metrics output rules.
- `template/schemas/`: optional structure validation.
- `project/project.md`: stable project identity.
- `project/runtime.md`: current execution context.
- `project/intake.md`: smallest useful human input for the next task.
- `project/task.md`: current task contract.
- `project/result.json`: latest authoritative execution result.
- `project/result.md`: latest human-readable execution summary.
- `project/metrics.json`: latest model, token, time, success, and reuse signals.
- `project/refs/`: detailed references loaded only when needed.
- `project/archive/`: historical tasks/results, not read by default.

## Normal Use

1. Update `project/project.md` and `project/runtime.md` for the project.
2. Fill `project/intake.md` with the smallest useful request.
3. Fill `project/task.md` only when strict permissions or acceptance criteria are already known.
4. Start the AI tool with `template/prompt.md`.
5. Review `project/result.json`, `project/result.md`, and `project/metrics.json` after execution.
6. Archive old task/result files if needed.

## Sync Rules

From the template repo into a real project:

- Overwrite only `ai/template/**`.
- Never overwrite `ai/project/**`.

From a real project back into the template repo:

- Return only `ai/template/**`.
- Never return `ai/project/**`.

## Human-Minimal Rule

- The human provides intent, hard constraints, and final acceptance.
- The agent derives routine task detail from `project/project.md`, `project/runtime.md`, refs, and project files.
- Ask at most 3 clarification questions.
- Ask only when the answer changes scope, risk, permission, or acceptance.
- Repeated assumptions should become `project/runtime.md` update proposals.

## Model Division Protocol

- Model policy lives in `project/task.md.model_policy`.
- Use `cheap` by default for routine execution.
- Use `standard` for moderate implementation complexity.
- Use `strong` only for planning, risk judgment, architecture review, failure review, or acceptance judgment.
- Record actual tier, trigger, role, and escalation reason in `project/metrics.json`.
