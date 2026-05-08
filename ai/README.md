# ai/ Execution Layer

Copy this folder into a target software project.

## Files

- `prompt.md`: AI startup prompt.
- `task.md`: current task definition.
- `runtime.md`: compact always-read context.
- `result.json`: latest authoritative execution result.
- `result.md`: latest human-readable execution summary.
- `metrics.json`: latest model, token, time, success, and reuse signals.
- `refs/`: detailed references loaded only when needed.
- `schemas/`: optional structure validation.
- `archive/`: historical tasks/results, not read by default.

## Normal Use

1. Update `runtime.md` for the project once.
2. Fill `task.md` for the current task.
3. Start the AI tool with `prompt.md`.
4. Review `result.json`, `result.md`, and `metrics.json` after execution.
5. Archive old task/result files if needed.

## Token-Efficient Role Split

- Cheap execution tier: bounded file reads, small edits, drafts, repetitive checks.
- Strong judgment tier: planning, ambiguous scope, architecture review, failure replay, acceptance disputes.
- Escalation should be recorded in `metrics.json`, including the reason.
