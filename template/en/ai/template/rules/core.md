# Core Rules

## Readiness Gate

Before editing code, check that `ai/project/task.md` clearly defines:

- Goal
- Scope
- Acceptance
- Permission
- Execution policy

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
- `ai/project/refs/final-shape.md`
- `ai/project/refs/module-map.md`
- `ai/project/refs/roadmap.md`
- `ai/project/refs/architecture.md`
- `ai/project/refs/commands.md`
- `ai/project/refs/constraints.md`
- `ai/project/refs/decisions.md`

Bootstrap Mode may write `ai/project/task.md` only if the human also provides
a current task goal. In that case, draft only the task contract and do not
enter implementation.

Bootstrap Mode must not edit source code, tests, configuration, dependency
files, generated files, runtime files, result files, or metrics files.

After writing bootstrap drafts, stop with the Post-Bootstrap Handoff from
`ai/template/bootstrap.md`. The handoff must include a confirmable in-chat
summary and recommended next step, not only file paths to inspect. If the human
already provided a current task goal, bootstrap may also draft
`ai/project/task.md` in the same run, but it must still stop for confirmation
and must not enter implementation.

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

Task Draft Mode must end with the Task Draft Handoff from
`ai/template/prompt.md`.

## Context Reconcile Gate

If the user provides new authoritative business, product, architecture, or
process material and wants it merged into existing context, or says
"Reconcile the new material in ai/project/inbox/", follow
`ai/template/reconcile.md`. Do not re-bootstrap and do not overwrite the whole
context set.

New material should usually live in:

- `ai/project/inbox/*.md`
- `ai/project/inbox/raw/*.md`
- `docs/**`

Processed material is moved to `ai/project/inbox/processed/` and should not
trigger context reconciliation again by default.

Context reconciliation must produce a plan first and wait for human
confirmation before updating files.

By default, context reconciliation may update only:

- `ai/project/project.md`
- `ai/project/runtime.md`
- `ai/project/refs/*.md`

If new material would change directional content in the North Star, module map,
or roadmap, Context Reconcile Mode may only recommend a `strategy_update`. It
must not directly modify:

- `ai/project/refs/final-shape.md`
- `ai/project/refs/module-map.md`
- `ai/project/refs/roadmap.md`

Do not modify current task, results, metrics, archives, source, tests, config,
or dependency files unless the human explicitly authorizes it.

## Bounded Continuous Execution Gate

Before every execution, the AI must read `ai/template/execution-policy.md`,
decompose the task, and judge risk instead of waiting for the human to
explicitly say "enable continuous execution".

Hard gates:

- Execute only when `ai/project/task.md.readiness = ready_to_execute`; if this
  run creates or rewrites `task.md`, stop at the confirmation handoff.
- L1 must be an independently acceptable vertical slice, not a mechanical step
  checklist.
- `execution_policy.task_tree` must record the L1 checklist and execution state.
- Every task node must have Green / Yellow / Red risk.
- Yellow only permits local low-risk correction inside the current L1/L2. It
  must not change public interfaces, data models, permissions, security,
  architecture direction, or acceptance.
- Every checkpoint must include evidence; a purely subjective Green is not valid.
- Red must stop for human confirmation.
- Any product direction, core architecture, public API, persistent data
  structure, security, payment, account, permission, large deletion, core
  rewrite, or high-cost option choice must stop.
- Any need to expand scope, permission, commands, network access, or acceptance
  must stop.
- `task_tree` write-back should happen at L1 start/done, Red, blocked, scope
  change, and final wrap-up; do not write back every tiny L3 operation.

The AI infers goal, scope, acceptance, and permissions, but must not cross
project rules, explicit human limits, `permission.modify.denied`, security
boundaries, or destructive-action limits.

## Strategy Update Gate

If the user asks to update the North Star, final shape, product constitution,
module map, roadmap, or project direction, or if
`ai/project/inbox/ideas/` contains non-`.gitkeep` new ideas, execute
`strategy_update`.

`strategy_update` may only:

- read official direction docs, decisions, constraints, and idea inputs;
- use `ai/project/proposals/final-shape-updates/_template.md` as its structural
  template;
- create `ai/project/proposals/final-shape-updates/YYYYMMDD-topic.md`;
- set the new proposal status to `proposed`;
- stop for human confirmation.

It must not directly modify official direction docs, source, tests, config, or
dependency files.

Only after the human explicitly confirms a proposal may
`apply_strategy_update` run. During application:

- the confirmed proposal should move from `proposed` to `accepted`, or already
  be `accepted`;
- after merge, update the proposal to `applied` and fill `applied_at`;
- if the human rejects the proposal, keep the file and set `status` to
  `rejected`;
- apply only confirmed content, without opportunistic expansion.

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

- Final shape / North Star / task-worthiness -> `ai/project/refs/final-shape.md`
- Current module structure / boundaries / dependency direction -> `ai/project/refs/module-map.md`
- Stage goals / near-term roadmap / deferred work -> `ai/project/refs/roadmap.md`
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
