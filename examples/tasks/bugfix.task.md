---
task_id: "example-bugfix-login-timeout"
type: "bugfix"
priority: "P1"
risk_level: "medium"
depends_on_previous_result: false
refs:
  required:
    - ai/refs/constraints.md
  optional:
    - ai/refs/architecture.md
permission:
  modify:
    allowed:
      - src/auth/**
      - tests/auth/**
    denied:
      - db/migrations/**
      - deploy/**
  commands:
    allowed:
      - npm test -- auth
      - npm run lint
    denied:
      - npm run deploy
  network: false
  destructive_actions: false
  runtime_update: "propose_only"
---

# Task

## Goal

Fix login timeout handling so expired sessions redirect to the login page instead of showing a blank screen.

## Scope

Allowed scope:

- Auth/session timeout handling
- Related auth tests

Out of scope:

- API contract changes
- Database changes
- Deployment scripts

## Related Files

- src/auth/session.ts
- src/auth/router-guard.ts
- tests/auth/session-timeout.test.ts

## Constraints

- Do not weaken authentication checks.
- Do not log tokens or session identifiers.

## Acceptance

The task is complete when:

- Expired sessions redirect to login.
- Non-expired sessions continue normally.
- Existing auth tests pass or the failure is clearly reported.

## Stop Conditions

Stop if the auth flow depends on files outside the allowed scope.
