# Agent Execution Template Specification

Current protocol: v0.8

## 1. 项目名称

**Agent Execution Template**

## 2. 一句话定位

**Agent Execution Template 是一个 30 秒可安装、可升级、保护用户项目现场的 AI Repo Execution Protocol。**

它把 AI 编程从“聊天式执行”变成：

```text
npx 安装协议 -> AI 整理项目上下文 -> 人类确认 -> AI 生成任务契约 -> 人类确认 -> AI 按协议执行 -> 结果落盘
```

当前版本的核心不是做一个新的 Agent，也不是做复杂调度系统，而是给 Codex、Claude Code、Cursor、Aider 等 AI Coding Agent 提供同一套项目内执行协议。

它只管 AI 在某个仓库内怎么干活：当前任务是什么、哪些文件能改、需要读哪些上下文、执行结果怎么记录、如何审计本次任务，以及 Agent 进入项目后先读什么。

## 3. 当前版本

```text
Protocol: v0.8
Package: @wnlen/agent-execution-template@0.8.21
中文安装: npx -y @wnlen/agent-execution-template init
英文安装: npx -y @wnlen/agent-execution-template init --lang en
```

当前 v0.8 已经具备：

- npm `bin` 入口；
- `init` / `next` / `refresh` / `improve-context` / `update` / `reconcile` / `strategy` / `doctor` 命令；
- `init --lang zh|en` 双语安装入口，默认中文；
- `template/project` 双区结构；
- 根目录 AI 兼容入口托管块：`AGENTS.md` / `CLAUDE.md`；
- 保护 `ai/project/**` 不被升级覆盖；
- 模板版本文件 `ai/template/VERSION`；
- 引导模式：通过 `ai/template/bootstrap.md` 从受控范围内的项目文档、manifest 和必要代码生成 `project.md` / refs 草稿；
- 上下文整合模式：通过 `ai/template/reconcile.md` 将 `ai/project/inbox/` 或 `docs/**` 中的新权威资料合并进既有上下文；
- 项目方向层：通过 `final-shape.md`、`module-map.md`、`roadmap.md` 保存北极星、模块地图和路线图；
- 策略修订门禁：通过 `strategy_update` proposal 和 `apply_strategy_update` 防止普通执行任务直接改项目宪法；
- 自测脚本 `npm test`；
- `result.json` / `result.md` / `metrics.json` 执行结果记录。

## 4. 解决的问题

Agent Execution Template 主要解决十类问题：

1. 每次都要重复向 AI 解释项目背景。
2. 任务边界容易漂移，AI 做多、改多、跑多。
3. AI 在需求不清、权限不明、风险过高时仍然强行执行。
4. AI 修改了代码但没有验证，却声称成功。
5. 执行过程没有稳定记录，结果散落在聊天历史里。
6. 模板升级容易覆盖用户项目上下文。
7. 用户不知道模板是否安装完整。
8. 便宜模型和强模型没有明确分工规则。
9. 直接影响执行精度的 `project.md` / `task.md` 仍然依赖人手写。
10. AI 能稳定执行任务，但缺少判断任务为什么值得做、项目下一步往哪里生长的方向层。

最终目标是：

```text
减少人类输入量和交互频率，同时让 AI 任务越来越精准、可验收、可复盘。
```

## 5. 非目标

Agent Execution Template 不是：

- AI IDE；
- Agent 平台；
- 多 Agent 调度器；
- workspace / sandbox / session 运行时；
- 多仓库上下文管理器；
- 任务队列系统；
- 云服务；
- Prompt Collection；
- Codex / Claude Code / Cursor / Aider 的替代品。

它是更底层的东西：

```text
AI Coding Agent 在项目里工作的文件协议和安全边界。
```

明确禁止混淆：

- Agent Execution Template 不做 workspace 切换、多仓库管理、sandbox 生命周期、session fork / rollback 或 worker 调度。
- 与外部运行时集成时，不应把业务任务定义、项目最终形态说明、仓库内文件修改规则、acceptance criteria 或具体编码上下文移出本协议。

与 `openclaw-workspaces` 这类外部运行时一起使用时，推荐分工是：

```text
openclaw-workspaces = AI Workspace & Session Runtime
agent-execution-template = AI Repo Execution Protocol
```

外部运行时负责仓库外能力，例如创建独立 workspace、切换项目上下文、保存/恢复/打包 session、管理 worker/agent 运行环境、隔离污染，以及未来承载多 Agent Task Graph。

## 6. 安装与日常使用

在任意项目根目录执行：

```bash
npx -y @wnlen/agent-execution-template init
```

默认安装中文模板。英文模板使用：

```bash
npx -y @wnlen/agent-execution-template init --lang en
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
npx -y @wnlen/agent-execution-template doctor
```

升级模板协议：

```bash
npx -y @wnlen/agent-execution-template update
```

`update` 默认沿用已安装语言，也可以显式指定：

```bash
npx -y @wnlen/agent-execution-template update --lang en
```

查看方向修订入口：

```bash
npx -y @wnlen/agent-execution-template strategy
```

## 7. 安装后的目录结构

```text
ai/
  README.md

  template/
    VERSION
    bootstrap.md
    execution-policy.md
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
      ideas/
      raw/
    proposals/
      final-shape-updates/
    refs/
      final-shape.md
      module-map.md
      roadmap.md
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

这里的“项目现场”只指某个仓库内的 `ai/project/**` 执行上下文，不是跨项目 workspace/runtime。外部 workspace、session 和 sandbox 生命周期应由外部运行时管理。

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
ai/template/execution-policy.md
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
ai/project/inbox/ideas/
ai/project/inbox/processed/
ai/project/inbox/raw/
ai/project/proposals/final-shape-updates/
ai/project/proposals/final-shape-updates/_template.md
ai/project/refs/
ai/project/refs/final-shape.md
ai/project/refs/module-map.md
ai/project/refs/roadmap.md
ai/project/archive/
```

## 9. CLI 命令

### 9.1 `init`

```bash
npx -y @wnlen/agent-execution-template init
```

作用：

- 在当前项目生成 `ai/` 目录；
- 创建缺失的 `ai/project/**` 文件；
- 不覆盖已有 `ai/project/**`；
- 安装或覆盖 `ai/template/**`；
- 创建或更新根目录 `AGENTS.md` / `CLAUDE.md` 中的同内容兼容托管块；
- 支持 `--lang zh|en`，默认中文；
- 输出下一步使用说明。

安全原则：

```text
init 可以安装模板协议，但不能覆盖用户现场。
```

根目录 AI 兼容入口文件只管理 `agent-execution-template` 标记块，不能覆盖用户已有
`AGENTS.md` 或 `CLAUDE.md` 内容。两个文件中的托管块内容必须一致；这不是两套协议，
而是分别适配通用 Agent / Codex 和 Claude Code 的自动发现约定。托管块必须要求 AI 在“开始初始化这个项目”时先读
`ai/template/prompt.md`，再由它路由到 `ai/template/bootstrap.md`。

### 9.2 `update`

```bash
npx -y @wnlen/agent-execution-template update
```

作用：

- 只更新 `ai/template/**`；
- 刷新根目录 AI 兼容入口文件中的托管块；
- 绝不修改 `ai/project/**`；
- 默认沿用 `ai/template/LANG` 中记录的已安装语言；
- 输出更新文件列表和模板版本。

安全原则：

```text
update 只升级协议，不碰现场。
```

### 9.3 `next`

```bash
npx -y @wnlen/agent-execution-template next
```

作用：

- 当前项目尚未安装时，提示先运行 `init`；
- `ai/project/inbox/` 有待吸收资料时，提示上下文整合入口；
- `ai/project/inbox/ideas/` 有待评估灵感时，提示方向修订提案入口；
- 存在待确认方向提案时，提示人类审查和确认；
- 没有待处理输入时，提示继续推进项目。

安全原则：

```text
next 只判断和提示下一步，不修改项目文件。
```

### 9.4 `refresh`

```bash
npx -y @wnlen/agent-execution-template refresh
```

作用：

- 将旧 `ai/project/**` 改名备份为 `ai/project.backup.<timestamp>`；
- 生成新的 `ai/project/**`；
- 将旧上下文复制到 `ai/project/inbox/raw/old-project/`；
- 输出下一句要交给 AI 的整理指令。

安全原则：

```text
refresh 可以重建项目上下文，但必须先备份旧现场。
```

`improve-context` 是 `refresh` 的用户语义别名：

```bash
npx -y @wnlen/agent-execution-template improve-context
```

### 9.5 `doctor`

```bash
npx -y @wnlen/agent-execution-template doctor
```

作用：

- 输出当前模板版本；
- 检查必需文件是否存在；
- 对空的项目文件给出警告；
- 输出是否 ready。

示例输出：

```text
Agent Execution Template 检查

模板版本: 0.8.21
模板语言: zh

[通过] ai/template/LANG
[通过] ai/template/VERSION
[通过] ai/template/bootstrap.md
[通过] ai/template/execution-policy.md
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

### 9.5 `strategy`

```bash
npx -y @wnlen/agent-execution-template strategy
```

作用：

- 打印方向修订的最短操作说明；
- 指示用户把新方向灵感放到 `ai/project/inbox/ideas/`；
- 指示 AI 生成 `strategy_update` 提案；
- 提醒人类确认后再执行 `apply_strategy_update`。

### 9.6 `reconcile`

```bash
npx -y @wnlen/agent-execution-template reconcile
```

作用：

- 打印上下文整合的最短操作说明；
- 指示用户把新的业务、产品、架构或流程资料放到 `ai/project/inbox/`；
- 指示 AI 先输出整合计划，等待确认后再更新长期上下文。

## 10. 启动入口

面向用户的项目上下文启动入口是：

```text
开始初始化这个项目
```

为了让 AI 工具能发现这个入口，`init` 会在仓库根目录安装 `AGENTS.md` 和
`CLAUDE.md` 兼容入口托管块。两个托管块内容相同，不代表两套协议；它们分别适配不同
AI 工具的自动发现约定。兼容这些入口的 AI 工具必须先读取托管块，再读取
`ai/template/prompt.md`，最后由 `prompt.md` 路由到 `ai/template/bootstrap.md`。
如果宿主工具没有自动读取根目录入口，人类应先要求它读取 `AGENTS.md` 或
`CLAUDE.md`。

面向用户的任务执行入口是：

```text
继续推进这个项目
```

面向用户的上下文整合入口是：

```text
整合 ai/project/inbox/ 里的新资料
```

面向用户的方向修订入口可以是：

```text
把 ai/project/inbox/ideas/ 里的新灵感生成方向修订提案
```

内部协议入口分别由 `ai/template/bootstrap.md`、`ai/template/prompt.md` 和
`ai/template/reconcile.md` 承载，用户不需要记忆这些文件名。

执行入口采用懒加载。AI Agent 先读：

```text
0. AGENTS.md 或 CLAUDE.md 中的同内容 agent-execution-template 兼容托管块
1. ai/template/prompt.md
```

`prompt.md` 只做模式路由：初始化时再读 `bootstrap.md`；整合时再读
`reconcile.md`；执行任务时才读 `protocol.md`、`rules/core.md`、
`execution-policy.md`、`project.md`、`runtime.md` 和 `task.md`。

执行完成后写入：

```text
ai/project/result.json
ai/project/result.md
ai/project/metrics.json
```

## 11. 执行闭环

当前协议的执行闭环是：

```text
项目引导 -> 项目确认 -> 方向修订提案可选 -> 任务草稿 -> 任务确认 -> 计划 -> 执行 -> 复核 -> 结果
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

如果当前目标会改变项目最终形态、模块边界或路线图，必须先进入策略修订：

```text
灵感进入 ai/project/inbox/ideas/
→ strategy_update 读取 final-shape / module-map / roadmap / decisions / constraints
→ 输出 ai/project/proposals/final-shape-updates/YYYYMMDD-topic.md
→ 人类确认
→ apply_strategy_update 合并进正式方向文件
→ 再生成或执行具体 task.md
```

## 12. Bootstrap 与人类参与边界

普通用户通常只需要提供意图并确认两个文件：

```text
ai/project/project.md
ai/project/task.md
```

AI 在引导模式中负责先生成项目上下文草稿。默认读取范围包括：

- 根目录文档：`README*`、`CONTRIBUTING*`、`CHANGELOG*`；
- package/build manifest：`package.json`、`pyproject.toml`、`Cargo.toml`、`go.mod`、`pom.xml`、`build.gradle*`、`Makefile`；
- 项目文档：`docs/**`，优先 overview、architecture、setup、testing、deployment、API、ADR、decision；
- 已有 AI refs：`ai/project/refs/*.md`；
- source / test / config / docs 的浅层目录结构。

`AGENTS.md` 和 `CLAUDE.md` 是同内容 AI 入口路由文件，只用于宿主工具自动发现，
不作为项目业务证据读取。

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

引导模式不仅要生成项目身份，也要在有证据时初始化方向层：

```text
ai/project/refs/final-shape.md
ai/project/refs/module-map.md
ai/project/refs/roadmap.md
```

如果现有资料不足以判断最终形态、模块地图或路线图，必须写 `Unknown` 或保留占位，
不能为了填满文档而编造愿景。

## 13. 任务文件 `task.md`

`ai/project/task.md` 是当前任务契约。

它应包含：

- task id；
- 任务类型；
- 优先级；
- 风险等级；
- 执行策略；
- 模型分工策略；
- refs 要求；
- 修改权限；
- 命令权限；
- 目标；
- 范围；
- 约束；
- 验收标准；
- stop conditions。

任务类型允许包含：

```text
bugfix
feature
refactor
docs
config
test
research
strategy_update
apply_strategy_update
```

其中 `strategy_update` 只生成方向修订提案，不写代码；`apply_strategy_update`
只应用已确认提案，不顺手扩展新方向。

原则：

```text
任务不清楚，不执行。
验收不可验证，不声明成功。
权限不允许，不越界修改。
```

## 14. 执行授权策略

执行策略入口写在：

```text
ai/project/task.md.execution_policy
ai/template/execution-policy.md
```

默认模式是 `auto`。AI 每次执行前先做任务分解和风险判断，再决定使用
`normal` 还是 `bounded_continuous`，不依赖用户口令。

执行前规划：

- AI 根据用户目标、项目上下文和仓库事实推断目标、范围、验收、权限和验证方式；
- 只有 `ai/project/task.md.readiness = ready_to_execute` 时才进入执行；本轮新建或重写
  `task.md` 时必须停在确认交接；
- 先列 L1 任务清单，并给每个 L1 标注 Green / Yellow / Red；
- L1 必须是可独立验收的垂直切片，不是机械步骤清单；
- L1 少于 2 个时使用 `normal`；
- L1 为 2 个或更多时自动使用 `bounded_continuous`；
- 任一 L1 为 Red 时停止等待人类确认；Green 和 Yellow 不阻塞启动。

`bounded_continuous` 规则集中在 `ai/template/execution-policy.md`。核心要求：

- 按 L1 -> L2 -> L3 执行，执行 L1 前规划 L2，执行 L2 前按需规划 L3；
- 默认最多 3 层，只有当 L3 仍过大、不可验证或不可回退时才动态增加 L4；
- 每个任务节点必须有风险评级、预期改动范围、验收方式和证据要求；
- L1 清单必须用待办列表展示，每完成一个 L1 就打勾并划掉；
- `task_tree` 写回应集中在执行前、L1 开始/完成、Red、blocked、范围变化和最终收尾；
- 默认按 `vertical_slice` 推进，每轮都要产生可检查增量；
- Checkpoint 只在风险从 Green 变 Yellow/Red、即将扩大范围或权限、完成 L1 垂直切片、
  验证失败后准备继续或最终收尾时输出；
- 每个 Checkpoint 必须包含证据：已改文件、已运行命令、验证结果或无法验证原因；
- Green 可自动继续；
- Yellow 只允许当前 L1/L2 内的局部低风险修正，不能改变公共接口、数据模型、权限、
  安全、架构方向或验收标准；
- Red 必须停止等待人类确认；
- 用户可见输出默认只展示 L1、风险结论、证据、Red 确认和最终结果，不展示内部协议细节；
- 目标、范围、验收和权限由 AI 推断，但不能越过项目规则、显式用户限制、
  `permission.modify.denied`、安全边界或破坏性操作限制；
- 需要扩大权限、运行未允许命令、访问网络、执行破坏性操作、改变产品方向、核心架构、
  公共 API、持久化数据结构、安全边界、支付、账号或权限时，当前节点必须标为 Red。

它不适用于方向未定且无法推断、验收无法定义或高风险架构取舍任务；这些应直接评为 Red。

## 15. 模型分工协议

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

## 16. 风险门禁

任务涉及以下内容时必须谨慎：

- 数据迁移；
- 认证 / 授权；
- 支付 / 短信 / 外部回调；
- 公共 API；
- 生产部署；
- 大范围重构；
- 不可逆操作。

如果风险高且 `task.md` 未明确授权，AI 必须停止并写 blocked 结果。

## 17. refs 延迟加载

`ai/project/refs/` 存放按需读取的详细资料。

默认不全量读取。

推荐路由：

```text
最终形态 / 北极星 / 任务价值判断 -> ai/project/refs/final-shape.md
当前模块结构 / 边界 / 依赖方向     -> ai/project/refs/module-map.md
阶段目标 / 近期路线 / 暂缓事项     -> ai/project/refs/roadmap.md
架构 / API / 模块边界       -> ai/project/refs/architecture.md
历史决策                    -> ai/project/refs/decisions.md
安全 / 兼容 / 性能 / 数据    -> ai/project/refs/constraints.md
构建 / 测试 / 运行 / 部署    -> ai/project/refs/commands.md
```

每次读取 ref 都必须在 `result.json.refs_read` 中记录原因。

## 17.1 inbox 待吸收资料

`ai/project/inbox/` 存放尚未整合进项目上下文的新资料。
已完成整合的资料统一移动到 `ai/project/inbox/processed/`，用于追溯并避免重复处理。

典型内容：

```text
ai/project/inbox/business-context.md
ai/project/inbox/product-workflows.md
ai/project/inbox/domain-model.md
ai/project/inbox/raw/interview-notes.md
ai/project/inbox/processed/business-context.md
```

当 inbox 中的资料需要吸收时，执行：

```text
整合 ai/project/inbox/ 里的新资料
```

AI 必须先输出整合计划，等人类确认后，才更新 `project.md`、`runtime.md` 和 `refs/*`。
应用整合完成后，AI 必须把本次已处理的 `ai/project/inbox/*.md`
移动到 `ai/project/inbox/processed/`。`processed/` 中的资料默认不再触发
`reconcile` 或 `next` 的待处理资料判断。
即使用户口语上说“整合整个 inbox”，默认也只处理 `ai/project/inbox/*.md`
和 `ai/project/inbox/raw/*.md`；`ai/project/inbox/ideas/**` 不参与上下文整合。

如果新资料会改变 `final-shape.md`、`module-map.md` 或 `roadmap.md` 的方向性内容，
上下文整合只能建议创建 `strategy_update` 提案，不能直接改这些文件。

## 17.2 项目北极星与策略修订

`ai/project/refs/final-shape.md` 是项目北极星说明书，也可以理解为
Product Constitution / Final Shape Spec。它负责保存：

- 项目一句话定位；
- 解决的本质问题；
- 目标用户和核心痛点；
- 最终产品形态；
- 当前阶段不做什么；
- 核心模块边界；
- 长期护城河；
- 判断任务是否值得做的标准；
- 判断项目是否跑偏的标准。

配套文件：

```text
ai/project/refs/module-map.md
ai/project/refs/roadmap.md
ai/project/inbox/ideas/
ai/project/proposals/final-shape-updates/
ai/project/proposals/final-shape-updates/_template.md
```

门禁规则：

```text
灵感不能直接改宪法。
AI 不能在普通执行任务里顺手改宪法。
普通执行任务不能直接改北极星、模块地图或路线图。
```

正确流程：

```text
idea -> proposal -> review -> human confirm -> update
```

`strategy_update` 必须输出到：

```text
ai/project/proposals/final-shape-updates/YYYYMMDD-topic.md
```

并以：

```text
ai/project/proposals/final-shape-updates/_template.md
```

作为结构模板。

提案必须包含：

1. 新灵感摘要
2. 与当前 final-shape 的一致点
3. 冲突点
4. 应该吸收的部分
5. 应该拒绝的部分
6. 对模块地图的影响
7. 对路线图的影响
8. 建议修改 diff
9. 风险
10. 是否推荐合并

只有人类确认后，`apply_strategy_update` 才能修改：

```text
ai/project/refs/final-shape.md
ai/project/refs/module-map.md
ai/project/refs/roadmap.md
ai/project/refs/decisions.md
ai/project/refs/constraints.md
```

## 18. 输出结果

每次执行必须写：

```text
ai/project/result.json
ai/project/result.md
ai/project/metrics.json
```

### 18.1 `result.json`

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

### 18.2 `result.md`

人类可读摘要。

用于快速查看：

- 状态；
- 改了什么；
- 如何验证；
- 有什么问题；
- 下一步。

### 18.3 `metrics.json`

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

## 19. 状态规则

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

## 20. runtime 治理

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

## 21. 同步规则

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

## 22. npm 包结构

模板仓库内部结构：

```text
template/
  ai/
    README.md
    template/
    project/

bin/
  agent-execution-template.js

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
- `bin/agent-execution-template.js` 是 CLI；
- `test/selftest.js` 是本地自测。

## 23. 自测与发布检查

本地自测：

```bash
npm test
```

doctor：

```bash
node bin/agent-execution-template.js doctor
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
npm_config_cache=/tmp/npm-cache-agent-execution-template npm pack --dry-run
```

diff 检查：

```bash
git diff --check
```

## 24. 当前能力边界

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
- workspace 切换；
- sandbox 生命周期；
- session fork / rollback；
- worker 调度；
- 云同步；
- IDE 插件；
- 发布流水线。

## 25. 最终判断

Agent Execution Template v0.8 已经从一个 prompt/template 原型，升级为：

```text
低摩擦、可安装、可升级、保护用户现场的 AI Repo Execution Protocol npm 包雏形。
```

它的长期价值不在于替代任何模型或 Agent，而在于提供一套稳定协议：

```text
让一堆不同能力、不同成本的 AI Agent，都能在同一套项目边界下产出可验收结果。
```

一句话收口：

```text
template 是协议，project 是现场；人类定义目标和边界，AI 按协议执行并留下证据。
```
