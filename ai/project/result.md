# Result

## Status

success

## Summary

Changed the npm package name to `@wnlen/ai-execution-template` and updated the
README, SPEC, and CLI guidance to use scoped `npx` commands.

## Changed

- `package.json`
- `README.md`
- `docs/SPEC.md`
- `bin/ai-execution-template.js`
- `ai/project/result.json`
- `ai/project/result.md`

## Verified

- `npm test`
- `node bin/ai-execution-template.js doctor`
- JSON parse checks
- `npm_config_cache=/tmp/npm-cache-ai-execution-template npm pack --dry-run`
- `git diff --check`

## Issues

- None.

## Next

- Run `npm publish --access public`.
