---
name: formatter-creator
description: 创建新 Formatter 的规范化流程（文件创建→注册→测试→验证），use when adding new formatters or token handlers (project)
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Formatter Creator

为 CoffeeScript→AHK 转译器创建新 Formatter 的自动化流程。

## 何时使用

新增 Formatter / 添加 token 处理器 / 扩展语法支持时

**效率优先**：直接使用 Read/Glob/Grep/Edit/Write/Bash 工具，避免调用 Task 工具

**前置建议**：复杂 Formatter 先用 `task-confirm` skill 确认行为和范围 · 使用 `transpile-debugger` skill 调试转译输出

## 核心原则

遵循 200 行限制 · 必须返回 `true` 消费 token · 注册到 formattersMap · 测试覆盖完整 · 利用上下文节省 tokens

## Formatter 规范

```ts
const myFormatter = (ctx: Context): boolean => {
  const { token, content } = ctx
  if (!shouldHandle(token)) return false
  content.push(/* transformed items */)
  return true // CRITICAL: 必须返回 true 消费 token
}
export default myFormatter
```

**关键约束**：必须返回 `true` · Item 必须 `clone()` 修改 · `content.push(item1, item2, ...)` 多参数 · ≤200 行

## 工作流程

### 1. 需求分析

**收集信息**：
- Formatter 名称（如 `typeof`, `instanceof`）
- 处理的 token 类型（参考 `src/types/coffeescript.ts`）
- 转换逻辑（Coffee → AHK）
- 作用范围（全局 / 函数内）

**检查现有实现**：
- Grep `src/formatters/` 查找相似 formatter
- Read 参考实现模式（如 `src/formatters/boolean.ts`, `src/formatters/operator.ts`）

### 2. 创建文件

**位置**：`src/formatters/<name>.ts` · **验证行数**：`wc -l` ≤ 200

### 3. 注册 Formatter

**编辑** `src/formatters/index.ts`：

1. 添加导入（按字母顺序）：
   ```ts
   import <name>Formatter from './<name>.js'
   ```

2. 注册到 `formattersMap`（按字母顺序）：
   ```ts
   const formattersMap = {
     // ...
     <name>: <name>Formatter,
     // ...
   } as const satisfies Record<string, Formatter>
   ```

**验证**：Read `src/formatters/index.ts` 确认注册成功且顺序正确

### 4. 添加测试

**使用 `test-creator` skill** 生成规范化测试文件（覆盖 顶层/函数内 × 简单/闭包）

### 5. 验证流程

`pnpm build && pnpm test -- <name>` → 检查 `.ahk` 生成正确 → `pnpm lint` → **使用 `transpile-debugger` skill 调试问题**

### 6. 完成检查清单

- [ ] Formatter 文件 ≤200 行
- [ ] 返回 `true` 消费 token
- [ ] 已注册到 `formattersMap`（按字母顺序）
- [ ] 已使用 `test-creator` skill 生成测试
- [ ] `pnpm build && pnpm test` 通过
- [ ] `pnpm lint` 通过

## 参考案例

**简单**（boolean.ts）：单一 token 直接映射 · **复杂**（operator.ts）：多 token + 映射转换

## 常见陷阱

| 陷阱 | 解决 |
|------|------|
| 忘记返回 `true` | 消费 token 后必须返回 |
| 直接修改 Item | 用 `.clone()` 后修改 |
| 注册顺序错误 | 按字母顺序添加到 formattersMap |
| 超过 200 行 | 拆分逻辑到子函数或独立文件 |

## 注意事项

遵循项目代码约束（`array.at(i)` 非 `array[i]`、模板字符串非拼接、`x?.is("a") === true` 非 `||` 链） · Formatter 顺序不影响（由 formattersMap 遍历决定） · Comment formatter 特殊处理（index.ts:69 跳过后最后执行）
