# 约束

## 数据

- `ai/project/**` 是项目现场；除 `refresh` 明确备份重建外，命令不得覆盖已有用户现场。
- `update` 只能修改 `ai/template/**`。
- `init` 可以安装模板协议并创建缺失项目文件，但不能覆盖已有 `ai/project/**`。
- `result.json`、`metrics.json` 和 schema 必须保持合法 JSON。

## 安全

- 不要读取或输出 `.env*`、密钥文件或环境秘密。
- 不要运行会发布、部署、删除大量文件、重置分支或修改远端状态的命令，除非任务明确授权。
- 不要把外部 workspace/session/sandbox runtime 能力混入仓库内协议。

## 兼容性

- 保持 npm bin 名称和入口：`agent-execution-template` -> `bin/agent-execution-template.js`。
- 保持 `init`、`update`、`refresh`、`improve-context`、`next`、`doctor`、`reconcile`、`strategy` 的用户语义。
- 保持 `--lang zh|en` 双语安装入口，默认中文。
- 保持中英文模板文件布局一致。
- 修改模板时同步评估根目录 dogfood `ai/template/**` 和 release check。

## 性能

- CLI 应保持轻量，使用 Node.js 标准库即可；不要为简单文件复制和检查引入重依赖。
- 大仓库引导时默认只读取高价值文档、manifest、refs 和浅层结构。

## 部署 / 回滚

- 发布前运行 `npm test` 和 `git diff --check`。
- `refresh` 必须先备份旧 `ai/project/**`。
- 不要在普通任务中执行 `npm publish`、`git tag` 或 `git push`。

## 文档与协议一致性

- README 面向用户，SPEC 面向完整协议，`ai/template/**` 面向 Agent 执行；定位修改需要同步审查三者。
- `docs/SPEC.md` 中的包版本必须与 `package.json` 一致。
- `ai/template/VERSION`、`template/zh/ai/template/VERSION`、`template/en/ai/template/VERSION` 必须与 `package.json` 一致。
- `template/zh/ai/template/**` 必须与 `ai/template/**` 镜像一致。
