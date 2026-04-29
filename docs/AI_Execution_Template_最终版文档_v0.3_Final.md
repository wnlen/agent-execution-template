# AI Execution Template 最终版文档 v0.3 Final

## 1. 项目名称

**AI Execution Template**

---

## 2. 一句话定位

**AI Execution Template 是一个最小文件化 AI Coding Agent 执行协议，用 `task.md` 定义任务边界，用 `runtime.md` 提供压缩运行上下文，用 `refs/` 延迟加载详细资料，用 `result.json` 固化可审计执行结果，并通过任务可执行性检查、风险门禁、最小权限、验证等级和运行上下文治理，让 AI 在有限上下文内完成可验证、可复盘、可控边界的软件开发任务。**

它的目标不是让 AI 更复杂，而是让 AI 每轮做到：

- 只读取必要上下文；
- 只执行当前任务；
- 只修改授权范围；
- 只运行被允许的命令；
- 不在任务不清、权限不明、风险过高时强行执行；
- 用结构化结果证明读了什么、改了什么、为什么改、如何验证、哪里仍不确定。

---

## 3. 核心目标

本项目用于解决 AI 编程协作中的八类问题：

1. 每轮都要重复解释项目背景。
2. 长会话不断膨胀，token 成本越来越高。
3. AI 容易输出无关解释、教程和泛化建议。
4. 项目规则、约束、任务结果没有稳定沉淀位置。
5. AI 实际读取了哪些文件、是否越界、是否遵守范围，缺少审计依据。
6. AI 在任务不清、验收不明、权限不足时仍然强行修改代码。
7. AI 做了修改但没有验证，却把结果声明为成功。
8. AI 运行命令或修改文件时缺少权限分级，容易做多、跑多、改多。

最终目标是：

```text
用最少、最稳定、最可维护的协作文件，让 AI 快速理解当前任务、必要上下文、执行边界、权限范围、风险等级、验证要求和结果写回规则。
```

每次 AI 执行必须遵循以下闭环：

```text
读取任务
→ 检查任务是否可执行
→ 检查风险是否可接受
→ 读取运行上下文
→ 按需读取参考资料
→ 只读取任务相关项目文件
→ 在授权范围内执行
→ 尽可能验证
→ 写回可审计结果
→ 建议是否更新长期运行上下文
```

---

## 4. 项目非目标

AI Execution Template 不是：

- 不是新的 AI 编程工具。
- 不是 Prompt Collection。
- 不是 AI Wrapper。
- 不是 IDE 插件。
- 不是复杂 Agent 框架。
- 不是自动化任务平台。
- 不是替代 Codex、Claude Code、OpenClaw、Aider、GitHub Copilot 的工具。

AI Execution Template 是：

- 一个轻量级 AI 协作文件协议。
- 一个低 token、低噪声、高执行导向的项目模板。
- 一个可以复制到任意软件项目中的 `ai/` 执行层。
- 一个让 AI 编程任务具备边界、权限、风险、验证和审计结果的最小协议。

第一版不追求自动化程度，先追求协议稳定、可手工维护、可跨 AI 工具迁移。

---

## 5. 核心哲学

```text
Control execution, not capability.
```

不要限制 AI 的能力，而是限制无效上下文、无效输出、无边界修改、无权限命令和不可审计执行。

AI 不应该每轮重新理解整个项目，也不应该输出大段解释、总结、建议和教程。

AI 应该：

- 读取当前任务。
- 判断任务是否具备执行条件。
- 判断任务风险是否需要阻断或升级授权。
- 读取最小运行上下文。
- 判断是否需要更多参考资料。
- 只读取任务相关文件。
- 执行最小必要修改。
- 只运行被允许的命令。
- 尽可能验证结果。
- 明确记录假设、读取、修改、命令、验证和遗留问题。
- 写回结构化结果。

本项目的核心不是“让 AI 更聪明”，而是让 AI 的执行过程更可控、更可复盘、更少污染长期上下文。

---

## 6. 最终推荐目录结构

```text
ai/
  README.md                 # 人类使用说明，不参与每轮执行

  prompt.md                 # 启动入口：读什么、怎么执行、何时读 refs
  task.md                   # 当前任务：目标、范围、相关文件、验收标准、权限、风险
  runtime.md                # 必读压缩上下文：状态 + 规则 + 当前有效约束
  result.json               # 当前最新执行结果，唯一权威结果入口

  refs/
    architecture.md         # 详细架构，按需读取
    decisions.md            # 历史决策，按需读取
    constraints.md          # 详细约束，按需读取
    commands.md             # 命令清单，按需读取

  schemas/
    result.schema.json      # result.json 结构约束，不默认读取
    task.schema.json        # task.md 结构约束，不默认读取

  archive/
    tasks/                  # 历史任务归档，默认不读
    results/                # 历史结果归档，默认不读
```

最终结构的核心不是文件多，而是职责稳定：

```text
prompt.md   = 怎么启动
task.md     = 本轮做什么、允许做什么、风险多高
runtime.md  = 在什么长期有效规则和上下文下做
result.json = 本轮最新执行结果
refs/       = 按需读取的详细参考资料
schemas/    = 非默认读取的结构校验
archive/    = 不进入默认上下文的历史归档
```

---

## 7. v0.3 Final 相比 v0.2 的关键升级

v0.3 不改变 v0.2 的核心目录结构，只补强协议约束。

新增或强化七项：

1. **`result.json` 条件读取规则**：默认不读，但任务依赖上轮结果时必须读取。
2. **`task.md` YAML Front Matter**：让任务元数据可被机器校验。
3. **最小权限模型**：从 yes/no 升级为 allowlist / denylist。
4. **Risk Gate**：在任务可执行之外，判断任务是否危险。
5. **`commands.md` 命令分级**：区分安全验证命令、本地运行命令、危险命令、禁止命令。
6. **`runtime_update` 独立治理**：长期上下文更新必须走专门任务，不混入业务任务。
7. **`status` 与 `verification` 一致性规则**：没有验证通过，不得声明 success。

核心升级方向：

```text
少读 + 少改 + 少跑 + 少声明成功。
```

---

## 8. 核心设计原则

### 8.1 默认读取集必须极小

每轮 AI 默认只读取三个文件：

```text
ai/prompt.md
ai/task.md
ai/runtime.md
```

三个文件分别回答：

```text
prompt.md   → 怎么启动？
task.md     → 本轮做什么？
runtime.md  → 在什么规则和上下文下做？
```

默认读取集越小，AI 越不容易被历史噪声、无关背景和旧决策污染。

---

### 8.2 `result.json` 条件读取，而非默认读取

`result.json` 不属于每轮默认读取集。

但出现以下情况时，AI 必须读取 `ai/result.json`：

- `task.md` 的 `depends_on_previous_result` 为 `true`。
- 本轮任务是继续上轮任务。
- 本轮任务要求复盘、验证或处理上轮遗留问题。
- 本轮任务需要确认上轮读取、修改、命令或验证记录。

推荐在 `task.md` 顶部声明：

```yaml
---
depends_on_previous_result: false
---
```

原则：

```text
低 token 优先；但任务依赖上轮状态时，必须读取当前权威结果。
```

---

### 8.3 详细资料必须延迟加载

`refs/` 下的文件不是默认上下文，而是参考资料。

只有任务确实需要时，AI 才读取：

```text
ai/refs/architecture.md
ai/refs/decisions.md
ai/refs/constraints.md
ai/refs/commands.md
```

延迟加载目标：

```text
小任务不读大背景；
局部修改不读全架构；
无命令执行不读命令表；
无历史决策冲突不读 decisions。
```

但 `task.md` 可以显式指定必须读取的 refs：

```yaml
refs:
  required:
    - ai/refs/constraints.md
  optional:
    - ai/refs/architecture.md
```

规则：

```text
task.md 指定 required refs 时，AI 必须读取。
AI 自行追加读取 optional 或其他 refs 时，必须在 result.json 记录原因。
```

---

### 8.4 当前任务必须通过 Task Readiness Gate

AI 不应在任务不清楚时强行执行。

每轮执行前，必须检查 `task.md` 是否至少包含：

```text
Goal
Scope
Acceptance
Permission
```

如果缺少关键字段，或目标、范围、验收标准、修改权限不明确，AI 应停止修改代码，并写入：

```json
{
  "status": "blocked",
  "issues": ["task.md lacks clear acceptance criteria"]
}
```

这条规则是从聊天驱动转为任务驱动的关键。

---

### 8.5 当前任务必须通过 Risk Gate

任务清楚不代表任务安全。

在 Task Readiness Gate 之后，AI 必须执行 Risk Gate。

命中以下任一条件，应提升风险等级：

- 涉及数据库迁移、数据删除、数据修复。
- 涉及登录、权限、支付、短信、回调等高风险链路。
- 涉及公开 API、协议字段、兼容性变化。
- 涉及生产部署、线上配置、运维脚本。
- 涉及大范围重构、跨模块修改。
- 涉及不可回滚或难回滚操作。
- 涉及安全、隐私、合规或用户数据。

如果任务风险高，但 `task.md` 没有明确授权，AI 应阻断：

```json
{
  "status": "blocked",
  "issues": ["High-risk task requires explicit permission"]
}
```

核心原则：

```text
任务可执行，只说明可以开始判断；风险可接受，才说明可以开始修改。
```

---

### 8.6 权限必须从 yes/no 升级为 allowlist / denylist

v0.2 的权限字段可以是：

```text
Modify code: yes/no
Run commands: yes/no
Update runtime.md: yes/no
```

v0.3 推荐改为范围授权：

```yaml
permission:
  modify:
    allowed:
      - src/order/**
      - src/common/pdf/**
    denied:
      - db/migrations/**
      - deployment/**
  commands:
    allowed:
      - npm run build
      - mvn test
    denied:
      - deploy
      - rm -rf
      - database migration
  network: false
  destructive_actions: false
  runtime_update: propose_only
```

AI 必须遵守：

```text
未列入 allowed 的修改，不默认允许。
命中 denied 的修改，必须阻断或请求重新定义任务。
```

这是 v0.3 最关键的安全升级。

---

### 8.7 执行结果必须单一可信，但历史结果必须可审计

当前最新结果只保留一个权威入口：

```text
ai/result.json
```

不再同时维护 `result.md`。

原因：

- 避免同一结果写两份。
- 避免 JSON 和 Markdown 不一致。
- 降低维护成本。
- 让下一轮 AI 有唯一可信输入。

历史结果应归档到：

```text
ai/archive/results/<task-id>.json
```

原则：

```text
result.json 是当前权威入口；
archive/results 是历史审计链；
archive 默认不进入上下文。
```

---

### 8.8 当前任务和运行上下文必须分离

`task.md` 是高频变动文件。

`runtime.md` 是低频维护文件。

不要把项目规则、状态、长期约束都塞进 `task.md`，否则每轮编辑任务时容易污染上下文，也容易误删关键约束。

也不要把每轮任务结果、临时 debug、失败尝试写进 `runtime.md`。

---

### 8.9 长期上下文不得被历史过程污染

`runtime.md` 不是项目日记。

历史任务、历史结果、失败尝试、临时 debug 过程，都应该进入：

```text
ai/archive/
```

只有长期仍然有效的状态、约束和决策，才可以进入 `runtime.md`。

AI 默认不得直接修改 `runtime.md`。

如果本轮产生长期有效变化，AI 只能在 `result.json` 中提出建议：

```json
"runtime_update": {
  "required": true,
  "changes": ["xxx"],
  "reason": "xxx"
}
```

---

### 8.10 `runtime_update` 必须独立治理

当 `runtime_update.required = true` 时，不应在当前业务任务中直接修改 `runtime.md`。

推荐后续创建一个专门任务：

```md
# Task

## Goal
Review and apply proposed runtime update from ai/result.json.

## Scope
Allowed:
- ai/runtime.md

Out of scope:
- src/**
- deployment/**
- refs/**

## Acceptance
- runtime.md only contains long-term valid context.
- No task-specific debug process is added.
- Applied changes match result.json.runtime_update.

## Permission
- Modify ai/runtime.md: yes
- Modify code: no
- Run commands: no
```

原则：

```text
业务开发任务只产生 runtime 更新建议；
runtime 更新任务只维护长期运行上下文。
```

---

### 8.11 成功不能只靠声明，必须带验证等级

AI 不应把“看起来完成”直接标记为成功。

每轮执行结果必须声明验证等级：

```text
none       未验证
read_only  只读文件确认
static     静态检查 / 类型检查
command    运行命令验证
test       自动化测试通过
manual     需要人工验证
```

硬规则：

```text
status = success 时，verification.passed 必须为 true。
如果需要人工验证但尚未完成，status 不得为 success，应为 partial。
```

---

## 9. 文件职责说明

## 9.1 `ai/README.md`

### 定位

人类使用说明。

### 是否每轮读取

否。

### 内容建议

- 本协议的使用方式。
- 文件职责说明。
- 标准执行流程。
- 维护规则。
- 示例任务。
- 常见反模式。

### 控制原则

`README.md` 面向人类，不面向每轮 AI 执行。

它可以稍微详细，但不应被默认加入每轮上下文。

---

## 9.2 `ai/prompt.md`

### 定位

AI 执行启动入口。

它是一个极短 bootstrap 文件。

### 是否每轮读取

是。

### 推荐长度

```text
200 - 500 tokens
```

### 职责

它只负责告诉 AI：

- 默认读取哪些文件。
- 执行前如何检查任务是否可执行。
- 执行前如何检查风险和权限。
- 什么情况下读取 `result.json`。
- 什么情况下读取 `refs/`。
- 哪些行为禁止。
- 如何验证。
- 最终结果写到哪里。

### 不应该包含

- 项目背景。
- 大段规则。
- 详细架构。
- 历史决策。
- 教程式说明。

### 推荐模板

```md
# AI Execution Prompt

Read first:

1. ai/task.md
2. ai/runtime.md

Execute only the current task.

Read ai/result.json only when:

- task.md says depends_on_previous_result = true
- the task continues, verifies, or reviews the previous result

Before editing code, check task readiness:

- Goal must be clear.
- Scope must be clear.
- Acceptance must be clear.
- Permission must allow modification.

Before editing code, check risk:

- If task involves data, auth, payment, production, public API, deployment, broad refactor, security, privacy, or irreversible operations, require explicit permission.

If task readiness or risk gate fails, do not edit code. Write ai/result.json with status = "blocked".

Read refs/ only when needed or explicitly required by task.md:

- Architecture / API / module boundary -> ai/refs/architecture.md
- Historical decision -> ai/refs/decisions.md
- Security / compatibility / performance / data / deployment -> ai/refs/constraints.md
- Build / test / run / deploy command -> ai/refs/commands.md

Execution rules:

- Current task first.
- Do not expand scope.
- Do not scan unrelated files.
- Do not rewrite unrelated modules.
- Follow permission allowlist / denylist.
- Do not run commands outside allowed commands.
- Read files before guessing.
- Record assumptions in result.json.
- Verify when possible.
- Do not mark success unless verification.passed = true.
- Do not edit ai/runtime.md unless task.md explicitly allows it.
- Write final result to ai/result.json.
```

---

## 9.3 `ai/task.md`

### 定位

当前任务的唯一来源。

### 是否每轮读取

是。

### 推荐长度

```text
600 - 1500 tokens
```

### 职责

它负责描述本轮任务，包括：

- 本轮目标。
- 任务类型。
- 风险等级。
- 是否依赖上轮结果。
- 允许修改范围。
- 禁止修改范围。
- 相关文件。
- 必读 refs。
- 本轮特殊约束。
- 验收标准。
- 是否允许改代码。
- 是否允许运行命令。
- 是否允许更新 `runtime.md`。
- 阻断条件。

### 推荐模板

```md
---
task_id: "2026-04-28-example"
type: "bugfix"
priority: "P1"
risk_level: "medium"
depends_on_previous_result: false
refs:
  required: []
  optional:
    - ai/refs/commands.md
permission:
  modify:
    allowed:
      - src/example/**
    denied:
      - db/migrations/**
      - deployment/**
  commands:
    allowed:
      - npm run build
    denied:
      - deploy
      - database migration
  network: false
  destructive_actions: false
  runtime_update: propose_only
---

# Task

## Goal

Describe the exact goal of this task.

## Scope

Allowed scope:

- xxx
- xxx

Out of scope:

- xxx
- xxx

## Related Files

- path/to/file1
- path/to/file2

## Constraints

- Do not change xxx.
- Do not refactor unrelated modules.
- Do not modify public API unless required.

## Acceptance

The task is complete when:

- xxx
- xxx

## Stop Conditions

Stop and write result.json with status = "blocked" if:

- Required files are missing.
- Goal is ambiguous.
- Acceptance cannot be verified.
- Scope requires modifying files outside allowed range.
- A required command cannot be run.
- Risk level is higher than task permission allows.
```

### 关键原则

`task.md` 的质量决定执行精度。

低 token 不等于低信息密度。

必须明确：

```text
目标、边界、相关文件、验收标准、权限、风险、阻断条件。
```

---

## 9.4 `ai/runtime.md`

### 定位

每轮必读的运行上下文。

它是整个协议的核心文件。

### 是否每轮读取

是。

### 推荐长度

```text
800 - 1500 tokens
```

超过 1500 tokens 应该压缩。

### 职责

`runtime.md` 合并并压缩以下信息：

- 当前状态。
- 通用执行规则。
- 项目硬约束。
- 当前有效上下文。
- `refs/` 路由规则。
- 长期仍然有效的风险提示。

它替代原来的：

```text
state.md
rules.md
context.md
context/index.md
```

### 推荐模板

```md
# Runtime

## Current State

- Phase:
- Focus:
- Blocker:
- Known Risks:

## Hard Rules

- Current task first.
- Do not expand scope.
- Do not rewrite unrelated files.
- Do not repeat known background.
- Do not output tutorials.
- Do not treat guesses as facts.
- Read relevant files before making assumptions.
- Prefer minimal safe changes.
- Follow permission allowlist / denylist.
- Verify after changes when possible.
- Keep final output short.
- Do not edit runtime.md unless explicitly allowed by task.md.

## Project Constraints

- xxx
- xxx
- xxx

## Active Context

- xxx
- xxx
- xxx

## Ref Routing

- Architecture / API / module boundary -> ai/refs/architecture.md
- Historical decision -> ai/refs/decisions.md
- Security / compatibility / performance / data / deployment -> ai/refs/constraints.md
- Build / test / deploy command -> ai/refs/commands.md
```

### 维护原则

`runtime.md` 不是项目日记。

不要写入：

- 每天做了什么。
- 长篇过程记录。
- 已废弃方案细节。
- AI 尝试过但失败的长过程。
- 临时 debug 信息。
- 单轮任务的局部结果。

这些应该进入：

```text
ai/archive/results/
```

---

## 9.5 `ai/result.json`

### 定位

当前最新执行结果，唯一权威结果入口。

### 是否每轮读取

默认不读。

当 `task.md` 声明 `depends_on_previous_result = true`，或任务要求继续、复盘、验证上轮结果时必须读取。

### 是否每轮写入

是。

### 是否保留历史

当前结果写入：

```text
ai/result.json
```

历史结果可归档为：

```text
ai/archive/results/<task-id>.json
```

### 推荐结构

```json
{
  "protocol_version": "0.3",
  "status": "success | partial | failed | blocked",
  "task_id": "",
  "task_summary": "",
  "scope_followed": true,
  "risk": {
    "level": "low | medium | high",
    "gate_passed": true,
    "notes": []
  },
  "permission": {
    "followed": true,
    "violations": []
  },
  "files_read": [],
  "refs_read": [
    {
      "file": "",
      "reason": ""
    }
  ],
  "files_changed": [
    {
      "file": "",
      "change_type": "created | modified | deleted",
      "reason": ""
    }
  ],
  "commands_run": [
    {
      "command": "",
      "category": "safe_verify | local_run | dangerous | forbidden",
      "result": "passed | failed | skipped",
      "notes": ""
    }
  ],
  "verification": {
    "level": "none | read_only | static | command | test | manual",
    "passed": false,
    "evidence": []
  },
  "evidence": {
    "git_diff_summary": "",
    "changed_files_from_git": [],
    "command_outputs": [],
    "unverified_claims": []
  },
  "assumptions": [],
  "issues": [],
  "next": [],
  "runtime_update": {
    "required": false,
    "changes": [],
    "reason": ""
  }
}
```

### 字段说明

- `protocol_version`：协议版本。
- `status`：本轮执行状态。
- `task_id`：任务 ID。
- `task_summary`：本轮任务摘要。
- `scope_followed`：是否遵守任务范围。
- `risk`：风险门禁结果。
- `permission`：权限遵守情况。
- `files_read`：实际读取过的项目文件。
- `refs_read`：读取过的 `refs/` 文件及原因。
- `files_changed`：修改过的文件、修改类型和原因。
- `commands_run`：运行过的命令、分类及结果。
- `verification`：验证等级、是否通过、证据。
- `evidence`：额外证据，包括 git diff、命令输出、未验证声明。
- `assumptions`：执行中做出的假设。
- `issues`：遗留问题。
- `next`：建议下一步。
- `runtime_update`：是否建议更新 `runtime.md`。

### 状态一致性规则

```text
status = success 时，verification.passed 必须为 true。
verification.passed = false 时，status 不得为 success。
manual 但未人工验证通过时，status 应为 partial。
blocked 不得包含 files_changed，除非任务是在修改后发现阻断风险。
permission.followed = false 时，status 不得为 success。
scope_followed = false 时，status 不得为 success。
```

---

## 9.6 `ai/refs/architecture.md`

### 定位

详细架构参考资料。

### 是否每轮读取

否。

### 触发条件

只有任务涉及以下内容时读取：

- 模块边界。
- API 结构。
- 数据流。
- 调用链。
- 部署结构。
- 跨模块影响。

### 内容建议

```md
# Architecture

## System Overview

## Main Modules

## Data Flow

## API Flow

## Deployment Shape
```

---

## 9.7 `ai/refs/decisions.md`

### 定位

历史技术决策记录。

### 是否每轮读取

否。

### 触发条件

只有任务涉及以下内容时读取：

- 为什么使用某技术方案。
- 是否允许推翻某设计。
- 某方案是否曾经被否决。
- 技术取舍依据。

### 内容建议

```md
# Decisions

## D001 - Use xxx instead of yyy

Reason:
Impact:
Do not change unless:
```

---

## 9.8 `ai/refs/constraints.md`

### 定位

详细约束参考资料。

### 是否每轮读取

否。

### 触发条件

只有任务涉及以下内容时读取：

- 安全。
- 权限。
- 数据一致性。
- 性能。
- 兼容性。
- 部署。
- 回滚。
- 合规。

### 内容建议

```md
# Constraints

## Data

## Security

## Compatibility

## Performance

## Deployment / Rollback
```

---

## 9.9 `ai/refs/commands.md`

### 定位

命令清单。

### 是否每轮读取

否。

只有任务需要运行命令，或 `task.md` 显式要求读取时读取。

### 命令分级

```md
# Commands

## Safe Verify Commands

- npm run lint
- npm run build
- mvn test

## Local Run Commands

- npm run dev
- mvn spring-boot:run

## Dangerous Commands

- database migration
- deploy
- delete files
- reset branch

## Forbidden Unless Explicitly Allowed

- production deploy
- data migration
- destructive cleanup
```

### 执行规则

```text
AI 默认只能运行 Safe Verify Commands。
Local Run Commands 需要 task.md 明确允许。
Dangerous Commands 必须逐项授权。
Forbidden 类不得自动运行。
```

---

## 9.10 `ai/schemas/`

### 定位

协议结构校验文件。

### 是否每轮读取

否。

### 职责

用于约束：

```text
ai/result.json
ai/task.md
```

### 说明

第一版可以只提供推荐结构，不强制实现自动校验。

后续如果提供 CLI 或初始化工具，可以使用 schema 做自动校验。

---

## 9.11 `ai/archive/`

### 定位

历史归档。

### 是否每轮读取

否。

### 目录结构

```text
archive/
  tasks/
  results/
```

### 职责

保存历史任务和历史结果，避免污染 `runtime.md`。

### 关键原则

归档内容默认不进入上下文。

只有复盘、排查历史问题、分析长期趋势时才读取。

---

## 10. 标准执行流程

每轮 AI 开发任务按照以下流程执行：

```text
1. 用户编辑 ai/task.md
2. 用户打开 AI 工具
3. 用户粘贴或引用 ai/prompt.md
4. AI 读取 ai/task.md
5. AI 读取 ai/runtime.md
6. 如果 task.md 依赖上轮结果，AI 读取 ai/result.json
7. AI 检查 task.md 是否具备执行条件
8. AI 检查任务风险是否需要阻断或升级授权
9. 如果任务不可执行或风险未授权，AI 不改代码，只写 result.json blocked
10. AI 判断是否需要读取 ai/refs/
11. AI 只读取任务相关项目文件
12. AI 在 permission allowlist 内执行最小必要修改
13. AI 只运行允许的命令
14. AI 尽可能验证结果
15. AI 写回 ai/result.json
16. 如有必要，在 result.json 中提出 runtime.md 更新建议
17. 可选：归档本轮 task.md 和 result.json
18. 用户进入下一轮
```

---

## 11. 默认读取策略

### 11.1 每轮默认读取

```text
ai/prompt.md
ai/task.md
ai/runtime.md
```

### 11.2 条件读取

```text
ai/result.json
```

触发条件：

- `depends_on_previous_result = true`
- 继续上轮任务
- 复盘上轮任务
- 验证上轮遗留问题
- 需要确认上轮实际读取、修改、命令或验证记录

### 11.3 按需读取

```text
ai/refs/architecture.md
ai/refs/decisions.md
ai/refs/constraints.md
ai/refs/commands.md
```

### 11.4 默认不读取

```text
ai/README.md
ai/schemas/
ai/archive/
```

除非任务明确要求查看说明、schema 或历史归档。

---

## 12. Task Readiness Gate

AI 在修改任何代码前，必须检查当前任务是否可执行。

### 12.1 必需字段

`task.md` 至少需要具备：

```text
Goal
Scope
Acceptance
Permission
```

### 12.2 阻断条件

如果出现以下情况，AI 应停止执行：

- 目标不明确。
- 允许修改范围不明确。
- 验收标准缺失。
- 没有修改权限。
- 相关文件缺失且无法判断替代路径。
- 任务要求修改范围外文件。
- 必要命令无法运行且任务无法验证。

### 12.3 阻断输出

阻断时写入：

```json
{
  "protocol_version": "0.3",
  "status": "blocked",
  "task_summary": "",
  "scope_followed": true,
  "verification": {
    "level": "none",
    "passed": false,
    "evidence": []
  },
  "issues": [
    "Goal is ambiguous",
    "Acceptance criteria missing"
  ],
  "next": [
    "Clarify expected behavior in ai/task.md"
  ]
}
```

---

## 13. Risk Gate

Task Readiness Gate 解决“能不能做”。

Risk Gate 解决“该不该在当前授权下做”。

### 13.1 风险等级

```text
low       文档、小范围样式、小函数修复、无外部影响
medium    局部业务逻辑、局部接口、可回滚配置、非核心链路
high      数据、权限、支付、登录、生产、公共 API、部署、大重构、不可回滚操作
```

### 13.2 高风险触发条件

以下情况默认 high：

- 数据库结构、迁移、修复、删除。
- 登录、权限、支付、短信、第三方回调。
- 生产部署、线上配置、运维脚本。
- 公开 API、字段协议、兼容性变化。
- 大范围重构或跨模块调用链改变。
- 安全、隐私、合规相关任务。
- 难以回滚或不可回滚操作。

### 13.3 高风险任务处理规则

```text
如果 task.md 明确授权高风险范围，按授权执行。
如果未明确授权，写 result.json blocked。
如果可以拆成低风险验证任务，建议最小验证路径。
```

### 13.4 推荐阻断输出

```json
{
  "status": "blocked",
  "risk": {
    "level": "high",
    "gate_passed": false,
    "notes": ["Task touches database migration without explicit permission"]
  },
  "issues": ["High-risk task requires explicit permission"],
  "next": ["Add explicit database migration permission in task.md or split into read-only analysis first"]
}
```

---

## 14. Permission Model

### 14.1 原则

权限模型必须防止 AI 做多。

核心规则：

```text
未授权 = 不允许。
模糊授权 = 不允许。
超出 allowlist = 不允许。
命中 denylist = 立即停止。
```

### 14.2 文件修改权限

推荐结构：

```yaml
permission:
  modify:
    allowed:
      - src/order/**
      - src/common/pdf/**
    denied:
      - db/migrations/**
      - deployment/**
      - .github/workflows/**
```

执行规则：

```text
只允许修改 allowed 中的文件。
禁止修改 denied 中的文件。
如果任务需要修改未授权文件，停止并写 result.json partial 或 blocked。
```

### 14.3 命令权限

推荐结构：

```yaml
permission:
  commands:
    allowed:
      - npm run build
      - mvn test
    denied:
      - deploy
      - database migration
      - rm -rf
```

执行规则：

```text
只能运行 allowed 命令。
命令参数会改变风险等级时，必须重新判断。
禁止运行 denied 命令。
```

### 14.4 网络与破坏性动作

推荐结构：

```yaml
permission:
  network: false
  destructive_actions: false
```

执行规则：

```text
network = false 时，不访问外网、不拉包、不调用远程服务。
destructive_actions = false 时，不删除数据、不重置分支、不清理不可恢复文件。
```

---

## 15. 验证等级

AI 每轮必须声明验证等级。

```text
none       未验证
read_only  只读文件确认
static     静态检查 / 类型检查
command    运行命令验证
test       自动化测试通过
manual     需要人工验证
```

### 15.1 `none`

没有完成任何有效验证。

适用于：

- 任务被阻断。
- 无法读取必要文件。
- 修改未完成。

### 15.2 `read_only`

只通过阅读文件确认逻辑，没有运行命令。

适用于：

- 文档修改。
- 配置检查。
- 小范围静态文本变更。

### 15.3 `static`

完成静态检查、类型检查或语法检查。

适用于：

- TypeScript 类型检查。
- Java 编译检查。
- Lint 检查。

### 15.4 `command`

运行过构建、启动、迁移或其他验证命令。

适用于：

- `npm run build`
- `mvn package`
- `python script.py`

### 15.5 `test`

自动化测试通过。

适用于：

- 单元测试。
- 集成测试。
- 回归测试。

### 15.6 `manual`

代码已修改，但需要人工在 UI、设备、真实环境中验证。

适用于：

- UI 样式。
- 小程序真机行为。
- 第三方服务回调。
- 支付、短信、登录等外部依赖场景。

### 15.7 状态与验证一致性

```text
success 只能用于 verification.passed = true。
partial 用于已完成修改但仍需人工验证或部分验证。
blocked 用于任务不可执行或风险未授权。
failed 用于尝试执行但失败。
```

---

## 16. Token 控制策略

### 16.1 默认上下文三文件化

默认只读：

```text
prompt.md + task.md + runtime.md
```

目标是将每轮基础上下文控制在：

```text
1500 - 3000 tokens
```

### 16.2 `runtime.md` 强制压缩

`runtime.md` 是运行时压缩上下文，不是项目百科。

推荐上限：

```text
1500 tokens
```

超过后必须压缩。

### 16.3 `refs/` 延迟加载

详细资料不进入默认上下文。

只有任务触发时才读取。

示例：

```text
改按钮样式              -> 不读 refs
修局部函数 bug          -> 不读 architecture
改接口返回结构          -> 读 refs/architecture.md
涉及兼容性或数据一致性  -> 读 refs/constraints.md
需要跑测试              -> 读 refs/commands.md
涉及历史技术选择        -> 读 refs/decisions.md
```

### 16.4 `result.json` 替代聊天历史

每轮结束后写入结构化结果。

新会话可以在需要时通过：

```text
task.md + runtime.md + result.json
```

快速恢复状态，而不是依赖长聊天历史。

### 16.5 `archive/` 不进入默认上下文

历史任务和历史结果只做归档。

不要把历史过程长期堆在 `runtime.md`。

---

## 17. 输出控制规则

AI 默认终端输出应尽量短。

推荐终端输出格式：

```md
## Status
success | partial | failed | blocked

## Changed
- file

## Verified
- level: test/static/command/manual/read_only/none
- evidence

## Issues
- issue if any

## Next
- next step
```

不需要输出：

- 长篇解释。
- 项目背景复述。
- 无关建议。
- 教程式内容。
- 大段思考过程。
- 与任务无关的优化方案。

完整结果以 `ai/result.json` 为准。

---

## 18. MVP 范围

第一版只需要实现以下内容：

```text
ai/
  README.md
  prompt.md
  task.md
  runtime.md
  result.json

  refs/
    architecture.md
    decisions.md
    constraints.md
    commands.md

  schemas/
    result.schema.json
    task.schema.json

  archive/
    tasks/
    results/
```

第一版不做：

- CLI。
- Web UI。
- 多 Agent。
- 自动任务拆分。
- Token 统计器。
- IDE 插件。
- 云端同步。
- Benchmark 系统。

这些可以放入后续路线图。

---

## 19. Roadmap

### v0.1：协议能跑

交付：

- 基础 `ai/` 模板。
- README。
- `prompt.md`。
- `task.md`。
- `runtime.md`。
- `result.json` 格式。
- 一个真实项目示例。
- 三个真实任务案例：bugfix、小功能开发、受限重构。

### v0.2：协议可审计

交付：

- `result.json` schema。
- verification level。
- task readiness gate。
- runtime update governance。
- archive/results 历史记录规范。
- refs_read reason 记录。
- scope_followed 记录。

### v0.3：协议可控权

交付：

- task YAML Front Matter。
- result.json 条件读取规则。
- granular permission model。
- Risk Gate。
- commands.md 命令分级。
- status 与 verification 一致性规则。
- runtime_update 独立治理流程。

### v0.4：协议可迁移

交付：

- Spring Boot 示例。
- Vue / Uni-App 示例。
- Node 示例。
- Python 示例。
- 不同 AI 工具适配说明。
- 常见任务模板。

### v0.5：协议有效性证明

交付：

- 使用前后 token 对比。
- 长会话 vs `ai/` 协议对比。
- 输出长度对比。
- 常见错误案例。
- 误改率对比。
- 任务完成率对比。

### v0.6：降低接入成本

交付：

```bash
npx ai-execution-template init
```

附加：

- 可选 schema 校验。
- 模板初始化。
- 示例任务生成。

### v1.0：稳定协议

交付：

- 稳定文件协议。
- 稳定 `result.json` schema。
- 稳定任务执行流程。
- 支持主流 AI Coding Agent。
- 提供完整模板、示例和文档。

---

## 20. 成功标准

本项目成功的标准不是功能复杂，而是协议是否稳定、轻量、可执行、可验证、可审计、可控权。

成功标准：

1. 用户复制 `ai/` 文件夹后可以立即使用。
2. AI 默认只需读取三个核心文件即可开始工作。
3. 默认基础上下文控制在 1500 - 3000 tokens。
4. AI 能根据 `task.md` 执行任务，而不是继续闲聊。
5. AI 会在任务不清时停止，而不是强行猜测。
6. AI 会在高风险未授权时停止，而不是冒险执行。
7. AI 不会每轮重复读取完整项目背景。
8. AI 不会默认扫描无关文件。
9. AI 不会默认读取全部 refs。
10. AI 会记录实际读取过的文件。
11. AI 会记录读取 `refs/` 的原因。
12. AI 会记录是否遵守 scope。
13. AI 会记录是否遵守 permission。
14. AI 会记录验证等级和验证证据。
15. 没有验证通过，不会声明 success。
16. 每次任务结束后都有结构化结果。
17. `result.json` 是当前唯一权威执行结果。
18. 历史结果可以归档，但默认不进入上下文。
19. 新会话可以通过协作文件恢复项目状态。
20. `runtime.md` 不会膨胀成项目日记。
21. 输出明显更短、更聚焦。
22. 执行精度不因 token 压缩而下降。
23. AI 修改范围明显减少。
24. AI 运行命令更可控。
25. 审计链可以回答“读了什么、改了什么、跑了什么、怎么验证”。

---

## 21. 反模式

以下做法会破坏项目目标。

### 21.1 把 `runtime.md` 写成项目百科

错误：

```text
把所有架构、历史决策、失败尝试、每日进度都写进 runtime.md。
```

后果：

```text
默认上下文失控，低 token 目标失败。
```

正确：

```text
runtime.md 只保留当前仍然有效的运行上下文。
```

---

### 21.2 每轮都读取 `refs/`

错误：

```text
无论任务大小，都要求 AI 读取 refs/ 下所有文件。
```

后果：

```text
refs/ 失去延迟加载意义。
```

正确：

```text
只有任务触发时才读取对应 refs。
```

---

### 21.3 同时维护 `result.md` 和 `result.json`

错误：

```text
一份给人看，一份给机器读。
```

后果：

```text
两份结果迟早不一致。
```

正确：

```text
只保留 result.json 作为当前唯一权威结果。
```

---

### 21.4 把这个项目做成复杂 Agent 框架

错误：

```text
一开始就加入多 Agent、自动拆解、UI、云同步、复杂调度。
```

后果：

```text
项目从协议变成工具，MVP 失焦。
```

正确：

```text
先证明最小 ai/ 协议能稳定跑通真实任务。
```

---

### 21.5 任务不清仍然强行修改代码

错误：

```text
task.md 只写“修一下登录问题”，AI 直接开始搜索和改代码。
```

后果：

```text
AI 只能猜测目标，容易误改、扩大范围、引入新问题。
```

正确：

```text
任务不满足 readiness gate 时，写 result.json blocked，不改代码。
```

---

### 21.6 高风险未授权仍然执行

错误：

```text
任务涉及数据库迁移，但 task.md 只写“修一下数据问题”，AI 直接改 migration。
```

后果：

```text
不可逆风险被低估，线上数据可能受损。
```

正确：

```text
高风险任务必须有明确授权；否则先阻断或拆成只读分析任务。
```

---

### 21.7 没有验证却标记 success

错误：

```text
AI 修改完代码后写“完成”，但没有运行任何检查，也没有说明人工验证点。
```

后果：

```text
success 失去可信度。
```

正确：

```text
必须声明 verification.level 和 evidence。
没有 verification.passed = true，不得写 success。
```

---

### 21.8 权限只写 yes/no

错误：

```text
Modify code: yes
Run commands: yes
```

后果：

```text
AI 不知道边界，容易改多、跑多、扩大范围。
```

正确：

```text
使用 allowlist / denylist 明确文件范围和命令范围。
```

---

## 22. 最终判断

AI Execution Template 的最终结构不应该追求文件分类完整，而应该追求：

```text
默认读取集稳定
任务边界清晰
权限范围明确
风险门禁前置
硬约束不漏读
详细上下文延迟加载
执行结果单一可信
执行过程可审计
验证等级可追踪
历史过程不污染运行上下文
长期上下文更新必须显式治理
```

项目最小护城河不是文件夹结构本身，而是以下十二条协议约束：

```text
默认只读三个文件。
result.json 条件读取。
任务不清不得执行。
高风险未授权不得执行。
详细上下文按需读取。
当前任务永远优先。
修改范围必须 obey allowlist / denylist。
命令执行必须 obey allowlist / denylist。
执行结果只有一个当前权威文件。
读取、修改、命令、验证必须可审计。
runtime.md 不得被历史过程污染。
长期上下文更新必须经过显式治理。
```

---

## 23. 最终一句话

```text
AI Execution Template 是一个最小 ai/ 文件化执行协议，通过 prompt.md 启动执行，通过 task.md 明确任务边界、权限和风险，通过 runtime.md 提供压缩运行上下文，通过 refs/ 延迟加载详细资料，通过 result.json 固化可审计执行结果，并通过任务可执行性检查、风险门禁、最小权限、验证等级和 runtime 更新治理，在不降低执行精度的前提下降低 token 消耗、减少误改、压缩输出噪声、提升执行可信度。
```
