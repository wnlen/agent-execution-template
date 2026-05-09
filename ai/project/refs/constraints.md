# Constraints

## Data

- Preserve data consistency.
- Do not introduce migrations unless explicitly authorized.

## Security

- Do not weaken authentication, authorization, validation, or secrets handling.
- Do not log sensitive data.

## Compatibility

- Preserve public API compatibility unless explicitly authorized.

## Performance

- Avoid broad refactors without benchmark or clear acceptance criteria.

## Deployment / Rollback

- Do not deploy unless explicitly authorized.
- Prefer reversible changes.
