# Agent Skills 速查

## 文件结构

```
skill-name/
├── SKILL.md (必需，≤100行)
├── reference.md (可选，≤200行)
├── examples.md (可选，≤200行)
├── scripts/ (可选脚本)
└── templates/ (可选模板)
```

## SKILL.md 格式

```yaml
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
allowed-tools: Read, Grep, Glob  # 可选，限制工具权限
---

# Your Skill Name

## Instructions
Clear, step-by-step guidance.

## Examples
Concrete usage examples.
```

## 字段约束

- **name**: 小写字母+数字+连字符，≤64 字符
- **description**: 功能说明 + 使用时机，≤1024 字符
- **allowed-tools**: 可选，限制可用工具列表

## 存储位置

- **个人 Skills**: `~/.claude/skills/` - 所有项目可用
- **项目 Skills**: `.claude/skills/` - 通过 git 共享
- **插件 Skills**: 随插件安装

## 常用工具组合

```yaml
# 只读
allowed-tools: Read, Grep, Glob

# 文档生成
allowed-tools: Read, Glob, Write

# 代码重构
allowed-tools: Read, Grep, Glob, Edit
```

## Description 写法要点

**具体触发词**：

```yaml
# ✅ 好
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.

# ❌ 差
description: Helps with documents
```

**包含关键术语**：
- 功能关键词（extract, analyze, generate）
- 文件类型（PDF, Excel, .xlsx）
- 使用场景（when working with..., when the user mentions...）

## 多文件示例

**SKILL.md** - 核心说明（≤100行）：
````yaml
---
name: pdf-processing
description: Extract text, fill forms, merge PDFs. Use when working with PDF files, forms, or document extraction.
---

# PDF Processing

## Quick start
Extract text:
```python
import pdfplumber
with pdfplumber.open("doc.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

For form filling, see [FORMS.md](FORMS.md).
For API reference, see [REFERENCE.md](REFERENCE.md).
````

**reference.md** - 详细文档（≤200行）
**examples.md** - 更多示例（≤200行）

## 调试清单

Skill 未激活时检查：

1. **描述是否具体**：包含明确触发词和使用场景
2. **路径是否正确**：`~/.claude/skills/*/SKILL.md` 或 `.claude/skills/*/SKILL.md`
3. **YAML 是否有效**：开头/结尾有 `---`，无制表符
4. **是否重启**：更改后需重启 Claude Code

调试模式查看错误：
```bash
claude --debug
```

## 项目共享（通过 git）

```bash
# 1. 创建项目 skill
mkdir -p .claude/skills/team-skill
# 创建 SKILL.md

# 2. 提交
git add .claude/skills/
git commit -m "Add team skill"
git push

# 3. 团队成员拉取即可用
git pull
```

## 最佳实践

1. **专注单一功能**：一个 skill 解决一个问题
2. **描述包含触发词**：帮助自动发现
3. **用渐进式披露**：核心说明在 SKILL.md，详细内容在 reference.md
4. **限制工具权限**：只读 skill 用 `allowed-tools: Read, Grep, Glob`

## 版本记录（可选）

在 SKILL.md 内容中添加：

```markdown
## Version History
- v2.0.0 (2025-10-01): Breaking changes to API
- v1.1.0 (2025-09-15): Added new features
- v1.0.0 (2025-09-01): Initial release
```
