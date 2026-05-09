# Token-Efficient AI Execution Protocol v0.1

This profile sits on top of the AI Execution Template file protocol v0.8.
The goal is not to minimize token use in isolation. The goal is to produce
more acceptable work per unit of model cost while reducing human interaction
frequency and input size.

## Core Principle

Default to cheap execution. Escalate only at critical judgment points.

## Model Roles

- Strong model: planning, requirements judgment, architecture review, failure replay, acceptance disputes.
- Low-cost model: bounded reads, small edits, drafts, repetitive checks, mechanical cleanup.

## Model Division Protocol

Model division is declared per task in `ai/project/task.md.model_policy`.

```yaml
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
```

The protocol defines tiers, not vendor-specific model names.

- `cheap`: file reading, context cleanup, task drafting, small edits, checks, result writing.
- `standard`: moderate implementation work or cross-module edits.
- `strong`: planning, risk judgment, architecture review, failure review, acceptance judgment.

If escalation is needed but the host cannot switch models, the agent should stop
or mark the task `partial`/`blocked` and record the required strong-model role.

Record model policy execution in `ai/project/metrics.json`.

## Execution Shape

```text
Project Bootstrap -> Project Confirm -> Task Draft -> Task Confirm -> Plan -> Execute -> Review -> Result
```

Do not add dynamic DAGs, multi-agent communication, or model matrices until the
basic loop is reliable in real projects.

## Required Records

- `ai/template/`: reusable execution protocol.
- `ai/project/task.md`: goal, scope, permissions, risk, and acceptance criteria.
- `ai/project/runtime.md`: compact stable context read every run.
- `ai/project/result.json`: machine-readable facts, verification, assumptions, and next steps.
- `ai/project/result.md`: human-readable summary.
- `ai/project/metrics.json`: model tier, token estimates, duration, success, human fix, and reuse potential.

## Escalation Triggers

Escalate to a stronger model when:

- Goal or acceptance criteria are ambiguous.
- Task touches high-risk areas.
- Architecture or public contract judgment is required.
- The executor failed repeatedly.
- Verification result is disputed or cannot be interpreted confidently.

Record escalation in `ai/project/metrics.json`.

## Human-Minimal Rule

Humans should normally confirm generated project context and task contracts.
The agent should draft `ai/project/project.md`, refs, and `ai/project/task.md`
from existing docs, manifests, bounded code reads, project context, previous
results, and refs.

- Ask at most 3 clarification questions.
- Ask only when the answer changes scope, risk, permission, or acceptance.
- Prefer explicit assumptions over low-value back-and-forth.
- Turn repeated assumptions into `ai/project/runtime.md` update proposals.
- Turn repeated successful patterns into future task templates or skills.

## Five Operating Rules

1. Strong models are consultants, not default executors.
2. Low-cost models get small tasks with clear boundaries and acceptance checks.
3. Tasks should be atomic enough to execute, verify, and rerun independently.
4. Every run must leave auditable task, input, output, failure, cost, and verification records.
5. Every run should create raw material for future skills, rules, templates, or evaluations.
