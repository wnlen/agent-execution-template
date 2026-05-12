---
task_id: "example-apply-strategy-update"
type: "apply_strategy_update"
priority: "P1"
risk_level: "medium"
depends_on_previous_result: true
model_policy:
  default_tier: "standard"
  allowed_tiers:
    - standard
    - strong
  escalation_allowed: true
  escalation_triggers:
    - ambiguous_acceptance
    - architecture_boundary
    - verification_dispute
  strong_model_roles:
    - risk_judgment
    - architecture_review
    - acceptance_judgment
refs:
  required:
    - ai/project/proposals/final-shape-updates/YYYYMMDD-topic.md
    - ai/project/refs/final-shape.md
    - ai/project/refs/module-map.md
    - ai/project/refs/roadmap.md
  optional:
    - ai/project/refs/decisions.md
    - ai/project/refs/constraints.md
permission:
  modify:
    allowed:
      - ai/project/refs/final-shape.md
      - ai/project/refs/module-map.md
      - ai/project/refs/roadmap.md
      - ai/project/refs/decisions.md
      - ai/project/refs/constraints.md
    denied:
      - src/**
      - tests/**
      - package.json
  commands:
    allowed: []
    denied: []
  network: false
  destructive_actions: false
  runtime_update: "propose_only"
---

# Task

## Goal

Apply a human-confirmed direction amendment proposal to the official direction refs.

## Scope

Allowed scope:

- Apply only the confirmed proposal content.
- Update official direction refs listed in the proposal.
- Record what was applied and what was left out.

Out of scope:

- Creating new strategy beyond the confirmed proposal.
- Editing source, tests, dependencies, or generated files.

## Acceptance

The task is complete when:

- Confirmed proposal changes are reflected in the relevant direction refs.
- Unmerged proposal items are listed in the result.
- No source or dependency files are changed.
