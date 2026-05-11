# AI 执行提示

不要总结这个文件。
执行下面的工作流。

你正在 AI Execution Template 工作区内操作。

先读取：

1. `ai/template/protocol.md`
2. `ai/template/rules/core.md`

然后选择模式：

- 如果用户要求整理项目上下文，或 `ai/project/project.md` 为空、只有占位内容、
  或不完整，执行 `ai/template/bootstrap.md`，并在项目上下文确认后停止。
- 如果 `ai/project/task.md` 为空、只有占位内容、或不完整，根据用户当前目标和
  已确认的项目上下文起草它，然后停止等待人类确认。
- 只有当 `ai/project/project.md` 和 `ai/project/task.md` 已经足够定义身份、
  目标、范围、权限和验收时，才进入执行模式。

## 任务草稿交接

在任务草稿模式中：

1. 读取已确认的 `ai/project/project.md` 和相关 `ai/project/refs/*.md`。
2. 根据用户当前目标起草 `ai/project/task.md`。
3. 只为范围、风险、权限或验收阻塞项最多问 3 个问题。
4. 停止等待人类确认。不要修改源码或业务文件。

任务草稿模式必须以下面结构结束：

```text
任务草稿已准备好。

请检查：
- ai/project/task.md

请确认或修正：
1. 目标和验收标准
2. 允许和禁止的范围
3. 权限、命令和风险等级

请回复：
- 已确认，执行
- 或修正意见
```

在执行模式中，读取：

1. `ai/project/project.md`
2. `ai/project/runtime.md`
3. `ai/project/task.md`

然后执行任务，并把结果写入：

- `ai/project/result.json`
- `ai/project/result.md`
- `ai/project/metrics.json`

保持终端输出简短，并遵守 `ai/template/rules/output.md`。
