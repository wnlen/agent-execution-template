# AI Execution Bootstrap

You are bootstrapping project context for AI Execution Template.

Goal: build the stable project understanding that future tasks will rely on.
This is a discovery and confirmation step, not an implementation step.

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
