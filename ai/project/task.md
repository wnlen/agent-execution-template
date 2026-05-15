---
task_id: "20260515-release-init-output-scenarios"
type: "release"
priority: "P1"
risk_level: "high"
readiness: "ready_to_execute"
depends_on_previous_result: true
execution_policy:
  mode: "bounded_continuous"
  task_tree:
    - id: "L1-1"
      title: "验证 init 输出优化并准备 0.8.23"
      risk: "Yellow"
      status: "running"
    - id: "L1-2"
      title: "提交并推送 git 变更"
      risk: "Red"
      status: "pending"
    - id: "L1-3"
      title: "发布 npm 0.8.23"
      risk: "Red"
      status: "pending"
refs:
  required:
    - "ai/project/project.md"
    - "ai/project/refs/commands.md"
permission:
  modify:
    allowed:
      - "bin/agent-execution-template.js"
      - "test/selftest.js"
      - "README.md"
      - "README.zh-CN.md"
      - "docs/SPEC.md"
      - "package.json"
      - "ai/template/VERSION"
      - "template/zh/ai/template/VERSION"
      - "template/en/ai/template/VERSION"
      - "ai/project/task.md"
      - "ai/project/result.json"
      - "ai/project/result.md"
      - "ai/project/metrics.json"
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
      - "node bin/agent-execution-template.js init"
      - "node bin/agent-execution-template.js init --lang en"
      - "node bin/agent-execution-template.js init --verbose"
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

提交并推送 init 输出优化，发布 `@wnlen/agent-execution-template` 新 npm patch 版本。

## 范围

允许：

- 保留已完成的 init 默认输出优化和测试更新。
- 如果 npm registry 已存在当前版本，则执行 patch 版本 bump。
- 同步 `package.json`、`ai/template/VERSION`、中英文模板 VERSION 和必要文档版本引用。
- 运行发布前验证、提交、推送并执行 `npm publish`。

禁止：

- 不创建 git tag。
- 不使用破坏性 git 命令。
- 不引入依赖。
- 不修改项目方向文件。

## 验收

- `npm test`、`npm run check:release`、`git diff --check` 通过。
- `node bin/agent-execution-template.js doctor` 通过。
- `npm pack --dry-run` 显示发布包版本为新版本。
- git 提交已推送到 `origin/dev`。
- npm registry latest 等于新发布版本。
