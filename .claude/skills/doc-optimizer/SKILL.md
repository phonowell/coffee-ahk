---
name: doc-optimizer
description: Enforce line limits (CLAUDE.md ≤100, others ≤200) and remove low-ROI content from .md files, use when optimizing or refactoring docs (project)
allowed-tools: Read, Glob, Edit, Bash
---

# Doc Optimizer

优化 Markdown 文档，严格控制长度和信息密度。

## 何时使用

"优化/重构/精简文档" · 文档超限 · 移除低价值内容

**效率优先**：直接使用 Read/Glob/Edit/Bash 工具，避免调用 Task 工具

**注意**：优化 `.claude/skills/*/SKILL.md` 时应优先使用 `skill-creator` skill

## 核心约束

1. 只处理 `.md` 文件
2. **CLAUDE.md ≤100 行** · 其他 ≤200 行
3. 不添加通用知识（编程概念、语法、常识）
4. 不添加低 ROI 信息（过度解释、冗余、显而易见）
5. 代码符合项目风格（ESLint/Prettier）
6. **渐进披露原则**：高频关键信息前置（何时使用、效率优先、核心原则）→ 详细内容后置（工作流程、示例、命令）
7. **利用上下文**：优先使用上下文已有信息，节省 tokens

## 优化原则

**保留**：项目特定规则 · 非显而易见细节 · 关键配置 · 代码示例（带行号） · 检查清单

**移除**：通用知识 · 过度解释 · 重复内容 · 显而易见信息 · 冗长背景

## 压缩技巧

**合并**：`## 命名规范\n组件使用大驼峰。\n## 扩展名\n必须 .tsx` → `组件用大驼峰 + .tsx`

**列表代替段落**：多个独立陈述用 `-`，不用完整句子

**代码引用**：`ID 在 package.json 第 2 行` → `[package.json:2](package.json#L2)`

**元原则**：1 行多原则用 `·` 分隔

## 执行流程

### 1. 分析

`wc -l file.md` 检查行数 · 用 Read 评估超限/通用知识/低 ROI/冗余

### 2. 优化

**优先级**：通用知识 > 过度解释 > 冗余 > 示例压缩 > 格式

**CLAUDE.md**：极致压缩 · 代码引用 · 合并配置 · 移除解释

用 Edit 工具修改内容（不调用 Task）

### 3. 验证

`wc -l file.md` · 检查通用知识/低 ROI/关键信息完整/代码引用正确

## 标准结构（渐进披露）

**所有 .md 文件**：Frontmatter → 标题 → 何时使用 → 效率优先 → 核心原则/约束 → 工作流程 → 详细内容（示例/命令/注意事项）

**CLAUDE.md 特殊策略**：≤100 行 · 元原则顶部（1行多原则） · 代码引用代替解释 · 合并配置 · AI 高效结构 · 示例：`8行配置说明 → 2行代码引用列表`

## 成功标准

行数达标 · 信息密度高 · 无通用知识 · 关键信息完整 · 代码引用准确
