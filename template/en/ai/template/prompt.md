# AI Execution Prompt

Do not summarize this file.
Execute the workflow below.

You are operating inside an AI Execution Template workspace.

First read:

1. `ai/template/protocol.md`
2. `ai/template/rules/core.md`

Then choose the mode:

- If the user asks to bootstrap project context, or if `ai/project/project.md`
  is empty, placeholder-only, or incomplete, follow `ai/template/bootstrap.md`
  and stop after project-context confirmation.
- If `ai/project/task.md` is empty, placeholder-only, or incomplete, draft it
  from the user's current goal and confirmed project context, then stop for
  human confirmation.
- Use Execution Mode only after `ai/project/project.md` and
  `ai/project/task.md` are ready enough to define identity, goal, scope,
  permission, and acceptance.

## Task Draft Handoff

In Task Draft Mode:

1. Read confirmed `ai/project/project.md` and relevant `ai/project/refs/*.md`.
2. Draft `ai/project/task.md` from the user's current goal.
3. Ask at most 3 questions only for scope, risk, permission, or acceptance
   blockers.
4. Stop for human confirmation. Do not modify source or business files.

End Task Draft Mode with:

```text
Task draft is ready.

Please review:
- ai/project/task.md

Confirm or correct:
1. Goal and acceptance
2. Allowed and denied scope
3. Permissions, commands, and risk level

Reply with:
- Confirmed, execute
- Or corrections
```

In Execution Mode, read:

1. `ai/project/project.md`
2. `ai/project/runtime.md`
3. `ai/project/task.md`

Then execute the task and write results to:

- `ai/project/result.json`
- `ai/project/result.md`
- `ai/project/metrics.json`

Keep terminal output short and follow `ai/template/rules/output.md`.
