---
task_id: "example-strategy-update-north-star"
type: "strategy_update"
priority: "P1"
risk_level: "medium"
depends_on_previous_result: false
model_policy:
  default_tier: "strong"
  allowed_tiers:
    - standard
    - strong
  escalation_allowed: true
  escalation_triggers:
    - ambiguous_goal
    - architecture_boundary
    - high_risk_change
  strong_model_roles:
    - planning
    - risk_judgment
    - architecture_review
refs:
  required:
    - ai/project/refs/final-shape.md
    - ai/project/refs/module-map.md
    - ai/project/refs/roadmap.md
    - ai/project/refs/decisions.md
    - ai/project/refs/constraints.md
  optional:
    - ai/project/inbox/ideas/
permission:
  modify:
    allowed:
      - ai/project/proposals/final-shape-updates/**
    denied:
      - ai/project/refs/final-shape.md
      - ai/project/refs/module-map.md
      - ai/project/refs/roadmap.md
      - src/**
      - tests/**
  commands:
    allowed: []
    denied: []
  network: false
  destructive_actions: false
  runtime_update: "propose_only"
---

# Task

## Goal

Evaluate new direction ideas in `ai/project/inbox/ideas/` and produce a direction amendment proposal.

## Scope

Allowed scope:

- Read current direction refs.
- Read idea files from `ai/project/inbox/ideas/`.
- Create one proposal under `ai/project/proposals/final-shape-updates/`.

Out of scope:

- Editing official direction refs.
- Editing source, tests, dependencies, or runtime files.

## Acceptance

The task is complete when:

- A proposal exists under `ai/project/proposals/final-shape-updates/`.
- The proposal follows `_template.md`.
- The proposal includes alignment, conflicts, suggested diff, risks, and merge recommendation.
