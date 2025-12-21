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

**entry/index.ts:18-67**：
1. **Formatters** (formatters/index.ts) - CoffeeScript tokens → Item[]
2. **Processors** (processors/index.ts) - AST 结构重写（顺序敏感）
3. **Renderer** (renderer/index.ts) - Item[] → AHK 代码

## Processor 执行顺序

**processors/index.ts:19-37**：
newLine → validate → for/array/object/logicalOr/ifExpression/chainedCompare → typeof/instanceof/variable → builtInLoader/class/**function**

**function 内部顺序** (function/index.ts:13-34)：
mark → class → implicit-return → **anonymous** → count → parameter → do → ctx-transform

## 关键文件职责

| 路径 | 职责 | 关键逻辑 |
|------|------|----------|
| models/Content.ts:52 | reload() 过滤 void | `filter(it => !it.is('void'))` |
| processors/function/anonymous/pick-item.ts:27 | 提取嵌套函数 | 标记原位置为 void |
| processors/function/class/prepend-this.ts:20 | 类方法添加 ℓthis | constructor 特殊处理 |
| processors/function/ctx-transform/params.ts:11-15 | 收集参数+类方法标记 | `classMethods: Set<string>` |
| processors/function/ctx-transform/bind.ts:12-15 | Bind() 添加 this 参数 | 检测 classMethods 传递 `this` |
| formatters/property.ts:42 | this.prop 处理 | 检查 lastType 插入 `.` |
| renderer/index.ts:102 | mapMethod 映射 | type → 渲染函数 |

## Bug 定位方法论

### 渲染错误（AHK 输出不符预期）

**定位**：
1. 查看 AST：`{verbose:true, ast:true}` 确认 Processor 后 Item[]
2. 检查 renderer/index.ts mapMethod 是否有对应 type
3. 检查 renderer/basic.ts, edge.ts, control-flow.ts

### Token 缺失（AST 中缺 token）

**定位**：
1. 查看 CoffeeScript tokens：`{coffeeAst:true}`
2. 检查 formatters/index.ts 是否有对应 formatter
3. 常见：`THIS`/`SUPER`/新语法未处理

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
- ⚠️ **禁止**手动编译或修改 `script/test/*.ahk`
- **必须**使用 `pnpm test overwrite` 自动生成
- 新增测试：创建 `.coffee` → 运行 `pnpm test overwrite -- <name>`

## 常见陷阱

| 问题 | 原因 | 解决 |
|------|------|------|
| Formatter 未消费 token | 忘记 return true | 添加 return |
| this 被过滤 | formatters 缺少处理 | 添加 formatter |
| void 未过滤 | Content.reload() 依赖 | 调用 reload() |
| 嵌套函数 scope 错误 | pick-item.ts scope 调整 | 验证 scope.shift() |
| Class method arrow 缺少 this | addBind() 未检测 classMethods | 更新 params.ts + bind.ts |

## 工作流程

1. **确认问题类型**：渲染错误/token缺失/作用域错误（参考上方方法论）
2. **使用调试命令**：根据问题类型选择对应的 verbose/ast/coffeeAst 输出
3. **定位具体文件**：根据关键文件职责表直接定位，避免全目录探索
4. **验证修复**：运行 `pnpm test` 或 `pnpm test overwrite -- <name>`
5. **返回信息**：`✓ Bug 已定位于 {文件}:{行号}` 或 `✓ 修复完成并通过测试`
