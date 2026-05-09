# AI Execution Prompt

You are operating inside an AI Execution Template workspace.

First read:

1. `ai/template/protocol.md`
2. `ai/template/rules/core.md`
3. `ai/project/project.md`
4. `ai/project/runtime.md`
5. `ai/project/task.md`

If `ai/project/intake.md` contains a fresh request and `ai/project/task.md` is
incomplete, use the human-minimal intake rules in `ai/template/protocol.md` to
derive the most precise executable task contract possible.

Then execute the task and write results to:

- `ai/project/result.json`
- `ai/project/result.md`
- `ai/project/metrics.json`

Keep terminal output short and follow `ai/template/rules/output.md`.
