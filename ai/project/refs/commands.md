# Commands

Commands are permissioned by category.
AI may run only commands allowed by `ai/project/task.md` and this file.

## Safe Verify Commands

```bash
# Add project-specific safe commands here
# examples:
# npm run lint
# npm run build
# mvn test
```

## Local Run Commands

```bash
# Add local startup commands here
# examples:
# npm run dev
# mvn spring-boot:run
```

## Dangerous Commands

These require explicit task-level authorization:

```bash
# database migration
# deployment
# branch reset
# file deletion
```

## Forbidden Unless Explicitly Allowed

```bash
# production deploy
# production data migration
# destructive cleanup
# commands that expose secrets
```
