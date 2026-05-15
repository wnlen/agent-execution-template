# Protocol

Agent Execution Template v0.8 separates reusable protocol from project-specific
execution context.

```text
ai/template/ = reusable execution protocol
ai/project/  = current repo execution context
```

Template is protocol. Project is repo-local context.

Here, "repo execution context" means the repo-local `ai/project/**` context,
not an external workspace / session / sandbox runtime. An external
runtime may enter the repository and read this protocol, but should not replace
`task.md`, file modification rules, acceptance criteria, or concrete coding
context.

The repo-local context stores both execution state and direction. The direction
layer answers "why is this worth doing and where should the project grow"; the
execution layer answers "what is this task and how will it be accepted."

```text
ai/project/refs/final-shape.md = project North Star
ai/project/refs/module-map.md  = current module map
ai/project/refs/roadmap.md     = staged roadmap
ai/project/task.md             = current execution contract
```

## Execution Flow

```text
Project Bootstrap / Context Reconcile / Strategy Update -> Project Confirm -> Task Draft -> Task Confirm -> Plan -> Execute -> Review -> Result
```

1. For project discovery, follow `ai/template/bootstrap.md`; do not summarize it.
2. End bootstrap with the Post-Bootstrap Handoff, including a confirmable
   in-chat summary and recommended next step. Do not only ask the human to open
   files and inspect them.
3. For task execution, follow `ai/template/prompt.md`; do not summarize it.
4. When new authoritative material appears, put it in `ai/project/inbox/` and
   follow `ai/template/reconcile.md`; do not summarize it. Reconciliation must
   produce a plan first and update context only after confirmation.
5. When a new idea would change the final product shape, module boundaries, or
   roadmap, put it in `ai/project/inbox/ideas/`, then create a
   `strategy_update` task to produce a proposal.
6. Only after the human confirms the proposal may an `apply_strategy_update`
   task modify `final-shape.md`, `module-map.md`, or `roadmap.md`.
7. If `ai/project/task.md` is missing or incomplete, draft it from the current
   goal and confirmed project context, then stop with the Task Draft Handoff.
8. After task confirmation, check readiness, risk, model policy, refs,
   permission, and acceptance.
9. Execute only within the project task boundary.
10. Write `ai/project/result.json`, `ai/project/result.md`, and `ai/project/metrics.json`.

## Execution Authorization Modes

Before task execution, read `ai/template/execution-policy.md`.

The default execution policy is `auto`: the AI first decomposes L1 tasks and
judges Green / Yellow / Red risk, then chooses `normal` or `bounded_continuous`.
Use `normal` when there are fewer than 2 L1 tasks; automatically use
`bounded_continuous` when there are 2 or more L1 tasks. Each L1 must be an
independently acceptable vertical slice. Execution is allowed only for an
existing task with `readiness = ready_to_execute`; if this run creates or
rewrites the task contract, stop at the confirmation handoff. Only Red stops for
human confirmation, and Yellow only permits local low-risk correction inside the
current L1/L2.

Task contracts are layered by complexity. A single-L1, Green, low-risk task uses
a compact task contract with only the goal, scope, acceptance, permissions,
verification commands, and minimal `execution_policy.task_tree`. Multi-L1,
Yellow/Red, cross-module, continuously executed, or highly uncertain tasks use
an expanded task contract and may include checkpoint, model policy, and fuller
task-tree fields as needed.

Task tree, risk rubric, checkpoint evidence, and `task_tree` write-back rules
are defined in `ai/template/execution-policy.md`.

## Bootstrap Mode

Bootstrap Mode prepares stable project understanding:

- `ai/project/project.md`
- `ai/project/refs/*.md`

Use Bootstrap Mode when `ai/project/project.md` is empty, placeholder-only,
stale, incomplete, or the user asks to bootstrap project context.

Bootstrap Mode must:

- read only the approved bootstrap sources first;
- summarize stable project facts into `ai/project/project.md`;
- update focused refs when durable architecture, command, constraint, or
  decision facts can be inferred;
- create `ai/project/task.md` only if the human also provides a current task,
  and only draft the task contract;
- mark unknown facts as `Unknown` instead of guessing;
- ask at most 3 questions only when answers change scope, risk, permission, or
  acceptance;
- stop after writing draft project context files; if a current task was
  provided, it may also write a task draft before stopping;
- never edit source, business, config, dependency, or generated files.

### Bootstrap Read Scope

Read high-signal sources in this order:

1. Root documentation:
   - `README*`
   - `AGENTS.md`
   - `CLAUDE.md`
   - `CONTRIBUTING*`
   - `CHANGELOG*`
2. Package and build metadata:
   - `package.json`
   - `pyproject.toml`
   - `Cargo.toml`
   - `go.mod`
   - `pom.xml`
   - `build.gradle*`
   - `Makefile`
3. Project documentation:
   - `docs/**`
   - prefer overview, architecture, setup, testing, deployment, API, ADR, and
     decision files.
4. Existing AI context:
   - `ai/project/refs/*.md`
5. Shallow repository structure:
   - source, test, config, and documentation directories only.

If docs and manifests are missing or insufficient, infer from code with a
bounded read:

- inspect top-level directories and filenames first;
- inspect likely entrypoints such as `src/`, `app/`, `lib/`, `packages/`,
  `services/`, `cmd/`, `internal/`, `server/`, `client/`, `test/`, `tests/`;
- inspect route, module, config, and test files only enough to identify
  project purpose, module boundaries, commands, and constraints;
- do not read the whole codebase unless the human explicitly authorizes it.

Do not read by default:

- dependency directories such as `node_modules`, `vendor`, `.venv`;
- generated outputs such as `dist`, `build`, `target`, `coverage`;
- lockfiles except to infer package manager;
- secret or environment files such as `.env*`;
- archive/history directories unless the user explicitly references them.

If the repository is large, read the root docs and manifests first, then ask
before expanding the read scope.

### Bootstrap Outputs

`ai/project/project.md` should contain long-lived project identity:

- name, purpose, and primary users;
- language, framework, package manager, and test runner;
- source, test, config, and documentation layout;
- stable constraints, conventions, and important unknowns.

`ai/project/refs/*.md` should contain focused durable context:

- project North Star, final shape, and task-worthiness criteria;
- current module map, staged roadmap, and direction constraints;
- architecture and module boundaries;
- run, build, test, and verification commands;
- security, compatibility, performance, data, and deployment constraints;
- documented decisions only when evidence exists.

Recommended routing:

```text
final shape / North Star / task worthiness -> ai/project/refs/final-shape.md
current module structure / boundaries      -> ai/project/refs/module-map.md
stage goals / near-term roadmap            -> ai/project/refs/roadmap.md
architecture / API / technical boundaries  -> ai/project/refs/architecture.md
commands / verification                    -> ai/project/refs/commands.md
non-negotiable constraints                 -> ai/project/refs/constraints.md
confirmed key decisions                    -> ai/project/refs/decisions.md
```

After writing drafts, stop with the Post-Bootstrap Handoff from
`ai/template/bootstrap.md`. If the human did not provide a current task,
recommend the next best task. If the human already provided a current task,
you may also draft `ai/project/task.md`, but do not execute.

## Task Draft Mode

Task Draft Mode prepares the current execution contract:

- `ai/project/task.md`

Use Task Draft Mode when project context is confirmed but `ai/project/task.md`
is empty, placeholder-only, incomplete, or the human provides a new task goal
that was not already drafted during bootstrap.

Task Draft Mode should:

- read confirmed `ai/project/project.md`;
- read relevant `ai/project/refs/*.md`;
- convert the current human goal into task type, priority, risk, scope,
  permissions, command policy, model policy, and acceptance criteria;
- ask at most 3 questions only for scope, risk, permission, or acceptance
  blockers;
- stop after writing the task draft with the Task Draft Handoff from
  `ai/template/prompt.md`;
- never edit source or business files.

## Context Reconcile Mode

Context Reconcile Mode absorbs new authoritative material and corrects existing
long-lived context.

New material should usually live in:

- `ai/project/inbox/*.md`
- `docs/**`

Processed material is moved to `ai/project/inbox/processed/` and is not read
again as pending intake by default.

The user can simply say "Reconcile the new material in ai/project/inbox/".
Use Context Reconcile Mode by following `ai/template/reconcile.md`.

Context Reconcile Mode must:

- read existing `ai/project/project.md`, `ai/project/runtime.md`, and `ai/project/refs/*.md`;
- read the new material named by the human; if none is named, read `ai/project/inbox/*.md`;
- produce a reconciliation plan first without modifying files;
- update `ai/project/project.md`, `ai/project/runtime.md`, and `ai/project/refs/*.md` only after human confirmation;
- after applying reconciliation, move processed `ai/project/inbox/*.md` material to `ai/project/inbox/processed/`;
- not modify `task.md`, `result.*`, `metrics.json`, source, tests, config, or dependency files by default;
- not dump raw new material into refs; absorb long-lived, structured, reusable facts.

If new material would change directional content in `final-shape.md`,
`module-map.md`, or `roadmap.md`, Context Reconcile Mode may only recommend a
`strategy_update`; it must not directly edit those files.

## Strategy Update Mode

Strategy Update Mode handles changes to project direction, final shape, module
boundaries, or roadmap.

Use it when:

- `ai/project/inbox/ideas/` contains new product, business, architecture, or
  direction ideas;
- the user asks to update the North Star, final shape, product constitution,
  module map, or roadmap;
- a routine task discovers that the current execution goal may conflict with
  project direction.

### `strategy_update`

`strategy_update` only produces a proposal. It does not write code and does not
modify official direction files.

It must read:

- `ai/project/refs/final-shape.md`
- `ai/project/refs/module-map.md`
- `ai/project/refs/roadmap.md`
- `ai/project/refs/decisions.md`
- `ai/project/refs/constraints.md`
- human-specified new material; if none is named, read `ai/project/inbox/ideas/*`

Write the proposal to:

```text
ai/project/proposals/final-shape-updates/YYYYMMDD-topic.md
```

Use `ai/project/proposals/final-shape-updates/_template.md` as the structural
template.

The proposal must include:

1. Summary of the new idea
2. Alignment with current `final-shape.md`
3. Conflicts
4. Parts to absorb
5. Parts to reject
6. Impact on the module map
7. Impact on the roadmap
8. Suggested diff
9. Risks
10. Merge recommendation

Stop after producing the proposal and wait for human confirmation. Do not
modify `final-shape.md`, `module-map.md`, `roadmap.md`, source, tests, config,
or dependency files.

### `apply_strategy_update`

`apply_strategy_update` only applies a confirmed proposal.

It requires:

- explicit human confirmation that a proposal may be merged;
- the proposal is already `accepted`, or is updated from `proposed` to
  `accepted` immediately before execution based on explicit human confirmation;
- `task.md.permission.modify.allowed` includes the official direction files
  that will be changed;
- applying only the confirmed proposal content, without opportunistic expansion.

Allowed updates:

- `ai/project/refs/final-shape.md`
- `ai/project/refs/module-map.md`
- `ai/project/refs/roadmap.md`
- `ai/project/refs/decisions.md` or `constraints.md` when necessary

After applying:

- update proposal status to `applied`;
- fill `applied_at`;
- make `result.md` list the merged proposal, changed files, and items left
  unmerged.

If the human rejects a proposal, keep the proposal file, update `status` to
`rejected`, and do not delete that historical strategy record.

## Human-Minimal Task

The human should normally provide intent and confirm generated project and task
contracts. The agent should draft routine detail from existing docs, manifests,
refs, and project files.

- Ask at most 3 clarification questions.
- Ask only when the answer changes scope, risk, permission, or acceptance.
- Do not ask about details that can be safely inferred from project files.
- Convert safe uncertainty into explicit assumptions in `ai/project/result.json`.
- If acceptance remains unverifiable, stop with `status = "blocked"`.
- If the task is executable, proceed without further human interaction.

## Model Division

Follow `ai/project/task.md.model_policy`.

- Default cheap.
- Escalate for judgment.
- Record why.

Use the default tier for routine execution. Use `strong` only when an
escalation trigger is hit and the required role is listed in
`strong_model_roles`.

If the host cannot switch models, stop or mark the task `partial`/`blocked`
with the needed strong-model role.

## Sync Rules

When importing from this template repo into a real project:

- Overwrite only `ai/template/**`.
- Never overwrite `ai/project/**`.

When flowing improvements from a real project back into this template repo:

- Return only `ai/template/**`.
- Never return `ai/project/**`.
