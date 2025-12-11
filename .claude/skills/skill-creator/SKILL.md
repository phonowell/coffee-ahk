---
name: skill-creator
description: Create new Claude Code Skills with proper structure and best practices, ensuring SKILL.md stays under 200 lines and description is one sentence.
---

# Skill Creator

帮助创建符合规范的 Claude Code Agent Skills。

## 何时使用

- 用户说"创建一个 skill"、"生成 skill"、"新建 skill"
- 用户想将某些知识或工作流沉淀为可复用的 skill
- 用户需要将文档转换为 skill 格式

## 核心约束

**必须遵守**：
1. **SKILL.md 长度**：不超过 200 行
2. **Description 格式**：必须是一句话（单个句子）
3. **Name 规范**：小写字母、数字、连字符，最多 64 字符
4. **Description 长度**：最多 256 字符
5. **内容原则**：仅包含 Claude 不知道的知识（项目特定约定、业务逻辑、自定义工具流程等），不写 Claude 已知的通用知识

## 创建流程

### 1. 收集信息

向用户询问（如果尚未提供）：

- **Skill 名称**：符合命名规范
- **简短描述**：一句话说明功能 + 使用时机
- **目标位置**：`.claude/skills/`（项目）或 `~/.claude/skills/`（个人）
- **核心功能**：要解决什么问题
- **触发场景**：什么时候需要

### 2. 选择结构

**简单 Skill（推荐）**：单文件 `SKILL.md`

**复杂 Skill（仅在必要时）**：`SKILL.md` + 辅助文件（reference.md/examples.md/templates/）

### 3. 编写 SKILL.md

**模板结构**（保持在 200 行内，仅写 Claude 不知道的知识）：

- Frontmatter: name + description
- 何时使用：触发场景
- 核心功能：项目特定逻辑/约定
- 使用步骤：自定义工作流
- 示例：项目实际案例
- 注意事项：项目特殊规则

### 4. Description 写作规范

**结构**：`功能说明 + 使用时机 + 可选触发词`（必须一句话，不能用句号分隔多句）

**示例**：
- `Refactor React components following project conventions, use when splitting large files or enforcing code style rules.`
- `Automate commit message generation from git diffs, use when creating commits or reviewing staged changes.`

### 5. 可选：工具权限

限制工具使用（如只读）：

```yaml
allowed-tools: Read, Grep, Glob
```

常见组合：
- **只读**：`Read, Grep, Glob`
- **文档生成**：`Read, Glob, Write`
- **代码重构**：`Read, Grep, Glob, Edit`

### 6. 创建和验证

1. 使用 `Write` 创建文件
2. 检查行数：`wc -l <path>/SKILL.md`（必须 ≤200）
3. 验证清单：
   - [ ] Frontmatter 完整
   - [ ] name 符合规范
   - [ ] description 是一句话
   - [ ] 内容仅包含项目特定知识，无通用知识

## 长度控制技巧

超过 200 行时：移动详细内容到 reference.md，示例到 examples.md，保留核心步骤在 SKILL.md

## 测试流程

1. 重启 Claude Code
2. 提出匹配问题（包含 description 关键词）
3. 观察是否自动激活
4. 未激活则检查：description 具体性、文件路径、格式正确性

## 核心原则

- 一个 skill 解决一个项目特定问题
- Description 必须一句话
- SKILL.md ≤200 行
- 仅包含 Claude 不知道的知识（项目约定、业务规则、自定义流程）
- 不写通用知识（Claude 已知的编程概念、语法、常识）
