---
task_id: ""
type: "bugfix | feature | refactor | docs | config | test | research"
priority: "P0 | P1 | P2 | P3"
risk_level: "low | medium | high"
depends_on_previous_result: false
model_policy:
  default_tier: "cheap"
  allowed_tiers:
    - cheap
    - standard
    - strong
  escalation_allowed: true
  escalation_triggers:
    - ambiguous_goal
    - ambiguous_acceptance
    - high_risk_change
    - architecture_boundary
    - repeated_failure
    - verification_dispute
  strong_model_roles:
    - planning
    - risk_judgment
    - architecture_review
    - failure_review
    - acceptance_judgment
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

This file is the current execution contract. Prefer generating it in Bootstrap
Mode from a short human goal plus repository context, then have a human review
it before execution.

Prefer safe assumptions over extra questions, but do not guess scope, risk,
permissions, or acceptance.

## Goal

Describe the exact goal of this task. If generated from a short human request,
preserve the user's intent and make assumptions explicit.

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
- Do not edit `ai/project/runtime.md` unless explicitly authorized.

## Acceptance

The task is complete when:

- 

## Permission

Modify files only under the allowlist in the YAML front matter.
Run only commands listed in the YAML front matter and allowed by `ai/project/refs/commands.md`.

## Model Policy

Default to the model tier declared in `model_policy.default_tier`.
Do not use `strong` for routine execution. Use `strong` only for the roles and
triggers declared in `model_policy`, then record the reason in `ai/project/metrics.json`.

## Stop Conditions

Stop and write `ai/project/result.json`, `ai/project/result.md`, and `ai/project/metrics.json` with blocked status if:

- Required files are missing.
- Goal is ambiguous.
- Acceptance cannot be verified.
- Scope requires modifying files outside allowed range.
- Required refs are missing.
- Required command cannot be run.
- Risk level is high without explicit authorization.
