---
name: test-creator
description: 为新功能生成规范化测试（覆盖矩阵→生成.coffee→执行→验证），use when adding tests for new formatters/processors (project)
allowed-tools: Read, Grep, Glob, Write, Bash
---

# Test Creator

为 CoffeeScript→AHK 转译器新功能生成规范化测试文件。

## 何时使用

新增 Formatter/Processor 需要测试 / 补充测试覆盖 / 验证边界场景时

**效率优先**：直接使用 Read/Glob/Grep/Write/Bash 工具，避免调用 Task 工具

**协同 skill**：**由 `formatter-creator` / `processor-creator` skill 自动调用**，也可独立使用

## 核心原则

覆盖测试矩阵 · 盐值固定 `salt: 'ahk'` · 参考现有测试 · 验证生成 AHK · 利用上下文节省 tokens

## 测试规范

**矩阵**：顶层/函数内 × 简单/闭包 · **额外**：边界值、嵌套、交互 · **命名**：`script/test/<feature>.coffee` · **盐值**：`salt: 'ahk'`（CLAUDE.md:80）

## 工作流程

### 1. 分析功能

**收集信息**：
- 功能描述（如"处理 typeof 运算符"）
- 支持的语法（如 `typeof x`, `typeof(x)`）
- 预期 AHK 输出
- 特殊约束（如禁用字、闭包变量）

**查找相似测试**：
```bash
# Grep 查找相关测试
grep -l "<keyword>" script/test/*.coffee
```

### 2. 生成测试文件

**位置**：`script/test/<name>.coffee` · **结构**：4 个基础场景 + 边界 + 交互 · **注释**：`# === ... ===` 分隔场景

### 3. 执行测试

`pnpm build && pnpm test -- <name>` → 检查 `script/test/<name>.ahk`（UTF-8 BOM、1-based 索引、花括号）

### 4. 调整和补充

**失败**：转译错误→检查 Formatter/Processor · AHK 语法错误→修复 Renderer · 覆盖不足→补充边界场景 · **使用 `transpile-debugger` skill 快速调试**
**优化**：移除冗余 · 增强可读性 · ≤200 行

### 5. 完成检查清单

- [ ] 覆盖 4 个基础场景（顶层/函数内 × 简单/闭包）
- [ ] 包含边界和交互场景
- [ ] 文件命名清晰（`<feature>.coffee`）
- [ ] 测试文件 ≤200 行
- [ ] `pnpm build && pnpm test -- <name>` 通过
- [ ] 生成的 `.ahk` 语法正确

## 测试示例

**简单**（boolean.coffee）：顶层/函数内 boolean 字面量 · **复杂**（typeof.coffee）：4 场景 + 边界（undefined/null/[]）+ 交互（typeof + 数组）

## 参考现有测试

**常用模式**：array.coffee（数组解构） · typeof.coffee（运算符） · anonymous.coffee（函数） · chained-compare.coffee（表达式转换）
**学习技巧**：Read 相似测试 → 对比 .coffee/.ahk → 参考边界场景

## 常见陷阱

| 陷阱 | 解决 |
|------|------|
| 盐值错误（非 `ahk`） | 固定用 `salt: 'ahk'` |
| 测试覆盖不足 | 必须包含 4 个基础场景 |
| 忘记边界场景 | 补充 null/undefined/空值测试 |
| 测试过长 | 拆分为多个测试文件或简化用例 |
| 禁用字冲突 | 检查 data/forbidden.yaml 避免冲突 |

## 注意事项

测试文件也遵循 ≤200 行限制 · 盐值 `salt: 'ahk'` 非 `test` · 测试是文档（清晰命名和注释） · 参考现有测试学习模式 · 边界场景防止回归 · 利用上下文已有信息节省 tokens
