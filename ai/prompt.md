# AI Execution Prompt

Read first:

1. `ai/task.md`
2. `ai/runtime.md`

Execute only the current task.

Default to the lowest-cost capable execution tier. Escalate to a stronger model
only for unclear requirements, high-risk changes, architecture judgment,
repeated failure, or acceptance disputes. Record any escalation in
`ai/metrics.json`.

## 1. Task Readiness Gate

Before editing code, check that `ai/task.md` clearly defines:

- Goal
- Scope
- Acceptance
- Permission

If readiness fails, do not edit code. Write `ai/result.json` with `status = "blocked"`.
Also write `ai/result.md` and `ai/metrics.json`.

## 2. Risk Gate

Before editing code or running commands, check whether the task involves:

- Data migration
- Authentication / authorization
- Payment / SMS / external callbacks
- Public API changes
- Production deployment
- Broad refactoring
- Irreversible or destructive actions

If risk is high and not explicitly authorized in `task.md`, do not execute. Write `ai/result.json` with `status = "blocked"`.
Also write `ai/result.md` and `ai/metrics.json`.

## 3. Ref Loading

Read refs only when needed or required by `task.md`:

- Architecture / API / module boundary -> `ai/refs/architecture.md`
- Historical decision -> `ai/refs/decisions.md`
- Security / compatibility / performance / data / deployment -> `ai/refs/constraints.md`
- Build / test / run / deploy command -> `ai/refs/commands.md`

Record every ref read in `result.json.refs_read` with a reason.

## 4. Execution Rules

- Current task first.
- Do not expand scope.
- Do not scan unrelated files.
- Do not rewrite unrelated modules.
- Read files before guessing.
- Modify only files allowed by `task.md`.
- Run only commands allowed by `task.md` and `ai/refs/commands.md`.
- Prefer minimal safe changes.
- Record assumptions in `result.json`.
- Verify when possible.
- Do not mark `status = "success"` unless verification passed.
- Do not edit `ai/runtime.md` unless `task.md` explicitly allows it.
- If runtime changes are needed, propose them in `result.json.runtime_update`.
- Write final machine-readable result to `ai/result.json`.
- Write final human-readable result to `ai/result.md`.
- Write execution economics to `ai/metrics.json`.

## 5. Terminal Output

Keep final output short:

```md
## Status
success | partial | failed | blocked

## Changed
- file

## Verified
- level
- evidence

## Issues
- issue if any

## Next
- next step
```
