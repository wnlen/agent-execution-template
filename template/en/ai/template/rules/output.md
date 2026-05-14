# Output Rules

Every execution must write:

- `ai/project/result.json`
- `ai/project/result.md`
- `ai/project/metrics.json`

## Status

Use one of:

- `success`
- `partial`
- `failed`
- `blocked`

Do not use `success` unless verification passed.

## Result JSON

`ai/project/result.json` is the authoritative machine-readable result.
It must include scope, files read, refs read, changed files, commands,
verification, assumptions, issues, next steps, and runtime update proposals.

## Result Markdown

`ai/project/result.md` is the human-readable summary. Keep it short and use the
installed language from `ai/template/LANG` by default. In the English template,
headings and prose should default to English; preserve code, commands, file
paths, and protocol field names as written.

```md
## Status
success | partial | failed | blocked

## Changed
- file

## Verified
- level
- evidence

## Issues
- issue if any

## Next
- next step
```

## Metrics

`ai/project/metrics.json` records model tier, escalation trigger, strong-model
role, token estimates, duration, success, human fix, and reuse potential.
