# 命令

命令按类别授权。
AI 只能运行 `ai/project/task.md` 和本文件允许的命令。

## 安全验证命令

```bash
npm test
npm run check:release
git diff --check
node bin/agent-execution-template.js doctor
```

## 本地运行命令

```bash
node bin/agent-execution-template.js init
node bin/agent-execution-template.js init --lang en
node bin/agent-execution-template.js next
node bin/agent-execution-template.js refresh
node bin/agent-execution-template.js improve-context
node bin/agent-execution-template.js update
node bin/agent-execution-template.js reconcile
node bin/agent-execution-template.js strategy
node bin/agent-execution-template.js doctor
```

## 发布 / 打包检查命令

这些命令只用于维护者确认发布内容，不代表授权发布：

```bash
npm_config_cache=/tmp/npm-cache-agent-execution-template npm pack --dry-run
```

## 危险命令

这些命令需要任务级明确授权：

```bash
npm publish
git tag
git push
git reset --hard
rm -rf
```

## 未明确允许则禁止

```bash
# 发布到 npm
# 修改远端分支或 tag
# 删除大量文件
# 重置工作区
# 会暴露密钥的命令
```
