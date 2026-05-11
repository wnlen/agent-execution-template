# AI Execution Bootstrap

Do not summarize this file.
Execute the bootstrap workflow below.

You are bootstrapping project context for AI Execution Template.

Goal: build the stable project understanding that future tasks will rely on.
This is a discovery and confirmation step, not an implementation step.

Your job is to inspect the project, create or update `ai/project/project.md`
and relevant `ai/project/refs/*`, then stop with the Post-Bootstrap Handoff.

## First Read

1. `ai/template/protocol.md`
2. `ai/template/rules/core.md`
3. Existing `ai/project/project.md`
4. Existing `ai/project/refs/*.md` if present

## Bootstrap Mission

Create or update:

- `ai/project/project.md`
- `ai/project/refs/architecture.md` when architecture can be inferred
- `ai/project/refs/commands.md` when run/test/build commands can be inferred
- `ai/project/refs/constraints.md` when constraints can be inferred
- `ai/project/refs/decisions.md` only when durable decisions are documented

Create `ai/project/task.md` only if the human also provides a current task.
If you create `ai/project/task.md`, draft only the task contract. Do not enter execution.

Do not edit source code, tests, app config, dependency files, generated files,
runtime files, result files, or metrics files during bootstrap.

## Reading Order

Read high-signal project evidence in this order:

1. Root docs: `README*`, `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING*`, `CHANGELOG*`
2. Manifests: `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`,
   `pom.xml`, `build.gradle*`, `Makefile`
3. Project docs: `docs/**`, preferring overview, architecture, setup, testing,
   deployment, API, ADR, and decision files
4. Existing AI refs: `ai/project/refs/*.md`
5. Shallow repository structure for source, test, config, and docs directories

If docs and manifests are missing or insufficient, infer from code with a
bounded read:

- inspect top-level directories and filenames first;
- inspect likely entrypoints such as `src/`, `app/`, `lib/`, `packages/`,
  `services/`, `cmd/`, `internal/`, `server/`, `client/`, `test/`, `tests/`;
- inspect route, module, config, and test files only enough to identify
  project purpose, module boundaries, commands, and constraints;
- do not read the whole codebase unless the human explicitly authorizes it.

Do not read dependency folders, build outputs, coverage outputs, lockfiles
except to infer package manager, secret files, environment files, or archives
unless the human explicitly references them.

## Confirmation Dimensions

After reading, summarize and ask the human to confirm or correct these points:

- project name, purpose, and primary users;
- technology stack, package manager, and test runner;
- source, test, config, and documentation layout;
- main modules and boundaries;
- important run, build, test, and verification commands;
- durable constraints, security boundaries, compatibility requirements, and
  high-risk areas;
- unknowns that would affect future task precision.

Ask at most 3 questions at a time. Ask only questions whose answers would
change project identity, commands, boundaries, constraints, risk, permission,
or acceptance.

## Output Rules

- Mark unknown facts as `Unknown`; do not present guesses as facts.
- Record evidence sources in the relevant file when useful.
- Keep `ai/project/project.md` stable and long-lived.
- Keep `ai/project/refs/*.md` focused; do not turn refs into a project diary.
- Stop after writing drafts and asking for confirmation.
- Do not execute implementation work in the same run.

## Post-Bootstrap Handoff

After writing project context drafts, do not only ask the human to open files
and inspect them. The final response must include a confirmable summary so the
human can confirm or correct directly in chat.

If the human already provided a current task goal in the bootstrap request, you
must also draft `ai/project/task.md`, then ask the human to confirm both the
project understanding and the task draft.

If the human did not provide a current task goal, recommend the next best task
based on the project state.

The final response must use one of these shapes.

When there is no current task goal:

```text
Bootstrap is complete. I wrote the project context.

My understanding of the project:
- Project:
- Tech stack:
- Main modules:
- Common commands:
- Important constraints:
- Still uncertain: up to 3 items; write "none" if there are none

Recommended next step:
1. Priority task:
   Reason:
2. Alternative task:
   Reason:

Written:
- ai/project/project.md
- ai/project/refs/architecture.md
- ai/project/refs/commands.md
- ai/project/refs/constraints.md
- ai/project/refs/decisions.md

Reply with:
- Confirm, draft task 1
- Confirm, but do: <one-sentence task>
- Correction: <what to change>
```

When there is already a current task goal:

```text
Bootstrap is complete. I wrote the project context and task draft.

My understanding of the project:
- Project:
- Tech stack:
- Main modules:
- Common commands:
- Important constraints:
- Still uncertain: up to 3 items; write "none" if there are none

Task draft summary:
- Goal:
- Scope:
- Out of scope:
- Acceptance:
- Risk:
- Permissions needed:

Written:
- ai/project/project.md
- ai/project/refs/architecture.md
- ai/project/refs/commands.md
- ai/project/refs/constraints.md
- ai/project/refs/decisions.md
- ai/project/task.md

Reply with:
- Confirm, execute
- Correction: <what to change>
```

If important unknowns remain, list at most 3 of them under "Still uncertain".
Do not make the human hunt through files to find issues; file paths are only
for traceability.
