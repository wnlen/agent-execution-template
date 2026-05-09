# Core Rules

## Readiness Gate

Before editing code, check that `ai/project/task.md` clearly defines:

- Goal
- Scope
- Acceptance
- Permission

If readiness fails, do not edit code. Write blocked results to:

- `ai/project/result.json`
- `ai/project/result.md`
- `ai/project/metrics.json`

## Risk Gate

Before editing code or running commands, check whether the task involves:

- Data migration
- Authentication / authorization
- Payment / SMS / external callbacks
- Public API changes
- Production deployment
- Broad refactoring
- Irreversible or destructive actions

If risk is high and not explicitly authorized in `ai/project/task.md`, stop and
write blocked results.

## Ref Loading

Read refs only when needed or required by `ai/project/task.md`:

- Architecture / API / module boundary -> `ai/project/refs/architecture.md`
- Historical decision -> `ai/project/refs/decisions.md`
- Security / compatibility / performance / data / deployment -> `ai/project/refs/constraints.md`
- Build / test / run / deploy command -> `ai/project/refs/commands.md`

Record every ref read in `ai/project/result.json.refs_read` with a reason.

## Execution Rules

- Current task first.
- Do not expand scope.
- Do not scan unrelated files.
- Do not rewrite unrelated modules.
- Read files before guessing.
- Modify only files allowed by `ai/project/task.md`.
- Run only commands allowed by `ai/project/task.md` and `ai/project/refs/commands.md`.
- Prefer minimal safe changes.
- Record assumptions in `ai/project/result.json`.
- Verify when possible.
- Do not mark `status = "success"` unless verification passed.
- Do not edit `ai/project/runtime.md` unless `ai/project/task.md` explicitly allows it.
- If runtime changes are needed, propose them in `ai/project/result.json.runtime_update`.

## Runtime Governance

`ai/project/runtime.md` stores stable, currently valid execution context only.
It is not a project diary. Historical tasks and results belong in
`ai/project/archive/`.
