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

## Bootstrap Gate

If `ai/project/project.md` is empty, placeholder-only, incomplete, or the user
asks to bootstrap project context, follow `ai/template/bootstrap.md` before
execution.

Bootstrap Mode may write only project context files:

- `ai/project/project.md`
- `ai/project/refs/architecture.md`
- `ai/project/refs/commands.md`
- `ai/project/refs/constraints.md`
- `ai/project/refs/decisions.md`

Bootstrap Mode may write `ai/project/task.md` only if the human also provides
a current task goal.

Bootstrap Mode must not edit source code, tests, configuration, dependency
files, generated files, runtime files, result files, or metrics files.

After writing bootstrap drafts, stop for human confirmation. Do not continue
into implementation in the same run unless the human explicitly confirms the
drafts and asks to execute.

## Bootstrap Read Scope

Read only high-signal project sources by default:

- Root docs: `README*`, `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING*`, `CHANGELOG*`
- Manifests: `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`,
  `pom.xml`, `build.gradle*`, `Makefile`
- Project docs: `docs/**`, preferring overview, architecture, setup, testing,
  deployment, API, ADR, and decision files
- Existing AI refs: `ai/project/refs/*.md`
- Shallow source/test/config/docs directory listing
- If docs are missing or insufficient, bounded reads of likely entrypoints such
  as `src/`, `app/`, `lib/`, `packages/`, `services/`, `cmd/`, `internal/`,
  `server/`, `client/`, `test/`, and `tests/`

Do not read dependency folders, build outputs, coverage outputs, secret files,
environment files, or archives unless explicitly authorized or referenced by
the user.

## Task Draft Gate

If project context is confirmed but `ai/project/task.md` is empty,
placeholder-only, incomplete, or the human provides a new task goal, draft
`ai/project/task.md` from confirmed project context and stop for human
confirmation before implementation.

Task Draft Mode may write only:

- `ai/project/task.md`

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
