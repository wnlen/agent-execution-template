# Runtime

## Current State

- Phase: MVP template setup
- Focus: Keep the AI execution layer minimal, auditable, and easy to copy into any software project.
- Blocker: None
- Known Risks:
  - Over-expanding scope beyond the current task
  - Polluting runtime context with historical process notes
  - Marking success without verification evidence
  - Running commands outside explicit permission
  - Optimizing for token savings instead of acceptable output per cost

## Hard Rules

- Current task first.
- Do not expand scope.
- Do not rewrite unrelated files.
- Do not repeat known background.
- Do not output tutorials.
- Do not treat guesses as facts.
- Read relevant files before making assumptions.
- Prefer minimal safe changes.
- Verify after changes when possible.
- Keep final output short.
- Do not edit `runtime.md` unless explicitly allowed by `task.md`.
- If `status = "success"`, `verification.passed` must be `true`.
- If verification requires manual checking, use `status = "partial"` unless manual verification has been completed.
- Default to cheap execution and escalate only for planning, judgment, repeated failure, or acceptance disputes.

## Project Constraints

- Default read set is `ai/prompt.md`, `ai/task.md`, and `ai/runtime.md`.
- `refs/` files are loaded only when required by task or triggered by task type.
- `archive/` is never read by default.
- `result.json` is the only authoritative latest result.
- `result.md` is the latest human-readable summary.
- `metrics.json` is the latest token-efficiency and reuse record.
- `runtime.md` stores stable, currently valid context only.
- Historical tasks and results belong in `ai/archive/`.

## Active Context

This project is a protocol/template, not a complex agent framework.
The MVP should remain file-based and tool-agnostic.
Do not add CLI, UI, cloud sync, or multi-agent orchestration until the file protocol proves useful in real projects.
The current product position is: minimal auditable execution protocol for AI Coding Agents.

## Ref Routing

- Architecture / API / module boundary -> `ai/refs/architecture.md`
- Historical decision -> `ai/refs/decisions.md`
- Security / compatibility / performance / data / deployment -> `ai/refs/constraints.md`
- Build / test / deploy command -> `ai/refs/commands.md`

## Runtime Update Governance

AI must not directly update this file unless `task.md` explicitly permits it.
If a task produces long-term valid context, write a proposal to `result.json.runtime_update`.
Apply runtime updates through a separate task whose only allowed target is `ai/runtime.md`.
