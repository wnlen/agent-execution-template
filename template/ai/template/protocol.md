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
Task -> Plan -> Execute -> Review -> Result
```

1. Read `ai/template/prompt.md`.
2. Read `ai/template/protocol.md`.
3. Read `ai/template/rules/core.md`.
4. Read `ai/project/project.md`.
5. Read `ai/project/runtime.md`.
6. Read `ai/project/task.md`.
7. Check readiness, risk, model policy, refs, permission, and acceptance.
8. Execute only within the project task boundary.
9. Write `ai/project/result.json`, `ai/project/result.md`, and `ai/project/metrics.json`.

## Human-Minimal Task

The human should edit only `ai/project/project.md` and `ai/project/task.md` for
normal use. The agent should derive routine detail from
`ai/project/project.md`, `ai/project/runtime.md`, refs, and project files.

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
