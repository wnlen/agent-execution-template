# 路线图

这个文件描述阶段性路线。
它回答“下一阶段往哪里生长”，不替代 `task.md` 的当前施工单。

## 当前阶段

- 阶段名称：v0.8 协议定位和模板一致性收口
- 阶段目标：保持 Agent Execution Template 作为 AI Repo Execution Protocol 的边界清晰，同时确保 CLI、双语模板、SPEC、README、dogfood `ai/template/**` 和 release check 一致。
- 成功信号：
  - `npm test` 通过。
  - `git diff --check` 通过。
  - `init` / `update` / `doctor` / `next` / `refresh` / `reconcile` / `strategy` 的用户语义清楚。
  - README/SPEC/模板对 repo-local protocol 与外部 runtime 的边界表达一致。
  - `ai/project/**` 上下文从占位升级为可供后续任务使用的稳定项目理解。

## 近期路线

| 阶段 | 目标 | 关键交付 | 不做什么 | 退出标准 |
| --- | --- | --- | --- | --- |
| v0.8 收口 | 稳定 AI Repo Execution Protocol 定位和项目现场上下文 | 同步 README/SPEC/template/ai refs；修正版本一致性；通过 release check | 不做外部 runtime、云同步或多 Agent 编排 | `npm test`、`git diff --check` 通过，项目上下文可确认 |
| v0.8.x 可用性增强 | 降低用户安装后下一步困惑 | 改善 `next`、`doctor`、bootstrap/reconcile/strategy 提示和示例 | 不引入 UI 或长驻服务 | 自测覆盖新增提示契约，README 与 CLI 输出一致 |
| v0.9 协议硬化 | 提高任务契约、结果和 metrics 的机器可校验性 | schema、doctor、示例任务/结果、模板一致性检查增强 | 不扩大到调度平台能力 | 失败模式可被 doctor 或测试捕获 |

## 已完成阶段

- npm bin 入口和双语 `init` / `update` / `doctor` 基础能力。
- `template/project` 双区结构和 `ai/project/**` 保护原则。
- bootstrap、reconcile、strategy update、bounded continuous execution 和 result/metrics 基础协议。
- 中英文模板、示例任务/结果和 release consistency 检查。

## 暂缓事项

- OpenClaw 或其他外部 runtime 的正式适配器。
- 多 Agent Task Graph、worker 调度、session fork/rollback、workspace 切换。
- IDE 插件、云服务、UI。
- 自动模型切换；当前只记录模型分工策略和升级原因。

## 路线图修订规则

- 普通执行任务可以提出路线图更新建议，但不能直接改本文件。
- 涉及项目方向、模块边界或阶段目标的修改，必须通过 `strategy_update` 提案。
