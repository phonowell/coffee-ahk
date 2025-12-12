---
name: processor-creator
description: 创建新 Processor 的顺序敏感流程（文件创建→依赖分析→按序注册→测试），use when adding new processors or AST transformations (project)
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Processor Creator

为 CoffeeScript→AHK 转译器创建新 Processor 的自动化流程，处理**顺序敏感**的注册。

## 何时使用

新增 Processor / 添加 AST 转换 / 扩展语法重写时

**效率优先**：直接使用 Read/Glob/Grep/Edit/Write/Bash 工具，避免调用 Task 工具

**前置建议**：复杂 Processor 先用 `task-confirm` skill 确认转换逻辑和依赖关系 · 使用 `transpile-debugger` skill 调试转译输出

## 核心原则

顺序敏感（见 processors/index.ts）· 理解依赖关系 · ≤200 行 · 测试覆盖完整 · 利用上下文节省 tokens

## Processor 规范

```ts
const myProcessor = (context: Context): void => {
  const { content } = context

  // Traverse and transform items
  for (let i = 0; i < content.length(); i++) {
    const item = content.at(i)
    // Transform logic
    content.reload() // Or content.push() for mutations
  }
}
export default myProcessor
```

**关键约束**：不返回值（void） · Item 不可变用 `clone()` · 用 `.reload()` / `.push()` 更新 · ≤200 行

## Processor 执行顺序

**当前顺序**（src/processors/index.ts:19-37）：

```
1. newLineProcessor      # 必须首位
2. validate              # 必须在解构前
3. forProcessor
4. arrayProcessor
5. objectProcessor
6. logicalOrProcessor    # || → ternary
7. ifExpressionProcessor # if-then-else → ternary
8. chainedCompareProcessor # 1<y<10 → 1<y && y<10
9. typeofProcessor       # 必须在 variable 前
10. instanceofProcessor
11. variableProcessor    # typeof 之后
12. builtInLoaderProcessor
13. classProcessor
14. functionProcessor    # 必须最后
```

**依赖关系示例**：
- `typeof` 必须在 `variable` 前（避免 typeof 标识符被误处理）
- `validate` 必须在解构转换前（验证禁用字）
- `function` 必须最后（处理闭包上下文需要所有变量已处理）

## 工作流程

### 1. 需求分析

**收集信息**：
- Processor 名称和功能
- 转换的 Item 类型
- 依赖关系（在哪些 processor 之前/之后）
- 作用范围（全局 / 特定 scope）

**分析依赖**：
- Read `src/processors/index.ts` 理解当前顺序
- Grep `src/processors/` 查找相似 processor
- 确定插入位置（基于依赖关系）

### 2. 创建文件

**位置**：`src/processors/<name>.ts` 或 `src/processors/<name>/index.ts`（复杂逻辑）

**验证行数**：`wc -l` ≤ 200（超出则拆分子模块）

### 3. 注册 Processor（顺序敏感）

**编辑** `src/processors/index.ts`：

1. 添加导入（按字母顺序）：
   ```ts
   import myProcessor from './my-processor.js'
   ```

2. **按依赖关系插入**到 `processAst` 函数（非字母顺序）：
   ```ts
   const processAst = (context: Context) => {
     newLineProcessor(context) // 必须首位
     validate(context)

     // 分析依赖后插入正确位置
     myProcessor(context) // 例如：在 typeof 和 variable 之间

     variableProcessor(context)
     functionProcessor(context) // 必须最后
   }
   ```

3. 添加注释说明插入原因（如 `// convert || to ternary for default values`）

**验证**：Read `src/processors/index.ts` 确认顺序正确且有注释

### 4. 添加测试

**使用 `test-creator` skill** 生成规范化测试文件（覆盖 顶层/函数内 × 简单/闭包 + 边界场景）

**额外边界测试**：空输入 · 嵌套结构 · 与其他 processor 的交互（如 `typeof` + `variable`）

### 5. 验证流程

`pnpm build && pnpm test -- <name>` → 检查 `.ahk` 生成 → 验证顺序影响 → `pnpm lint` → **使用 `transpile-debugger` skill 调试问题**

**顺序验证**：临时调整 processor 顺序 → 确认测试失败（证明顺序重要）→ 恢复正确顺序

### 6. 完成检查清单

- [ ] Processor 文件 ≤200 行
- [ ] 已按**依赖关系**插入到 `processAst`（非字母顺序）
- [ ] 添加注释说明插入原因
- [ ] 已使用 `test-creator` skill 生成测试
- [ ] `pnpm build && pnpm test` 通过
- [ ] `pnpm lint` 通过
- [ ] 验证顺序敏感性（调整顺序测试失败）

## 依赖分析指南

| 场景 | 插入位置 |
|------|---------|
| 处理特定 token 类型 | 在 `variable` 前（避免标识符被误处理） |
| 转换表达式结构 | 在 `logical-or` / `if-expression` 附近 |
| 处理作用域/变量 | 在 `variable` 和 `function` 之间 |
| 生成内置函数 | 在 `function` 前（如 `builtInLoader`） |
| 不确定 | 在 `validate` 和 `variable` 之间（较安全区域） |

## 常见陷阱

| 陷阱 | 解决 |
|------|------|
| 按字母顺序插入 | 必须按**依赖关系**插入（CLAUDE.md:30 强调） |
| 直接改 `toArray()` 返回值 | 用 `.reload()` / `.push()` 更新 |
| 未测试顺序敏感性 | 调整顺序验证测试失败 |
| 未添加注释说明 | 说明插入原因和依赖 |
| `!line` vs `=== undefined` | 跳空行用 `!line`，判结束用 `=== undefined` |

## 参考案例

**简单**（typeof.ts）：单一转换，在 variable 前 · **复杂**（function/ctx-transform）：多文件拆分，必须最后

## 注意事项

顺序错误导致难以调试的转译错误 · 复杂 processor 拆分子模块 · 遵循项目代码约束（`array.at(i)`、模板字符串、`?.is()` 模式） · 必要时更新 CLAUDE.md 的"开发与集成"章节
