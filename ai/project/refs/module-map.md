# 模块地图

这个文件描述当前模块结构、边界和依赖方向。
它回答“系统现在长成什么样”，不替代 `final-shape.md` 的方向判断。

## 模块总览

| 模块 | 职责 | 输入 | 输出 | 所有者/边界 |
| --- | --- | --- | --- | --- |
| CLI | 安装、升级、刷新、检查和打印下一步提示 | 命令行参数、当前工作目录、模板源文件 | `ai/**` 文件、控制台提示、doctor 检查结果 | `bin/agent-execution-template.js` |
| 中文模板源 | 发布到中文项目的协议和项目文件模板 | `template/zh/ai/**` | `init` / `update` 安装内容 | 可被模板升级覆盖；不含具体用户项目事实 |
| 英文模板源 | 发布到英文项目的协议和项目文件模板 | `template/en/ai/**` | `init --lang en` / `update --lang en` 安装内容 | 文件布局必须与中文模板一致 |
| Dogfood 工作区 | 本仓库自用的 AI 执行现场 | `ai/template/**`、`ai/project/**` | 当前仓库上下文、任务、结果、metrics | `ai/template/**` 应镜像中文模板；`ai/project/**` 是本仓库现场 |
| 规范文档 | 描述协议定位、目录、命令、闭环和边界 | README、SPEC、token-efficient 文档 | 用户理解、实现约束、release check 依据 | 根目录 README、`docs/**` |
| 测试与发布检查 | 验证 CLI 契约、模板结构和版本一致性 | 临时项目、模板文件、package metadata | selftest / release check 结果 | `test/selftest.js`、`test/check-release.js` |
| 示例 | 展示任务和结果结构 | example task/result files | 可参考的协议样例 | `examples/**` |

## 依赖方向

- CLI 读取 `template/<lang>/ai/**` 并写入目标仓库 `ai/**`。
- `update` 只能覆盖目标仓库 `ai/template/**`，不能覆盖 `ai/project/**`。
- release check 要求 `template/zh/ai/template/**` 与根目录 `ai/template/**` 内容一致。
- release check 要求 `template/zh/ai` 与 `template/en/ai` 文件布局一致。
- 文档和模板语义应由 SPEC 统领，README 面向使用者压缩表达。
- 测试依赖 CLI 和模板，但 CLI 不依赖测试。

## 稳定边界

- `bin/agent-execution-template.js` 是唯一 npm bin 入口。
- `template/zh/ai/**` 和 `template/en/ai/**` 是安装源。
- 根目录 `ai/**` 是本仓库 dogfood 工作区，不应当作真实用户项目数据回流模板。
- `ai/project/**`、`template/*/ai/project/**` 是项目现场模板，不应被 `update` 覆盖已有用户内容。
- `docs/SPEC.md` 是协议规格；README 是用户入口。

## 易混淆边界

- `ai/project/**` 的“项目现场”是 repo-local context，不是外部 workspace/session/sandbox runtime。
- `strategy_update` 只生成方向修订提案，不应用正式方向文件。
- `apply_strategy_update` 只应用已确认提案，不顺手扩写新方向。
- `refresh` 会备份并重建 `ai/project/**`，不同于 `update`。
- `reconcile` 吸收权威资料，不等于重新 bootstrap。
- `next` 只判断和提示下一步，不修改项目文件。

## 待拆分或待合并区域

- `bin/agent-execution-template.js` 当前集中了承载文本、文件复制、命令处理、doctor 和 schema 校验；若继续增长，可考虑在保持 npm 包简单的前提下拆分内部模块。
- 中英文模板需要持续保持语义一致；未来可用检查减少人工同步风险。
- SPEC、README 和模板协议之间存在重复定位文本；修改定位时需要同步审查。

## 与北极星的关系

模块边界服务于“仓库内 AI 执行协议”定位：CLI 负责安装和检查，模板负责可复用协议，project 负责仓库现场，测试负责防止发布和同步回归。任何把外部 runtime、云平台或多 Agent 编排能力塞进这些模块的改动，都应先经过方向修订。
