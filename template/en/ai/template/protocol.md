# Protocol

AI Execution Template v0.8 separates reusable protocol from project-specific
execution context.

```text
ai/template/ = reusable execution protocol
ai/project/  = current project execution workspace
```

Template is protocol. Project is the field workspace.

## Execution Flow

```text
Project Bootstrap / Context Reconcile -> Project Confirm -> Task Draft -> Task Confirm -> Plan -> Execute -> Review -> Result
```

1. For project discovery, follow `ai/template/bootstrap.md`; do not summarize it.
2. End bootstrap with the Post-Bootstrap Handoff, including a confirmable
   in-chat summary and recommended next step. Do not only ask the human to open
   files and inspect them.
3. For task execution, follow `ai/template/prompt.md`; do not summarize it.
4. When new authoritative material appears, put it in `ai/project/inbox/` and
   follow `ai/template/reconcile.md`; do not summarize it. Reconciliation must
   produce a plan first and update context only after confirmation.
5. If `ai/project/task.md` is missing or incomplete, draft it from the current
   goal and confirmed project context, then stop with the Task Draft Handoff.
6. After task confirmation, check readiness, risk, model policy, refs,
   permission, and acceptance.
7. Execute only within the project task boundary.
8. Write `ai/project/result.json`, `ai/project/result.md`, and `ai/project/metrics.json`.

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

- architecture and module boundaries;
- run, build, test, and verification commands;
- security, compatibility, performance, data, and deployment constraints;
- documented decisions only when evidence exists.

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

The user can simply say "Reconcile the new material in ai/project/inbox/".
Use Context Reconcile Mode by following `ai/template/reconcile.md`.

Context Reconcile Mode must:

- read existing `ai/project/project.md`, `ai/project/runtime.md`, and `ai/project/refs/*.md`;
- read the new material named by the human; if none is named, read `ai/project/inbox/*.md`;
- produce a reconciliation plan first without modifying files;
- update `ai/project/project.md`, `ai/project/runtime.md`, and `ai/project/refs/*.md` only after human confirmation;
- not modify `task.md`, `result.*`, `metrics.json`, source, tests, config, or dependency files by default;
- not dump raw new material into refs; absorb long-lived, structured, reusable facts.

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
