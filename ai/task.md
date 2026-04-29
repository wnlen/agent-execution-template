---
task_id: ""
type: "bugfix | feature | refactor | docs | config | test | research"
priority: "P0 | P1 | P2 | P3"
risk_level: "low | medium | high"
depends_on_previous_result: false
refs:
  required: []
  optional: []
permission:
  modify:
    allowed: []
    denied: []
  commands:
    allowed: []
    denied: []
  network: false
  destructive_actions: false
  runtime_update: "propose_only"
---

# Task

## Goal

Describe the exact goal of this task.

## Scope

Allowed scope:

- 

Out of scope:

- 

## Related Files

- 

## Constraints

- Do not refactor unrelated modules.
- Do not modify public API unless required by the task.
- Do not edit `ai/runtime.md` unless explicitly authorized.

## Acceptance

The task is complete when:

- 

## Permission

Modify files only under the allowlist in the YAML front matter.
Run only commands listed in the YAML front matter and allowed by `ai/refs/commands.md`.

## Stop Conditions

Stop and write `ai/result.json` with `status = "blocked"` if:

- Required files are missing.
- Goal is ambiguous.
- Acceptance cannot be verified.
- Scope requires modifying files outside allowed range.
- Required refs are missing.
- Required command cannot be run.
- Risk level is high without explicit authorization.
