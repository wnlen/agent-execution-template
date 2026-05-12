# AI Execution Template

English | [简体中文](README.zh-CN.md)

[![npm](https://img.shields.io/npm/v/@wnlen/ai-execution-template?color=cb3837)](https://www.npmjs.com/package/@wnlen/ai-execution-template)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![protocol](https://img.shields.io/badge/protocol-v0.8-blue.svg)](docs/SPEC.md)
[![agent agnostic](https://img.shields.io/badge/agent-agnostic-111111.svg)](#works-with)

> A 30-second execution protocol for AI coding agents.
> Install it into any repository, let the agent bootstrap project context from existing docs, confirm the task contract, and keep execution auditable.

```bash
npx -y @wnlen/ai-execution-template init --lang en
```

Then tell your coding agent:

```text
Start initializing this project
```

AI Execution Template is not another agent framework. It is the missing execution layer between your repository and tools like Codex, Claude Code, Cursor, Aider, or any other AI coding agent.

It turns AI coding from:

```text
chat prompt -> ad hoc edits -> unclear verification -> lost context
```

into:

```text
bootstrap project -> confirm context -> draft task -> confirm contract -> execute -> recorded result
```

## Why It Exists

AI coding agents are powerful, but most teams still run them through loose chat context. That creates predictable failure modes:

- You repeat the same project background every session.
- The agent drifts beyond the task boundary.
- Risk, permissions, and acceptance criteria stay implicit.
- Code changes are made without reliable verification records.
- Useful execution history disappears into chat logs.
- Template upgrades accidentally overwrite project-specific context.
- Cheap and strong models are used without a clear division of labor.
- The two files that define execution precision are often written by hand.
- Execution can become stable while still lacking a direction layer for judging
  whether a task is worth doing or whether the project is drifting.

AI Execution Template fixes this with a small, installable file protocol:

```text
ai/template/  reusable execution protocol
ai/project/   project-specific working context and direction layer
```

`update` can refresh the protocol, while your project workspace stays protected.

## Quick Start

Install the protocol into the current repository:

```bash
npx -y @wnlen/ai-execution-template init --lang en
```

Ask your agent to bootstrap project context from existing docs and manifests:

```text
Start initializing this project
```

The agent will generate project context and summarize what needs confirmation,
risks, and the recommended next step in chat:

```text
ai/project/project.md
ai/project/refs/*
```

Reply with corrections, or confirm and continue:

```text
Continue this project
```

The agent will draft or execute from current context:

```text
ai/project/task.md
```

After the task draft is confirmed, you can also say:

```text
Continue this project
```

Review the execution output:

```text
ai/project/result.md
ai/project/result.json
ai/project/metrics.json
```

Check the installation:

```bash
npx -y @wnlen/ai-execution-template doctor
```

Upgrade only the reusable protocol files:

```bash
npx -y @wnlen/ai-execution-template update --lang en
```

Print the direction-amendment entrypoint:

```bash
npx -y @wnlen/ai-execution-template strategy --lang en
```

## What You Get

| Capability | What it means |
| --- | --- |
| Installable protocol | Add an AI execution contract to any repository in seconds. |
| Agent agnostic | Works with Codex, Claude Code, Cursor, Aider, and other coding agents. |
| Bootstrap mode | Reads approved docs/manifests, falls back to bounded code inference, drafts `project.md` and refs, then stops for confirmation. |
| Project North Star | Stores final shape, task-worthiness criteria, and drift criteria in `ai/project/refs/final-shape.md`. |
| Strategy amendment gate | New direction goes through `inbox/ideas/`, a proposal, human confirmation, then an explicit apply task. |
| Protected project context | `update` refreshes `ai/template/**` without overwriting `ai/project/**`. |
| Project context refresh | `refresh` backs up old `ai/project/**`, creates a fresh project context, and imports the old context into the inbox for reconciliation. |
| Bounded task execution | Goals, scope, permissions, risk, and acceptance criteria live in one task file. |
| Auditable results | Every run can leave human-readable output, machine-readable facts, and metrics. |
| Token-efficient model policy | Cheap models handle bounded work; strong models are reserved for judgment points. |
| Upgradeable template | Reuse protocol improvements without losing local project memory. |
| Doctor checks | Validate required files and template version before running the agent. |

## Installed Layout

```text
ai/
  README.md

  template/
    VERSION
    bootstrap.md
    prompt.md
    reconcile.md
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
    inbox/
      ideas/
      raw/
    proposals/
      final-shape-updates/
    refs/
      final-shape.md
      module-map.md
      roadmap.md
    archive/
```

The split is the core design:

- `ai/template/**` is reusable protocol. It can be safely updated from this package.
- `ai/project/**` is your project workspace. It stores local context, tasks, references, results, and metrics.

## Commands

### `init`

```bash
npx -y @wnlen/ai-execution-template init --lang en
```

Creates `ai/` in the current project.

- Updates or creates `ai/template/**`.
- Creates missing `ai/project/**` files.
- Keeps existing `ai/project/**` files intact.
- Use `--lang zh` or omit `--lang` for the Chinese template.

### `update`

```bash
npx -y @wnlen/ai-execution-template update --lang en
```

Updates only `ai/template/**`.

Use this when the protocol improves but your project context should remain untouched.
Without `--lang`, `update` follows the installed language in `ai/template/LANG`.

### `refresh`

```bash
npx -y @wnlen/ai-execution-template refresh --lang en
```

Refreshes project context.

- Renames old `ai/project/**` to `ai/project.backup.<timestamp>`.
- Generates a fresh `ai/project/**`.
- Copies the old context into `ai/project/inbox/raw/old-project/`.
- Prints the next prompt to give your agent.

### `doctor`

```bash
npx -y @wnlen/ai-execution-template doctor
```

Checks the installed template version and required files.

It reports:

- `[OK]` for present and usable files.
- `[WARN]` for empty required project context files.
- `[MISSING]` for missing required files.

### `reconcile`

```bash
npx -y @wnlen/ai-execution-template reconcile --lang en
```

Prints the shortest context-reconcile instructions.

### `strategy`

```bash
npx -y @wnlen/ai-execution-template strategy --lang en
```

Prints the shortest direction-amendment instructions. New ideas go to
`ai/project/inbox/ideas/`, then the agent generates a `strategy_update`
proposal. After human confirmation, `apply_strategy_update` merges it.

## Execution Model

AI Execution Template defines a simple loop:

```text
Project Bootstrap -> Project Confirm -> Task Draft -> Task Confirm -> Plan -> Execute -> Review -> Result
```

The point is not to build a complex orchestrator. The point is to make one AI-assisted coding run clear enough to execute, verify, rerun, and audit.

The protocol records:

- approved bootstrap sources,
- the task contract,
- assumptions and risk,
- verification attempts,
- human-readable results,
- machine-readable execution facts,
- model tier and cost signals.

## Context Reconcile

When a more complete or more authoritative document appears after the project has been using the template, put it in:

```text
ai/project/inbox/
```

Then ask your agent:

```text
Reconcile the new material in ai/project/inbox/
```

The agent must produce a reconciliation plan first, wait for confirmation, then merge long-lived facts into `project.md`, `runtime.md`, and `refs/*`.

## Project North Star

Long-term direction does not belong in the current task. AI Execution Template
stores the direction layer inside protected `ai/project/**` files:

```text
ai/project/refs/final-shape.md       # project North Star / final shape
ai/project/refs/module-map.md        # current module map
ai/project/refs/roadmap.md           # staged roadmap
ai/project/inbox/ideas/              # new idea intake
ai/project/proposals/final-shape-updates/
ai/project/proposals/final-shape-updates/_template.md
```

Routine execution tasks must not edit the North Star, module map, or roadmap
directly. Direction changes should follow:

```text
idea -> strategy_update proposal -> human confirm -> apply_strategy_update
```

That keeps `task.md` as the current work order while `final-shape.md` explains
why a task is worth doing and where the project should grow.

## Token-Efficient by Design

The optional token-efficient profile gives agents a model division rule:

- Use `cheap` models for bounded reads, small edits, drafts, repetitive checks, and mechanical cleanup.
- Use `standard` models for moderate implementation work.
- Use `strong` models for planning, architecture review, risk judgment, failure review, and acceptance disputes.

The goal is not fewer tokens at any cost. The goal is more acceptable work per unit of model cost.

Read more in [Token-Efficient AI Execution Protocol v0.1](docs/token-efficient-protocol-v0.1.md).

## Works With

AI Execution Template is intentionally tool-neutral. Any agent that can read project files and follow instructions can use it.

Common pairings:

- Codex
- Claude Code
- Cursor
- Aider
- custom coding agents
- low-cost model runners for bounded execution

## Designed For

- Developers who run AI coding agents across many repositories.
- Teams that want repeatable AI execution without adopting a full agent platform.
- Projects where task boundaries, verification, and audit trails matter.
- Workflows that use cheap models by default and escalate only for judgment.
- Repositories that need AI context to live in files, not only in chat history.
- Users who want AI to draft the critical context files while humans confirm the final boundary.

## Not This

AI Execution Template is not:

- an IDE,
- an agent platform,
- a multi-agent scheduler,
- a cloud service,
- a prompt collection,
- a replacement for Codex, Claude Code, Cursor, or Aider.

It is a small file protocol for making those tools behave more consistently inside real software projects.

## Specification

- [Full specification](docs/SPEC.md)
- [Token-efficient protocol profile](docs/token-efficient-protocol-v0.1.md)

Current package:

```text
Package:  @wnlen/ai-execution-template
Protocol: v0.8
License:  MIT
```

## Development

Run the self-test:

```bash
npm test
```

The test suite verifies the core CLI contract:

- `init` creates the expected protocol and project files.
- `update` does not overwrite `ai/project/**`.
- `doctor` reports missing and empty required files correctly.

## Contributing

Issues and pull requests are welcome.

Good contributions usually improve one of these areas:

- clearer task contracts,
- safer project/template boundaries,
- better result schemas,
- better metrics for model cost and verification,
- stronger examples for real coding-agent workflows,
- sharper documentation for team adoption.

## License

[MIT](LICENSE)
