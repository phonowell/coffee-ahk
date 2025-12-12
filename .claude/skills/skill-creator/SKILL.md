---
name: skill-creator
description: 创建或优化 Claude Code Skill 文件，use when creating/updating/refactoring/optimizing skill files (project)
allowed-tools: Read, Glob, Write, Edit, Bash
---

# Skill Creator

创建和优化符合规范的 Claude Code Agent Skills。

## 何时使用

将项目知识或工作流沉淀为可复用 skill（"创建/优化 skill"、将文档转换为 skill）

**效率优先**：直接使用 Read/Glob/Write/Edit/Bash 工具，避免调用 Task 工具

**分工说明**：优化 SKILL.md 的信息密度和内容压缩时，可先使用 `doc-optimizer` skill

## 核心约束

1. **SKILL.md ≤100 行**（skill文件本身）· **辅助文档 ≤200 行** · **Description 一句话、中文、≤256 字符**
2. **Name**：小写字母+数字+连字符，≤64 字符
3. **Description 格式**：`功能说明 + 使用时机（英文触发词）`
4. **内容原则**：仅写项目特定知识（约定/业务逻辑/自定义工具），不写通用知识
5. **利用上下文**：优先使用上下文已有信息，节省 tokens

## 工作流程

### 1. 确认需求

使用 `task-confirm` skill 确认用户意图（创建/优化目标、范围、优先级）

### 2. 收集信息

Name: 小写+连字符 ≤64 字符 · 位置: `.claude/skills/`（项目）或 `~/.claude/skills/`（个人） · Description 草稿: 功能 + 时机

### 3. 选择结构

简单（推荐）: 单文件 `SKILL.md` · 复杂（必要时）: `SKILL.md` + 辅助文件（reference/examples/templates）

### 4. 编写内容

**结构模板**：
```
Frontmatter: name + description
何时使用：触发场景
效率优先：直接工具优于 subagent
核心功能/约束：项目逻辑
工作流程：
  1. 确认需求：使用 task-confirm skill（如需求不明确）
  2. 自定义步骤...
示例：实际案例
```

**Description 写作规则**：
- 格式：`中文功能说明 + 使用时机（英文触发词）`
- 必须一句话，不能用句号分隔
- 示例：
  - ✅ `重构 React 组件遵循项目规范，use when splitting large files or enforcing code style rules (project)`
  - ✅ `从 git diff 自动生成 commit message，use when creating commits or reviewing staged changes`
  - ❌ `功能A。功能B`（不能用句号分隔多个功能）

### 5. 工具权限（可选）

```yaml
allowed-tools: Read, Grep, Glob
```

常见组合：只读 `Read Grep Glob` · 文档生成 `Read Glob Write` · 代码重构 `Read Grep Glob Edit`

### 6. 创建验证

1. 用 Write/Edit 创建文件
2. `wc -l <path>/SKILL.md` 检查（≤100）
3. 验证清单：[ ] Frontmatter 完整 [ ] name 符合规范 [ ] description 一句话 [ ] 内容仅项目特定知识 [ ] 包含 task-confirm 步骤（如适用）

### 7. 长度控制

**SKILL.md 超过 100 行**：
1. 优先使用 `doc-optimizer` skill 压缩内容（应用压缩技巧：合并/列表/代码引用等）
2. 仍超限则拆分：详细内容 → reference.md（≤200行），示例 → examples.md（≤200行），保留核心步骤

### 8. 测试激活

重启 Claude Code → 提问包含 description 关键词 → 观察是否自动激活 → 未激活检查：description 具体性、路径、格式
