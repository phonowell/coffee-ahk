---
name: commit-helper
description: 执行 Git 提交流程（检查→暂存→生成 message→提交→提醒推送），use when creating commits, committing changes, or preparing code for push (project)
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# Commit Helper

执行 Git 提交流程，遵循项目规范和检查清单。

## 何时使用

创建 commit / 提交代码 / 准备推送时自动执行检查和规范化流程

**效率优先**：直接使用 Read/Grep/Glob/Bash 工具，避免调用 Task 工具

## 核心原则

利用上下文已有信息节省 tokens · 检查顺序不可颠倒（先 tsc + lint，再 commit） · 禁止破坏性操作（⛔ push/stash drop）

## 工作流程

### 1. 代码质量分析

调用 `code-refactor` skill 检查：文件行数（≤200） / 函数复杂度 / 项目规范 → 输出问题列表和建议

### 2. 提交前检查

执行：`pnpm exec tsc && pnpm lint`

检查：类型错误 / Lint 错误 / 敏感文件（`.env` `credentials.json`）

失败处理：
- 类型错误：列出错误位置，停止流程
- Lint 错误：尝试 `pnpm lint:fix`，仍失败则停止
- 敏感文件：警告并禁止继续

### 3. 分析变更

执行：`git status && git diff --cached && git diff`

分析：未跟踪文件 / 已暂存 / 未暂存变更

输出：变更摘要（文件、类型）+ 需暂存列表（排除敏感文件）

### 4. 暂存文件

执行：`git add <file1> <file2> ...`

原则：仅 add 相关文件（不用 `git add .`） · 排除 `.env` `*.log` `node_modules` 临时文件 · 再次 `git status` 确认

### 5. 生成 Commit Message

格式：`type: description` · Type: `feat` `fix` `docs` `refactor` `update` · 描述：英文小写开头无句号≤80字符

逻辑：新增 → `feat: add <component> for <purpose>` · bug → `fix: resolve <issue> in <location>` · 更新 → `feat: enhance <feature>` · 重构 → `refactor: simplify <component>` · 文档 → `docs: update <topic>`

原则：聚焦"做了什么"非"怎么做" · 多改动聚焦主要目的 · 参考 git log 风格

### 6. 执行提交

展示：`拟提交的 commit message: <generated message>` + 询问确认

执行：`git commit -m "<message>"`（用户确认后）

输出：Commit hash / 文件统计 / 当前分支状态

### 7. 推送提醒

提示：`提交完成！如需推送到远程仓库，请手动执行：git push origin <当前分支名>`

**⛔ 严格约束**：禁止 agent 代理执行 push / 禁止任何自动推送 / 仅由人类手动执行

理由：推送影响远程仓库和团队协作，必须由开发者主动控制

## 发布检查清单

提交前验证（来自 CLAUDE.md）：
- [ ] ActivityID + PortalNode 匹配
- [ ] `pnpm lint` 通过
- [ ] 导入带 `.js` 扩展名
- [ ] 严禁 `eslint-disable` 和调试代码

## 异常处理

| 异常 | 处理 |
|------|------|
| 类型错误未修复 | 停止流程，列出错误文件和位置 |
| Lint 失败 | 尝试 `pnpm lint:fix`，仍失败则停止并报告 |
| 无变更可提交 | 提示 Working tree clean |
| Commit 冲突/钩子失败 | 显示 git 错误，提示检查 pre-commit hooks |

## 注意事项

Message 生成基于完整暂存区 · 禁止跳过 lint（不用 `--no-verify`） · 类型检查用 tsc 非 build · 敏感文件警告绝不提交 · 仅用安全只读/可恢复命令
