---
name: debug-coffee-ahk
description: 查询 coffee-ahk 编译架构、bug 定位方法、调试技巧，use when debugging/fixing bugs or need to understand compilation flow
allowed-tools: Read, Grep, Glob
---

# coffee-ahk 架构与调试指南

## 何时使用

- 修复 coffee-ahk 编译器 bug
- 理解编译流程、定位渲染错误、token 缺失
- 需要查询关键文件职责或 Processor 执行顺序

**何时更新本 skill**：
- 添加/删除 Formatter/Processor/Renderer 文件或修改执行顺序
- 关键文件职责变更（如 Content.reload/pick-item.ts 逻辑修改）
- 发现新的常见陷阱或 bug 定位模式
- 调试命令或工具链变更

**效率优先**：Read/Grep/Glob > Task · 优先使用本 skill 提供的路径信息，避免重复探索

## 编译流程（3 阶段）

**entry/index.ts:20-67**：
1. **Formatters** (formatters/index.ts) - CoffeeScript tokens → Item[]
2. **Processors** (processors/index.ts) - AST 结构重写（顺序敏感）
3. **Renderer** (renderer/index.ts) - Item[] → AHK 代码

## Processor 执行顺序

**processors/index.ts:19-40**：
newLine → validate → for/array/object/logicalOr/ifExpression/chainedCompare → typeof/instanceof/variable → builtInLoader/class/**function**

**function 内部顺序** (function/index.ts:13-34)：
mark → class → implicit-return → **anonymous** → count → parameter → do → ctx-transform

## 关键文件职责

| 路径 | 职责 | 关键逻辑 |
|------|------|----------|
| models/Content.ts:52 | reload() 过滤 void | `filter(it => !it.is('void'))` |
| processors/function/anonymous/pick-item.ts:27 | 提取嵌套函数 | 标记原位置为 void |
| processors/function/class/prepend-this.ts:37 | 类方法添加 ℓthis | constructor 特殊处理 |
| processors/function/ctx-transform/params.ts:11-15 | 收集参数+类方法标记 | `classMethods: Set<string>` |
| processors/function/ctx-transform/bind.ts:17 | Bind() 添加 this 参数 | 检测 classMethods 传递 `this` |
| formatters/property.ts:25 | this.prop 处理 | 检查 lastType 插入 `.` |
| renderer/index.ts | renderers 映射 + 单次 `toArray()` 快照 | `RenderContext.list` 共享数组（勿再调 toArray） |
| file/include/cache.ts | `IncludeContext` 每次编译独立实例 | `topoSort()` 是排序唯一来源；`sortModules()`/`getLineMapping()` 共用它保证顺序一致 |

## Bug 定位方法论

### 渲染错误（AHK 输出不符预期）

**定位**：
1. 查看 AST：`{verbose:true, ast:true}` 确认 Processor 后 Item[]
2. 检查 renderer/index.ts `renderers` 是否有对应 type（未命中渲染 `it.value` 原样输出）
3. 检查 renderer/basic.ts, edge.ts, control-flow.ts

### Token 缺失（AST 中缺 token）

**定位**：
1. 查看 CoffeeScript tokens：`{coffeeAst:true}`
2. 检查 formatters/index.ts 是否有对应 formatter
3. 常见：`THIS`/`SUPER`/新语法未处理
4. 编译 warning `tokens produced no output` 会列出未被任何 formatter 消费的 token 类型 —— 结构性占位 token（如 `STRING_START`/`STRING_END`）需显式 `return true` 消费

### 作用域/闭包错误

**定位**：检查 processors/function/ctx-transform/ 的 collectParams/transformVars/addBind，验证 λ 对象传递链

**Class method arrow functions 特殊处理**：
- `collectParams()` 检测 `ℓthis` 参数，记录到 `classMethods` Set
- `addBind()` 为 class method 内部的 `.Bind(λ)` 添加 `this` 参数 → `.Bind(λ, this)`
- 确保嵌套箭头函数能访问正确的 `this`（通过 `ℓthis` 传递）

## 调试技巧

```bash
# 查看完整编译流程
node -e "import('./dist/index.js').then(m=>m.default('file.coffee', {verbose:true, ast:true}))"

# 仅查看 CoffeeScript tokens
node -e "import('./dist/index.js').then(m=>m.default('file.coffee', {coffeeAst:true}))"

# 编译单文件（仅非测试文件）
node dist/index.js file.coffee
```

**测试文件规则**：
- 测试框架：vitest，测试代码在 `tests/`（e2e fixture / models / errors / reachability），直接 import `src/` 不依赖 dist
- ⚠️ **禁止**手动编译或修改 `script/test/*.ahk`
- **必须**使用 `pnpm test overwrite` 自动生成（内部置 `UPDATE_FIXTURES=1`）
- 新增测试：创建 `.coffee` → 运行 `pnpm test overwrite -- <name>`

## 常见陷阱

| 问题 | 原因 | 解决 |
|------|------|------|
| Formatter 未消费 token | 忘记 return true（现编译时 warning 列出） | 添加 return |
| this 被过滤 | formatters 缺少处理 | 添加 formatter |
| void 未过滤 | Content.reload() 依赖 | 调用 reload() |
| 嵌套函数 scope 错误 | pick-item.ts scope 调整 | 验证 scope.shift() |
| Class method arrow 缺少 this | addBind() 未检测 classMethods | 更新 params.ts + bind.ts |
| Item 跨位置复用串改 | Item 字段就地可变是设计 | 复用前必须 `clone()` |
| salt 魔法值 | builtin 段用 `BUILTIN_SALT='salt'` 编译跳过 ctx-transform | 见 constants.ts，勿在业务 salt 用该值 |
| `for k of obj` 单变量语义 | CoffeeScript `of` 遍历 key，需生成 `k, ℓval of`（占位符在 value 位） | for.ts 对 forof 用 `list.push(VAL_FOR)`，勿用 unshift |
| instanceof 比较恒 false | `__Class` 存全角类名，比较字符串必须同样全角 | 用 `utils/full-width.ts` 的 `toFullWidth()`，勿手写 ASCII 名 |
| 内置函数名泄漏 | gen 文件内函数名是字面 `salt_1` | build-in-loader 统一替换 `{salt}_ci`/`{salt}_typeof`，新增内置需同样处理 |
| 字符串转义损坏 | 顺序 `replace` 会吃掉 `\\n` 等已转义序列 | string.ts 逐字符处理；单引号字面量仅 `\\`/`\'` 是转义 |
| catch 变量闭包 | `catch e` 绑定的是裸局部变量，嵌套函数引用 `λ.e` | transform-vars 在 catch block-start 处桥接 `λ.e := e` |

## 工作流程

1. **确认问题类型**：渲染错误/token缺失/作用域错误（参考上方方法论）
2. **使用调试命令**：根据问题类型选择对应的 verbose/ast/coffeeAst 输出
3. **定位具体文件**：根据关键文件职责表直接定位，避免全目录探索
4. **验证修复**：运行 `pnpm test` 或 `pnpm test overwrite -- <name>`
5. **返回信息**：`✓ Bug 已定位于 {文件}:{行号}` 或 `✓ 修复完成并通过测试`
