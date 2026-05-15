---
task_id: "20260515-release-compact-task-contract"
type: "release"
priority: "P1"
risk_level: "high"
readiness: "ready_to_execute"
depends_on_previous_result: true
execution_policy:
  mode: "bounded_continuous"
  task_tree:
    - id: "L1-1"
      title: "完成 compact task contract 修复并通过验证"
      risk: "Yellow"
      status: "done"
    - id: "L1-2"
      title: "提交并推送 git 变更"
      risk: "Red"
      status: "done"
    - id: "L1-3"
      title: "发布 npm 新版本"
      risk: "Red"
      status: "done"
refs:
  required:
    - "ai/project/project.md"
    - "ai/project/runtime.md"
    - "ai/project/refs/commands.md"
permission:
  modify:
    allowed:
      - "README.md"
      - "README.zh-CN.md"
      - "docs/SPEC.md"
      - "package.json"
      - "ai/project/task.md"
      - "ai/project/result.json"
      - "ai/project/result.md"
      - "ai/project/metrics.json"
      - "ai/template/prompt.md"
      - "ai/template/execution-policy.md"
      - "ai/template/protocol.md"
      - "template/zh/ai/project/task.md"
      - "template/zh/ai/template/prompt.md"
      - "template/zh/ai/template/execution-policy.md"
      - "template/zh/ai/template/protocol.md"
      - "template/en/ai/project/task.md"
      - "template/en/ai/template/prompt.md"
      - "template/en/ai/template/execution-policy.md"
      - "template/en/ai/template/protocol.md"
      - "bin/agent-execution-template.js"
      - "test/selftest.js"
      - "test/check-release.js"
    denied:
      - "ai/project/refs/final-shape.md"
      - "ai/project/refs/module-map.md"
      - "ai/project/refs/roadmap.md"
  commands:
    allowed:
      - "npm test"
      - "npm run check:release"
      - "git diff --check"
      - "node bin/agent-execution-template.js doctor"
      - "npm view @wnlen/agent-execution-template version"
      - "npm_config_cache=/tmp/npm-cache-agent-execution-template npm pack --dry-run"
      - "npm version patch --no-git-tag-version"
      - "git status --short --branch"
      - "git diff --stat"
      - "git add"
      - "git commit"
      - "git push"
      - "npm publish"
    denied:
      - "git tag"
      - "git reset --hard"
      - "rm -rf"
  network: true
  destructive_actions: false
---

# 任务

## 目标

完成 compact task contract 相关未完成修复，验证通过后提交并推送到 `origin/dev`，并发布新的 npm 版本。

## 范围

允许：

- 修复 `bin/agent-execution-template.js` 中仍按旧 expanded task contract 校验的 doctor 逻辑。
- 同步必要测试、文档、模板和结果文件。
- 如果 npm registry 已存在当前 `package.json` 版本，则执行 patch 版本 bump 后发布。
- 提交当前任务相关变更并推送当前分支。
- 发布 `@wnlen/agent-execution-template` 到 npm。

禁止：

- 不修改项目方向文件。
- 不创建 git tag。
- 不使用破坏性 git 命令。
- 不引入新依赖。

## 验收

- `npm test` 通过。
- `npm run check:release` 通过。
- `git diff --check` 通过。
- `npm pack --dry-run` 输出符合预期。
- git commit 已创建并推送到 `origin/dev`。
- npm 发布成功，registry 版本等于本次发布版本。

## 执行提示

先完成验证阻塞修复；只有验证通过后才提交、推送和发布。若发布时发现 npm 认证或权限失败，记录阻塞结果并停止。
