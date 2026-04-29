# AI Execution Template

AI Execution Template is a minimal file-based execution protocol for AI Coding Agents.

It gives each coding task a stable `ai/` execution layer:

- `ai/prompt.md` starts the agent.
- `ai/task.md` defines the current task, scope, permissions, risk, and acceptance criteria.
- `ai/runtime.md` provides compressed always-read context.
- `ai/refs/` stores detailed references loaded only when needed.
- `ai/result.json` stores the latest auditable execution result.
- `ai/archive/` stores historical tasks and results without polluting runtime context.

## MVP Usage

1. Copy the `ai/` folder into your software project.
2. Edit `ai/runtime.md` once for your project.
3. For each AI coding task, edit `ai/task.md`.
4. Start your AI Coding Agent with `ai/prompt.md`.
5. Require the agent to write `ai/result.json` after each task.
6. Archive completed tasks/results when needed.

## Default Execution Loop

```text
Read task -> Check readiness -> Check risk -> Read runtime -> Read refs only when needed -> Read related project files -> Execute within permission boundaries -> Verify when possible -> Write result.json -> Propose runtime update only when needed
```

## Core Rules

- Default read set is minimal: `prompt.md`, `task.md`, `runtime.md`.
- Task must pass readiness before code edits.
- Risk must be acceptable before execution.
- Permissions are allowlist/denylist-based, not simple yes/no.
- `success` requires verification evidence.
- `runtime.md` is not a project diary.
- `result.json` is the single authoritative latest result.

Protocol: v0.3 Final MVP scaffold.
