# AI Execution Template

> 30-second installable execution protocol for AI coding agents.

```bash
npx @wnlen/ai-execution-template init
```

Then edit only:

```text
ai/project/project.md
ai/project/task.md
```

Run your agent with:

```text
Read ai/template/prompt.md
```

Full spec: [docs/SPEC.md](docs/SPEC.md)

## Why

AI coding agents need a small execution contract:

- `ai/template/` is the reusable protocol area.
- `ai/project/` is your project workspace.
- `update` only overwrites `ai/template/**`.
- `update` never touches `ai/project/**`.

## Commands

```bash
npx @wnlen/ai-execution-template init
```

Creates `ai/` in the current project. Existing `ai/project/**` files are kept.

```bash
npx @wnlen/ai-execution-template update
```

Updates only `ai/template/**`.

```bash
npx @wnlen/ai-execution-template doctor
```

Checks whether the required template and project files exist.

## Verify

```bash
npx @wnlen/ai-execution-template doctor
```

`doctor` prints the installed template version and reports `[OK]`, `[WARN]`, or
`[MISSING]` for required files.

## Installed Layout

```text
ai/
  README.md

  template/
    prompt.md
    protocol.md
    rules/
      core.md
      output.md
    schemas/
      result.schema.json
      metrics.schema.json

  project/
    project.md
    runtime.md
    task.md
    result.json
    result.md
    metrics.json
    refs/
    archive/
```

## Daily Use

1. Edit `ai/project/project.md` once for stable project context.
2. Edit `ai/project/task.md` for the current task.
3. Ask Codex, Claude Code, Cursor, or another agent to read `ai/template/prompt.md`.
4. Review `ai/project/result.md`, `ai/project/result.json`, and `ai/project/metrics.json`.

## Safety

- `init` creates missing project files but does not overwrite existing `ai/project/**`.
- `update` only updates `ai/template/**`.
- `doctor` shows `[OK]`, `[WARN]`, and `[MISSING]` status lines.
- `template/ai/**` is the npm install source. Root `ai/**` is this repo's dogfood workspace.

Protocol: v0.7 installable template with Token-Efficient profile v0.1.
