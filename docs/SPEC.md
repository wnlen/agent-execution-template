# AI Execution Template Specification

Current protocol: v0.8

## 1. 项目名称

**AI Execution Template**

## 2. 一句话定位

**AI Execution Template 是一个 30 秒可安装、可升级、保护用户项目现场的 AI Coding Agent 执行协议模板。**

它把 AI 编程从“聊天式执行”变成：

```text
npx 安装协议 -> AI 整理项目上下文 -> 人类确认 -> AI 生成任务契约 -> 人类确认 -> AI 按协议执行 -> 结果落盘
```

当前版本的核心不是做一个新的 Agent，也不是做复杂调度系统，而是给 Codex、Claude Code、Cursor、Aider 等 AI Coding Agent 提供同一套项目内执行协议。

## 3. 当前版本

```text
Protocol: v0.8
Package: @wnlen/ai-execution-template@0.8.6
中文安装: npx -y @wnlen/ai-execution-template init
英文安装: npx -y @wnlen/ai-execution-template init --lang en
```

当前 v0.8 已经具备：

- npm `bin` 入口；
- `init` / `update` / `reconcile` / `doctor` 四个命令；
- `init --lang zh|en` 双语安装入口，默认中文；
- `template/project` 双区结构；
- 保护 `ai/project/**` 不被升级覆盖；
- 模板版本文件 `ai/template/VERSION`；
- 引导模式：通过 `ai/template/bootstrap.md` 从受控范围内的项目文档、manifest 和必要代码生成 `project.md` / refs 草稿；
- 上下文整合模式：通过 `ai/template/reconcile.md` 将 `ai/project/inbox/` 或 `docs/**` 中的新权威资料合并进既有上下文；
- 自测脚本 `npm test`；
- `result.json` / `result.md` / `metrics.json` 执行结果记录。

## 4. 解决的问题

AI Execution Template 主要解决九类问题：

1. 每次都要重复向 AI 解释项目背景。
2. 任务边界容易漂移，AI 做多、改多、跑多。
3. AI 在需求不清、权限不明、风险过高时仍然强行执行。
4. AI 修改了代码但没有验证，却声称成功。
5. 执行过程没有稳定记录，结果散落在聊天历史里。
6. 模板升级容易覆盖用户项目上下文。
7. 用户不知道模板是否安装完整。
8. 便宜模型和强模型没有明确分工规则。
9. 直接影响执行精度的 `project.md` / `task.md` 仍然依赖人手写。

最终目标是：

```text
减少人类输入量和交互频率，同时让 AI 任务越来越精准、可验收、可复盘。
```

## 5. 非目标

AI Execution Template 不是：

- AI IDE；
- Agent 平台；
- 多 Agent 调度器；
- 任务队列系统；
- 云服务；
- Prompt Collection；
- Codex / Claude Code / Cursor / Aider 的替代品。

它是更底层的东西：

```text
AI Coding Agent 在项目里工作的文件协议和安全边界。
```

## 6. 安装与日常使用

在任意项目根目录执行：

```bash
npx -y @wnlen/ai-execution-template init
```

默认安装中文模板。英文模板使用：

```bash
npx -y @wnlen/ai-execution-template init --lang en
```

然后让 AI Agent 先整理项目上下文：

```text
开始初始化这个项目
```

AI 会在聊天里给出项目上下文摘要、需要确认的问题和建议下一步，对应文件是：

```text
ai/project/project.md
ai/project/refs/*
```

之后人类回复修正意见，或说：

```text
继续推进这个项目
```

AI 会根据当前现场判断下一步，必要时生成并等待确认：

```text
ai/project/task.md
```

确认后启动 AI Agent 执行：

```text
继续推进这个项目
```

如果后续出现更权威的新资料，先放入：

```text
ai/project/inbox/
```

再执行上下文整合：

```text
整合 ai/project/inbox/ 里的新资料
```

整合会先输出计划，等人类确认后再更新 `project.md`、`runtime.md` 和 `refs/*`。

执行完成后查看：

```text
ai/project/result.md
ai/project/result.json
ai/project/metrics.json
```

检查安装状态：

```bash
npx -y @wnlen/ai-execution-template doctor
```

升级模板协议：

```bash
npx -y @wnlen/ai-execution-template update
```

`update` 默认沿用已安装语言，也可以显式指定：

```bash
npx -y @wnlen/ai-execution-template update --lang en
```

## 7. 安装后的目录结构

```text
ai/
  README.md

  template/
    VERSION
    bootstrap.md
    prompt.md
    reconcile.md
    protocol.md
    rules/
      core.md
      output.md
    schemas/
      result.schema.json
      metrics.schema.json

  project/
    project.md
    runtime.md
    task.md
    result.json
    result.md
    metrics.json
    inbox/
    refs/
    archive/
```

核心语义：

```text
ai/template/ = 模板协议区
ai/project/  = 项目现场区
```

更直白地说：

```text
template 是协议。
project 是现场。
```

## 8. template 区与 project 区

### 8.1 `ai/template/`

`ai/template/` 是可复用协议区。

特点：

- 可以由 `update` 覆盖；
- 可以从模板仓库升级；
- 可以回流模板仓库；
- 不包含具体项目业务信息；
- 只放通用执行协议。

包含：

```text
ai/template/VERSION
ai/template/bootstrap.md
ai/template/prompt.md
ai/template/reconcile.md
ai/template/protocol.md
ai/template/rules/core.md
ai/template/rules/output.md
ai/template/schemas/result.schema.json
ai/template/schemas/metrics.schema.json
```

### 8.2 `ai/project/`

`ai/project/` 是项目现场区。

特点：

- 用户专属；
- 不允许 `update` 覆盖；
- 不应该回流模板仓库；
- 存放当前项目上下文、任务、结果和参考资料。

包含：

```text
ai/project/project.md
ai/project/runtime.md
ai/project/task.md
ai/project/result.json
ai/project/result.md
ai/project/metrics.json
ai/project/inbox/
ai/project/refs/
ai/project/archive/
```

## 9. CLI 命令

### 9.1 `init`

```bash
npx -y @wnlen/ai-execution-template init
```

作用：

- 在当前项目生成 `ai/` 目录；
- 创建缺失的 `ai/project/**` 文件；
- 不覆盖已有 `ai/project/**`；
- 安装或覆盖 `ai/template/**`；
- 支持 `--lang zh|en`，默认中文；
- 输出下一步使用说明。

安全原则：

```text
init 可以安装模板协议，但不能覆盖用户现场。
```

### 9.2 `update`

```bash
npx -y @wnlen/ai-execution-template update
```

作用：

- 只更新 `ai/template/**`；
- 绝不修改 `ai/project/**`；
- 默认沿用 `ai/template/LANG` 中记录的已安装语言；
- 输出更新文件列表和模板版本。

安全原则：

```text
update 只升级协议，不碰现场。
```

### 9.3 `doctor`

```bash
npx -y @wnlen/ai-execution-template doctor
```

作用：

- 输出当前模板版本；
- 检查必需文件是否存在；
- 对空的项目文件给出警告；
- 输出是否 ready。

示例输出：

```text
AI Execution Template 检查

模板版本: 0.8.6
模板语言: zh

[通过] ai/template/LANG
[通过] ai/template/VERSION
[通过] ai/template/bootstrap.md
[通过] ai/template/prompt.md
[通过] ai/template/reconcile.md
[通过] ai/template/protocol.md
[通过] ai/template/rules/core.md
[通过] ai/template/rules/output.md
[通过] ai/project/inbox/.gitkeep
[通过] ai/project/project.md
[通过] ai/project/runtime.md
[通过] ai/project/task.md
[通过] ai/project/result.json
[通过] ai/project/result.md
[通过] ai/project/metrics.json

[通过] 已就绪
```

## 10. 启动入口

面向用户的项目上下文启动入口是：

```text
开始初始化这个项目
```

面向用户的任务执行入口是：

```text
继续推进这个项目
```

面向用户的上下文整合入口是：

```text
整合 ai/project/inbox/ 里的新资料
```

内部协议入口分别由 `ai/template/bootstrap.md`、`ai/template/prompt.md` 和
`ai/template/reconcile.md` 承载，用户不需要记忆这些文件名。

执行入口固定要求 AI Agent 先读：

```text
1. ai/template/protocol.md
2. ai/template/rules/core.md
3. ai/project/project.md
4. ai/project/runtime.md
5. ai/project/task.md
```

然后执行当前任务，并写入：

```text
ai/project/result.json
ai/project/result.md
ai/project/metrics.json
```

## 11. 执行闭环

当前协议的执行闭环是：

```text
项目引导 -> 项目确认 -> 任务草稿 -> 任务确认 -> 计划 -> 执行 -> 复核 -> 结果
```

更具体地说：

```text
读取模板协议
→ 如项目上下文不完整，读取 bootstrap.md 进入引导模式
→ 按受控范围读取项目文档和 manifest
→ 文档不足时从业务代码做有边界推断
→ 生成 project.md / refs 草稿
→ 人类确认
→ 基于一句话任务生成 task.md 草稿
→ 人类确认任务契约
→ 读取项目背景
→ 读取当前任务
→ 检查任务是否可执行
→ 检查风险是否可接受
→ 检查模型分工策略
→ 按需读取 refs
→ 在授权边界内执行
→ 尽可能验证
→ 写回 result / metrics
→ 必要时建议 runtime 更新
```

## 12. Bootstrap 与人类参与边界

普通用户通常只需要提供意图并确认两个文件：

```text
ai/project/project.md
ai/project/task.md
```

AI 在引导模式中负责先生成项目上下文草稿。默认读取范围包括：

- 根目录文档：`README*`、`AGENTS.md`、`CLAUDE.md`、`CONTRIBUTING*`、`CHANGELOG*`；
- package/build manifest：`package.json`、`pyproject.toml`、`Cargo.toml`、`go.mod`、`pom.xml`、`build.gradle*`、`Makefile`；
- 项目文档：`docs/**`，优先 overview、architecture、setup、testing、deployment、API、ADR、decision；
- 已有 AI refs：`ai/project/refs/*.md`；
- source / test / config / docs 的浅层目录结构。

如果文档和 manifest 不足，允许从业务代码做有边界推断：

- 先看顶层目录和文件名；
- 再看 `src/`、`app/`、`lib/`、`packages/`、`services/`、`cmd/`、`internal/`、`server/`、`client/`、`test/`、`tests/` 等入口；
- 只读取足够识别项目用途、模块边界、命令和约束的代码；
- 未经人类授权不全量扫描代码库。

默认不读取：

- `node_modules`、`vendor`、`.venv` 等依赖目录；
- `dist`、`build`、`target`、`coverage` 等生成目录；
- 除判断包管理器外的 lockfile；
- `.env*` 等 secrets / environment 文件；
- 未被用户明确引用的 archive/history 目录。

人类负责：

- 当前目标；
- 范围边界；
- 权限授权；
- 验收标准；
- 高风险决策；
- 确认 `project.md` / refs 草稿；
- 确认 `task.md` 草稿；
- 最终验收。

AI 负责：

- 读取协议；
- 从受控范围内读取项目文档和 manifest；
- 文档不足时从业务代码做有边界推断；
- 生成 `project.md` / refs 草稿；
- 基于当前目标生成 `task.md` 草稿；
- 补全可推断细节；
- 判断任务是否可执行；
- 判断是否需要阻断或升级；
- 执行任务；
- 验证结果；
- 写回结构化结果。

核心目标是：

```text
人类少输入，AI 多整理；但 scope、risk、permission、acceptance 不乱猜。
```

## 13. 任务文件 `task.md`

`ai/project/task.md` 是当前任务契约。

它应包含：

- task id；
- 任务类型；
- 优先级；
- 风险等级；
- 模型分工策略；
- refs 要求；
- 修改权限；
- 命令权限；
- 目标；
- 范围；
- 约束；
- 验收标准；
- stop conditions。

原则：

```text
任务不清楚，不执行。
验收不可验证，不声明成功。
权限不允许，不越界修改。
```

## 14. 模型分工协议

模型分工写在：

```text
ai/project/task.md.model_policy
```

核心原则：

```text
Default cheap. Escalate for judgment. Record why.
```

推荐分工：

- `cheap`：读文件、整理上下文、补全任务、草稿、小范围修改、跑检查、写结果。
- `standard`：中等复杂度实现、跨模块修改、复杂测试修复。
- `strong`：规划、风险判断、架构审查、失败复盘、验收争议。

强模型不应该默认全程执行。强模型只在关键判断点介入。

如果宿主工具不能自动切换模型，AI 应该：

- 标记 `partial` 或 `blocked`；
- 写明需要的 strong model role；
- 记录到 `ai/project/metrics.json`。

## 15. 风险门禁

任务涉及以下内容时必须谨慎：

- 数据迁移；
- 认证 / 授权；
- 支付 / 短信 / 外部回调；
- 公共 API；
- 生产部署；
- 大范围重构；
- 不可逆操作。

如果风险高且 `task.md` 未明确授权，AI 必须停止并写 blocked 结果。

## 16. refs 延迟加载

`ai/project/refs/` 存放按需读取的详细资料。

默认不全量读取。

推荐路由：

```text
架构 / API / 模块边界       -> ai/project/refs/architecture.md
历史决策                    -> ai/project/refs/decisions.md
安全 / 兼容 / 性能 / 数据    -> ai/project/refs/constraints.md
构建 / 测试 / 运行 / 部署    -> ai/project/refs/commands.md
```

每次读取 ref 都必须在 `result.json.refs_read` 中记录原因。

## 16.1 inbox 待吸收资料

`ai/project/inbox/` 存放尚未整合进项目上下文的新资料。

典型内容：

```text
ai/project/inbox/business-context.md
ai/project/inbox/product-workflows.md
ai/project/inbox/domain-model.md
```

当 inbox 中的资料需要吸收时，执行：

```text
整合 ai/project/inbox/ 里的新资料
```

AI 必须先输出整合计划，等人类确认后，才更新 `project.md`、`runtime.md` 和 `refs/*`。

## 17. 输出结果

每次执行必须写：

```text
ai/project/result.json
ai/project/result.md
ai/project/metrics.json
```

### 17.1 `result.json`

机器可读结果，是当前最新权威执行记录。

必须记录：

- status；
- task summary；
- files read；
- refs read；
- files changed；
- commands run；
- verification；
- assumptions；
- issues；
- next；
- runtime update proposal。

### 17.2 `result.md`

人类可读摘要。

用于快速查看：

- 状态；
- 改了什么；
- 如何验证；
- 有什么问题；
- 下一步。

### 17.3 `metrics.json`

执行经济性和模型分工记录。

用于记录：

- model tier；
- 是否升级；
- escalation reason；
- token 估算；
- duration；
- success；
- human fix required；
- reuse potential。

## 18. 状态规则

允许状态：

```text
success
partial
failed
blocked
```

规则：

- 没有验证通过，不得使用 `success`；
- 需要人工验收但尚未完成，使用 `partial`；
- 任务不可执行，使用 `blocked`；
- 执行失败且无法完成，使用 `failed`。

## 19. runtime 治理

`ai/project/runtime.md` 只存当前仍然有效的执行上下文。

它不是：

- 项目日记；
- 每轮 debug 记录；
- 聊天总结堆积区；
- 历史失败尝试仓库。

长期有效变化应先写入：

```text
ai/project/result.json.runtime_update
```

再由单独任务决定是否更新 runtime。

## 20. 同步规则

从模板仓库导入真实项目：

```text
只覆盖 ai/template/**
绝不覆盖 ai/project/**
```

从真实项目回流模板仓库：

```text
只回流 ai/template/**
绝不回流 ai/project/**
```

这是整个项目的安全底线。

## 21. npm 包结构

模板仓库内部结构：

```text
template/
  ai/
    README.md
    template/
    project/

bin/
  ai-execution-template.js

test/
  selftest.js

package.json
README.md
LICENSE
```

其中：

- `template/zh/ai/**` 是中文 npm 包安装源；
- `template/en/ai/**` 是英文 npm 包安装源；
- 根目录 `ai/**` 是本仓库 dogfood 工作区；
- `bin/ai-execution-template.js` 是 CLI；
- `test/selftest.js` 是本地自测。

## 22. 自测与发布检查

本地自测：

```bash
npm test
```

doctor：

```bash
node bin/ai-execution-template.js doctor
```

JSON 解析检查：

```bash
node -e "for (const f of process.argv.slice(1)) JSON.parse(require('fs').readFileSync(f, 'utf8'))" \
  package.json \
  ai/project/result.json \
  ai/project/metrics.json \
  template/zh/ai/project/result.json \
  template/zh/ai/project/metrics.json \
  template/en/ai/project/result.json \
  template/en/ai/project/metrics.json \
  ai/template/schemas/result.schema.json \
  ai/template/schemas/metrics.schema.json \
  template/zh/ai/template/schemas/result.schema.json \
  template/zh/ai/template/schemas/metrics.schema.json \
  template/en/ai/template/schemas/result.schema.json \
  template/en/ai/template/schemas/metrics.schema.json
```

npm 打包检查：

```bash
npm_config_cache=/tmp/npm-cache-ai-execution-template npm pack --dry-run
```

diff 检查：

```bash
git diff --check
```

## 23. 当前能力边界

当前项目已经能做到：

- 快速安装 AI 执行协议；
- 安全升级模板协议；
- 检查安装状态；
- 保护项目现场；
- 指导 AI 按任务边界执行；
- 记录可审计结果；
- 记录模型分工和执行经济性。

当前项目还不做：

- 自动运行 Agent；
- 自动切换模型；
- 多 Agent 编排；
- 云同步；
- IDE 插件；
- 发布流水线。

## 24. 最终判断

AI Execution Template v0.8 已经从一个 prompt/template 原型，升级为：

```text
低摩擦、可安装、可升级、保护用户现场的 AI 执行协议 npm 包雏形。
```

它的长期价值不在于替代任何模型或 Agent，而在于提供一套稳定协议：

```text
让一堆不同能力、不同成本的 AI Agent，都能在同一套项目边界下产出可验收结果。
```

一句话收口：

```text
template 是协议，project 是现场；人类定义目标和边界，AI 按协议执行并留下证据。
```
