# AI Execution Template

> The missing execution contract between AI coding agents and your codebase.

[![Protocol](https://img.shields.io/badge/protocol-v0.5-blue)](#protocol)
[![Agent Ready](https://img.shields.io/badge/agents-Codex%20%7C%20Claude%20Code%20%7C%20Cursor-green)](#works-with)
[![Token Efficient](https://img.shields.io/badge/token--efficient-profile%20v0.1-orange)](docs/token-efficient-protocol-v0.1.md)
[![License](https://img.shields.io/badge/license-TBD-lightgrey)](#license)

AI Execution Template is a tiny file-based protocol that makes AI coding work
bounded, auditable, and repeatable.

```text
ai/template/ = reusable execution protocol
ai/project/  = current project execution workspace
```

Template is protocol. Project is the field workspace.

## Why

AI coding agents are powerful, but raw chat sessions are hard to trust:

- The task boundary drifts.
- The agent reads too much or too little context.
- Success is claimed without verification.
- Good execution history disappears into chat logs.
- Expensive models do routine work that cheaper models could handle.

This repo gives agents a small operating system made of files.

## What You Get

- **Reusable protocol** through `ai/template/`
- **Project-local workspace** through `ai/project/`
- **Minimal human input** through `ai/project/intake.md`
- **Clear task boundaries** through `ai/project/task.md`
- **Compressed project context** through `ai/project/runtime.md`
- **Lazy-loaded references** through `ai/project/refs/`
- **Auditable outputs** through `ai/project/result.json`, `ai/project/result.md`, and `ai/project/metrics.json`

## Quick Start

Copy the `ai/` directory into any software project:

```bash
cp -R ai /path/to/your/project/
```

Fast path:

```text
ai/project/intake.md    # one or two sentences plus known constraints
```

Strict path:

```text
ai/project/project.md   # stable project identity
ai/project/runtime.md   # current execution context
ai/project/task.md      # scope, permissions, acceptance, model policy
```

Start your AI coding agent with:

```text
Read ai/template/prompt.md
```

After execution, review:

```text
ai/project/result.json    # authoritative machine-readable result
ai/project/result.md      # human-readable summary
ai/project/metrics.json   # model, token, time, success, reuse signals
```

## Protocol

```text
Intake
-> Plan
-> Check readiness, risk, model policy, refs, permissions
-> Execute
-> Verify
-> Write result.json / result.md / metrics.json
-> Propose runtime update only when needed
```

Default cheap. Escalate for judgment. Record why.

See [Token-Efficient AI Execution Protocol v0.1](docs/token-efficient-protocol-v0.1.md).

## File Layout

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
      task.schema.json
      result.schema.json
      metrics.schema.json

  project/
    project.md
    runtime.md
    intake.md
    task.md
    result.json
    result.md
    metrics.json
    refs/
    archive/
```

## Sync Rules

From this template repo into a real project:

- Overwrite only `ai/template/**`.
- Never overwrite `ai/project/**`.

From a real project back into this template repo:

- Return only `ai/template/**`.
- Never return `ai/project/**`.

## Works With

AI Execution Template is tool-agnostic. It is designed to work with:

- Codex
- Claude Code
- Cursor
- Aider
- Any coding agent that can read and write project files

## Core Rules

- The startup entry is `ai/template/prompt.md`.
- Human input should start from `ai/project/intake.md` unless strict permissions are needed.
- The agent should ask at most 3 clarification questions before execution.
- Task must pass readiness before code edits.
- Risk must be acceptable before execution.
- Model division is declared in `ai/project/task.md.model_policy`.
- Strong-model escalation must be recorded in `ai/project/metrics.json`.
- Permissions are allowlist/denylist-based, not simple yes/no.
- `success` requires verification evidence.
- `ai/project/runtime.md` is not a project diary.
- `ai/project/result.json` is the single authoritative latest result.

## Who This Is For

- Developers using AI agents for real code changes
- Teams that need auditable AI execution records
- Builders experimenting with multi-agent or low-cost model workflows
- Anyone tired of losing important decisions inside chat history

## Roadmap

- More example tasks and results
- Schema validation examples
- Archive conventions
- Model escalation playbooks
- Evaluation templates for accepted work per cost

## Star This Repo

Star this repo if you believe the next step for AI coding is not stronger chat,
but better execution protocols.

## License

License is not set yet.

Protocol: v0.5 template/project scaffold with Token-Efficient profile v0.1.
