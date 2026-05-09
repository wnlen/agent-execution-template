# Runtime

## Current State

- Phase: MVP template setup
- Focus: Keep the AI execution layer minimal, auditable, and easy to copy into any software project.
- Blocker: None
- Known Risks:
  - Over-expanding scope beyond the current task
  - Asking humans for details the agent can infer safely
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
- Minimize human interaction; ask only for scope, risk, permission, or acceptance blockers.
- Ask at most 3 clarification questions before execution.
- Do not edit `ai/project/runtime.md` unless explicitly allowed by `ai/project/task.md`.
- If `status = "success"`, `verification.passed` must be `true`.
- If verification requires manual checking, use `status = "partial"` unless manual verification has been completed.
- Default to cheap execution and escalate only for planning, judgment, repeated failure, or acceptance disputes.
- Follow `ai/project/task.md.model_policy`; default cheap, escalate for judgment, record why.

## Project Constraints

- Bootstrap read set starts from `ai/template/bootstrap.md`, `ai/template/protocol.md`, `ai/template/rules/core.md`, root docs, manifests, docs, refs, and bounded source-structure inspection when docs are insufficient.
- Execution read set is `ai/template/prompt.md`, `ai/template/protocol.md`, `ai/template/rules/core.md`, `ai/project/project.md`, `ai/project/runtime.md`, and `ai/project/task.md`.
- `ai/project/refs/` files are loaded only when required by task or triggered by task type.
- `ai/project/archive/` is never read by default.
- `ai/project/result.json` is the only authoritative latest result.
- `ai/project/result.md` is the latest human-readable summary.
- `ai/project/metrics.json` is the latest token-efficiency and reuse record.
- Model tier decisions are governed by `ai/project/task.md.model_policy`, not by ad hoc chat preference.
- `ai/project/runtime.md` stores stable, currently valid context only.
- Historical tasks and results belong in `ai/project/archive/`.

## Active Context

This project is a protocol/template, not a complex agent framework.
The MVP should remain file-based and tool-agnostic.
Do not add CLI, UI, cloud sync, or multi-agent orchestration until the file protocol proves useful in real projects.
The current product position is: minimal auditable execution protocol for AI Coding Agents.
The current product goal is to reduce human interaction frequency and input size while making tasks more precise over time.

## Ref Routing

- Architecture / API / module boundary -> `ai/project/refs/architecture.md`
- Historical decision -> `ai/project/refs/decisions.md`
- Security / compatibility / performance / data / deployment -> `ai/project/refs/constraints.md`
- Build / test / deploy command -> `ai/project/refs/commands.md`

## Runtime Update Governance

AI must not directly update this file unless `ai/project/task.md` explicitly permits it.
If a task produces long-term valid context, write a proposal to `ai/project/result.json.runtime_update`.
Apply runtime updates through a separate task whose only allowed target is `ai/project/runtime.md`.
