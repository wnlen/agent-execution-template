# 命令

命令按类别授权。
AI 只能运行 `ai/project/task.md` 和本文件允许的命令。

## 安全验证命令

```bash
# 在这里添加项目专属的安全命令
# 示例：
# npm run lint
# npm run build
# mvn test
```

## 本地运行命令

```bash
# 在这里添加本地启动命令
# 示例：
# npm run dev
# mvn spring-boot:run
```

## 危险命令

这些命令需要任务级明确授权：

```bash
# 数据库迁移
# 部署
# 分支重置
# 文件删除
```

## 未明确允许则禁止

```bash
# 生产部署
# 生产数据迁移
# 破坏性清理
# 会暴露密钥的命令
```
