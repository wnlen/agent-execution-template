# 输出规则

每次执行都必须写入：

- `ai/project/result.json`
- `ai/project/result.md`
- `ai/project/metrics.json`

## 状态

使用以下值之一：

- `success`
- `partial`
- `failed`
- `blocked`

除非验证通过，不要使用 `success`。

## 结果 JSON

`ai/project/result.json` 是权威的机器可读结果。
它必须包含范围、读取的文件、读取的引用、变更文件、命令、验证、假设、问题、
下一步和运行时更新建议。

## 结果 Markdown

`ai/project/result.md` 是给人看的摘要。保持简短，并默认使用 `ai/template/LANG`
指定的安装语言。中文模板下，标题和说明默认用中文；代码、命令、文件路径和协议字段
保留原文。

```md
## 状态
success | partial | failed | blocked

## 变更
- file

## 验证
- level
- evidence

## 问题
- issue if any

## 下一步
- next step
```

## 指标

`ai/project/metrics.json` 记录模型档位、升级触发条件、强模型角色、token 估算、
耗时、成功状态、是否需要人工修复，以及复用潜力。
