# Protocol

AI Execution Template v0.7 separates reusable protocol from project-specific
execution context.

```text
ai/template/ = reusable execution protocol
ai/project/  = current project execution workspace
```

Template is protocol. Project is the field workspace.

## Execution Flow

```text
Project Bootstrap -> Project Confirm -> Task Draft -> Task Confirm -> Plan -> Execute -> Review -> Result
```

1. For project discovery, read `ai/template/bootstrap.md`.
2. Confirm generated `ai/project/project.md` and relevant `ai/project/refs/*.md`.
3. For task execution, read `ai/template/prompt.md`.
4. If `ai/project/task.md` is missing or incomplete, draft it from the current
   goal and confirmed project context, then stop for confirmation.
5. After task confirmation, check readiness, risk, model policy, refs,
   permission, and acceptance.
6. Execute only within the project task boundary.
7. Write `ai/project/result.json`, `ai/project/result.md`, and `ai/project/metrics.json`.

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
- create `ai/project/task.md` only if the human also provides a current task;
- mark unknown facts as `Unknown` instead of guessing;
- ask at most 3 questions only when answers change scope, risk, permission, or
  acceptance;
- stop after writing draft project context files;
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

After writing drafts, stop and ask the human to review and confirm before task
drafting or Execution Mode begins.

## Task Draft Mode

Task Draft Mode prepares the current execution contract:

- `ai/project/task.md`

Use Task Draft Mode when project context is confirmed but `ai/project/task.md`
is empty, placeholder-only, incomplete, or the human provides a new task goal.

Task Draft Mode should:

- read confirmed `ai/project/project.md`;
- read relevant `ai/project/refs/*.md`;
- convert the current human goal into task type, priority, risk, scope,
  permissions, command policy, model policy, and acceptance criteria;
- ask at most 3 questions only for scope, risk, permission, or acceptance
  blockers;
- stop after writing the task draft and ask for confirmation;
- never edit source or business files.

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
