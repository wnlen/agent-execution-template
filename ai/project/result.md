# 执行结果

状态：success

已完成：

- 修复 doctor 对 `ai/project/task.md` front matter 的校验，使 compact task contract 不再需要 expanded 字段。
- 将版本 bump 到 `0.8.22`，并同步 `ai/template/VERSION`、中英文模板 VERSION 和 `docs/SPEC.md`。
- 提交并推送到 `origin/dev`：`a1a5962 Release compact task contract support`。
- 发布 npm：`@wnlen/agent-execution-template@0.8.22`。

验证：

- `npm test`：passed
- `npm run check:release`：passed
- `git diff --check`：passed
- `node bin/agent-execution-template.js doctor`：passed
- `npm pack --dry-run`：passed，包版本 `0.8.22`，共 73 个文件
- `npm view @wnlen/agent-execution-template version`：`0.8.22`

后续：无。
