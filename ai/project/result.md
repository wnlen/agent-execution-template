# 执行结果

状态：success

已完成：

- 将 AI 工作流正式入口改为 slash command。
- `init` / `next` / `reconcile` / `strategy` CLI 输出改为 `/init`、`/init-with-inbox`、`/reconcile`、`/strategy`、`/apply-strategy`、`/continue` 等命令。
- `AGENTS.md` / `CLAUDE.md` 托管块改为说明普通问答只读，项目工作流由 slash command 触发。
- 中英文 `prompt.md` 改为 slash command 路由，并让普通问答、协议解释、设计讨论不进入执行流程。
- README、SPEC、中文/英文模板和 selftest 已同步。

验证：

- `npm test`：passed
- `npm run check:release`：passed
- `git diff --check`：passed
- `node bin/agent-execution-template.js doctor`：passed
- 临时目录中文 / 英文 `init` 和 `next` 输出已检查

后续：无。
