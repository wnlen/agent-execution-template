# AI Execution Template

> The missing execution contract between AI coding agents and your codebase.

[![Protocol](https://img.shields.io/badge/protocol-v0.4-blue)](#protocol)
[![Agent Ready](https://img.shields.io/badge/agents-Codex%20%7C%20Claude%20Code%20%7C%20Cursor-green)](#works-with)
[![Token Efficient](https://img.shields.io/badge/token--efficient-profile%20v0.1-orange)](docs/token-efficient-protocol-v0.1.md)
[![License](https://img.shields.io/badge/license-TBD-lightgrey)](#license)

AI Execution Template is a tiny file-based protocol that makes AI coding work
bounded, auditable, and repeatable.

Instead of asking an agent to "just fix it", give it a task contract:

```text
Plan -> Execute -> Review -> Result
```

The goal is not cheaper prompts. The goal is more accepted work per unit of
model cost.

## Why

AI coding agents are powerful, but raw chat sessions are hard to trust:

- The task boundary drifts.
- The agent reads too much or too little context.
- Success is claimed without verification.
- Good execution history disappears into chat logs.
- Expensive models do routine work that cheaper models could handle.

This repo gives agents a small operating system made of files.

## What You Get

- **Clear task boundaries** through `ai/task.md`
- **Compressed project context** through `ai/runtime.md`
- **Lazy-loaded references** through `ai/refs/`
- **Machine-readable results** through `ai/result.json`
- **Human-readable summaries** through `ai/result.md`
- **Token-efficiency metrics** through `ai/metrics.json`
- **Optional schemas** for validation and automation

## Quick Start

Copy the `ai/` directory into any software project:

```bash
cp -R ai /path/to/your/project/
```

Then edit:

```text
ai/runtime.md   # stable project context
ai/task.md      # current task, scope, permissions, acceptance
```

Start your AI coding agent with:

```text
ai/prompt.md
```

After execution, review:

```text
ai/result.json    # authoritative machine-readable result
ai/result.md      # human-readable summary
ai/metrics.json   # model, token, time, success, reuse signals
```

## The Core Idea

Default to cheap execution. Escalate only at critical judgment points.

- Strong models act as planner, reviewer, failure analyst, or architecture auditor.
- Low-cost models execute bounded tasks with clear context and acceptance criteria.
- Every execution leaves enough evidence to verify the result and improve the protocol.

See [Token-Efficient AI Execution Protocol v0.1](docs/token-efficient-protocol-v0.1.md).

## Protocol

```text
Read task
-> Check readiness
-> Check risk
-> Decide execution tier
-> Read runtime
-> Read refs only when needed
-> Read related project files
-> Execute within permission boundaries
-> Verify when possible
-> Write result.json / result.md / metrics.json
-> Propose runtime update only when needed
```

## File Layout

```text
ai/
  prompt.md              # agent startup prompt
  task.md                # current task contract
  runtime.md             # compact always-read context
  refs/                  # detailed docs loaded only when needed
  result.json            # latest authoritative result
  result.md              # latest human-readable result
  metrics.json           # model/cost/time/success signals
  schemas/               # optional validation schemas
  archive/               # old tasks and results
```

## Works With

AI Execution Template is tool-agnostic. It is designed to work with:

- Codex
- Claude Code
- Cursor
- Aider
- Any coding agent that can read and write project files

## Core Rules

- Default read set is minimal: `prompt.md`, `task.md`, `runtime.md`.
- Task must pass readiness before code edits.
- Risk must be acceptable before execution.
- Strong-model escalation is reserved for unclear requirements, high-risk changes, architecture judgment, repeated failure, or acceptance disputes.
- Permissions are allowlist/denylist-based, not simple yes/no.
- `success` requires verification evidence.
- `runtime.md` is not a project diary.
- `result.json` is the single authoritative latest result.
- `metrics.json` records whether the execution produced acceptable output for the cost.

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

Protocol: v0.4 file scaffold with Token-Efficient profile v0.1.
