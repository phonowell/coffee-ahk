# CLAUDE.md

> **元原则**：中文文档 · 300行限制 · **🔴 节省时间与Tokens（不牺牲代码质量）** · 代码优先于文档 · **人工要求的信息不可轻易移除**

> **🔴 强制要求**：**完成任务后必须将对话中发现的重要信息更新到本文件**

## 项目概述

**coffee-ahk**: CoffeeScript → AutoHotkey v1 转译器。支持类、模块、箭头函数、解构等现代语法。

## 常用命令

```bash
pnpm build                 # 构建（测试前必须）
pnpm build && pnpm test    # 运行全部测试
pnpm test -- <name>        # 单测试，如 pnpm test -- array
pnpm test -- overwrite     # 更新 fixture
pnpm lint && pnpm watch    # 代码检查 / 监听 script/**/*.coffee
```

**调试转译**（先 `pnpm build`）:

```bash
node -e "require('./dist/index.js').default('/tmp/test.coffee', { salt: 'test' }).then(console.log)"
# ❌ 错误: node_modules/.bin/coffee (CoffeeScript CLI) | .transpile (应 .default) | 代码字符串 (需文件路径)
```

## 架构

### 转译流水线

```
CoffeeScript → tokens → Formatters(token→Item) → Processors(结构重写) → Renderer(Item→AHK)
```

**入口**: `src/index.ts::transpile(filePath, options)`

### 三层处理

| 层         | 位置              | 签名               | 说明                       |
| ---------- | ----------------- | ------------------ | -------------------------- |
| Formatters | `src/formatters/` | `(ctx) => boolean` | token→Item，返回`true`消费 |
| Processors | `src/processors/` | `(ctx) => void`    | 批量改写，**顺序敏感**     |
| Renderer   | `src/renderer/`   | -                  | Item→AHK，`mapMethod`映射  |

**Processor 顺序**: newLine(#1) → for(#2) → array(#3) → object(#4) → logicalOr(#5) → **ifExpression(#6)** → chainedCompare(#7) → typeof(#8) → instanceof(#9) → variable(#10) → builtIn(#11) → class(#12) → function(#13)

### 核心数据结构

| 结构    | 说明                                                                                       |
| ------- | ------------------------------------------------------------------------------------------ |
| Context | `{token, type, value, content, scope, cache, options}`                                     |
| Item    | 不可变 `{type, value, scope, comment?}` — **必须用 `clone()` 复制**                        |
| Content | Item 集合：`push(...items)` / `unshift(...items)` 支持多参数，`at(i)`，`pop()` / `shift()` |
| Scope   | 缩进栈：`toArray()` 浅拷贝，`includes(value)`，`pop()` / `shift()` 返回 `undefined`        |

**Item 类型系统** (v0.0.77+):

- `ItemOptions` 使用 distributive union 严格约束 type-value 对应关系
- `{ type: 'if', value: 'xxx' }` → 类型错误；`{ type: 'if', value: 'if' }` → 正确
- 动态值需类型断言：`value as ItemTypeMap['math']`

### 内置函数

`script/segment/*.coffee` → 构建 → `src/processors/builtins.gen.ts`

- `changeIndex.coffee` — 索引转换（0→1-based、负索引）
- `typeof.coffee` — 类型检测

**索引策略**: 非负整数直接 +1（`arr[0]`→`arr[1]`）；负索引/变量用 `ℓci` 函数；字符串键不转换

**内部变量** (`src/constants.ts`): `ℓ` (U+2113) 前缀避免冲突

- `λ` 闭包上下文 | `ℓci` 索引 | `ℓtype` typeof | `ℓarray`/`ℓobject` 解构 | `ℓthis` this替换 | `ℓi`/`ℓk` for循环

**禁止直接写 .ahk**，必须写 .coffee。

### 模块系统

**流程** (`src/file/include/`): import → export 解析 → 拓扑排序 → 组装

| 文件                            | 功能                               |
| ------------------------------- | ---------------------------------- |
| `cache.ts`                      | 缓存、循环依赖检测、Kahn           |
| `source-resolver.ts`            | 路径解析                           |
| `transformer/transform.ts`      | 文件转换协调器（149行，已模块化）  |
| `transformer/parse-exports.ts`  | export 解析（92行）                |
| `transformer/detect-class.ts`   | class 检测和校验（25行）           |
| `transformer/wrap-closure.ts`   | 闭包包装和 return 语句生成（83行） |
| `transformer/replace-anchor.ts` | import → 变量赋值                  |

**支持的导入语法**:

```coffee
# 1. 副作用导入（不提取值，仅执行）
import './module'

# 2. default 导入
import math from './module'

# 3. named 导入
import { plus, minus } from './module'

# 4. 混合导入（default + named）
import m, { plus, minus } from './module'
```

**不支持**: `import * as m from './x'` | `import { foo as bar }` （别名导入）

**支持的导出语法**:

```coffee
# 1. export default 单行表达式
export default (a, b) -> a + b

# 2. export default 多行缩进块
export default ->
  result = calculate()
  result * 2

# 3. export default 对象
export default { plus, minus }

# 4. export 命名导出
export { plus, minus }

# 5. export 命名导出（键值对）
export { foo: bar() }

# 6. 同时使用 default + named
export default { plus, minus }
export { plus, minus }
```

**不支持**: `export const foo = 1` | `export * from './x'` | `export function fn() {}`

**注意**: 遍历行时，`for...of` 循环可以用 `!line` 跳过空字符串；但判断数组结束必须用 `line === undefined`

## 代码规范

```typescript
// ✅ array.at(i) + 空值检查 | 模板字符串 | x?.is("a") === true
// ❌ array[i] as Item | a + b 拼字符串 | x?.is("a") || x?.is("b")
```

TypeScript 严格模式: `noImplicitAny`, `noUncheckedIndexedAccess`

## 关键约束

| 约束      | 说明                                          |
| --------- | --------------------------------------------- | --- | ------------------------------------------------- |
| 大小写    | AHK 不敏感；类名用全角 (`Animal` → `Ａnimal`) |
| 行长      | 最大 2000 字符，`splitAtCommas()` 自动换行    |
| 编码      | UTF-8 with BOM                                |
| 禁止语法  | `?.` `??` `                                   |     | =` `&&=` `//` `%%` `in` `delete`—`forbidden.yaml` |
| 测试 salt | 必须固定 `salt: 'ahk'`                        |
| 数组/对象 | AHK v1 无法区分，`[a,b]` 等同于 `{1:a, 2:b}`  |

**禁用字策略** (v0.0.92+):

- **完全禁止**: 赋值、函数参数、catch 变量、for 循环变量、数组解构目标、类名
  - 禁用范围：AHK 内置函数/变量（`data/forbidden.yaml`）+ `A_` 前缀
  - 示例：`InStr = fn` ❌ | `fn = (A_Index) -> ...` ❌ | `[StrLen, x] = arr` ❌
- **仅禁止 A\_ 前缀**: 对象键名、类属性/方法、对象解构键名
  - 示例：`{A_Index: 5}` ❌ | `{InStr: 1}` ✅
- **完全允许**: 读取使用、函数调用
  - 示例：`x = A_Index` ✅ | `len = InStr("a", "b")` ✅

**实现位置**:

- `src/processors/index.ts:21` — 早期验证（在解构转换前）
- `src/processors/class/validate.ts` — 类名检查
- `src/processors/variable/validate.ts` — 变量/参数/catch/for/对象键检查
- `src/processors/array/deconstruct.ts` — 数组解构目标检查

**索引限制**: `ℓci` 假设数组用数字索引、对象用字符串索引。`obj[0]` 会被转换为 `obj[1]`（可能错误）— 用 `obj["0"]` 访问字符串键。

## 常见陷阱

| 错误                        | 解决                                                  |
| --------------------------- | ----------------------------------------------------- |
| Formatter 未返回 `true`     | 消费后返回 `true`                                     |
| 直接改 `toArray()` 返回值   | 用 `.reload()` / `.push()`                            |
| Processor 顺序错            | 按序号插入                                            |
| 测试前未 build              | `pnpm build && pnpm test`                             |
| `new Item()` 不用 `clone()` | 用 `clone()`                                          |
| `!line` vs `=== undefined`  | `for...of` 用 `!line`；判断数组结束用 `=== undefined` |
| post-if (`y if x`)          | 用 `if x then y`                                      |

## 新功能开发

| 场景          | 层                    | 示例             |
| ------------- | --------------------- | ---------------- |
| 单 token 语法 | Formatter             | `?.` → forbidden |
| 多行结构重写  | Processor             | 数组解构         |
| 需回溯        | Formatter + Processor | 隐式返回         |

**添加 Formatter**: `src/formatters/<name>.ts` → 注册 `formattersMap` → 测试
**添加 Processor**: 按顺序插入（依赖 newLine 放 #1 后，结构重写放 builtIn 前）

## 注释系统

`comments: true` 启用。流程: Formatter 读 token comments → 附加到 `Item.comment[]` → Renderer 渲染

## 闭包实现

**问题**: AHK v1 `.Bind()` 是值拷贝，内层函数无法修改外层变量

**方案**: `λ` 对象模式 — 变量存入 `λ` 对象，内层通过 `.Bind(λ)` 接收引用

```coffee
# 输入                    # 输出
fn = (a) ->               ahk_2(a) {
  b = 1                     λ:={a: a}
  inner = -> a + b          λ.b := 1
  inner()                   λ.inner := Func("ahk_1").Bind(λ)
                            λ.inner.Call()
                          }
                          ahk_1(λ) {
                            return λ.a + λ.b
                          }
```

**跳过 ctx**: 全局变量 | `this` | `ℓxxx` | 首字母大写 | 非函数作用域 | `salt='salt'` 编译段落

**ctx-transform/** 目录结构（已稳定）:

| 文件                     | 行数 | 功能                                                     |
| ------------------------ | ---- | -------------------------------------------------------- |
| `index.ts`               | 23   | 主入口                                                   |
| `utils.ts`               | 89   | `shouldUseCtx`, `isUserFunc`, `AHK_KEYWORDS`             |
| `native.ts`              | 169  | Native 变量中转（`λ_var` 桥接）+ 合并收集转换（1次遍历） |
| `params.ts`              | 83   | `collectParams`, `genParamAssign`, `genThisAlias`        |
| `transform-functions.ts` | 102  | 函数定义加 `λ` 参数、参数赋值                            |
| `transform-vars.ts`      | 131  | `identifier` → `λ.identifier`、合并变量收集（2→1次遍历） |
| `bind.ts`                | 62   | `Func()` → `.Bind(λ)` / `.Bind({})`                      |

## Class 与 Export

**问题**: AHK v1 class 必须顶层定义，export 模块被 `do ->` 包裹导致冲突

**方案**: 分离文件 — class 文件不用 export，主文件用副作用导入 `import './animal'`

## AHK v1 兼容修复

| 问题                  | 方案                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------ |
| `||` 默认值语法       | AHK v1 的 `\|\|` 返回布尔值（0/1），非首个真值。`logical-or.ts` 自动转换 `a = b \|\| 2` → `a := b ? b : 2`（仅非布尔字面量） |
| `if-then-else` 表达式 | `if-expression.ts` 自动转换 `a = if b then c else d` → `a := b ? c : d`（仅赋值表达式；嵌套 if 暂不支持） |
| `this` 作参数名       | 用 `ℓthis`，函数体加 `this := ℓthis`                                                 |
| 对象键名表达式   | `shouldUseCtx` 跳过 object scope 后跟 `:` 的                                         |
| catch 变量       | `collectCatchVars` 在 catch scope 跳过 ctx                                           |
| `do => @a` this  | `arrow.ts` 标记，`do.ts` 在 `.Call()` 传 `this`                                      |
| callback 参数    | 所有 `Func()` 自动加 `.Bind({})` 或 `.Bind(λ)`                                       |
| 类方法绑定       | `.Bind({}, this)` 同时绑定 `λ` 和 `ℓthis`，避免参数错位                              |
| 类方法 ctx 转换  | 类方法（有 `ℓthis` 参数）跳过 `λ.xxx` 变量转换和参数赋值                             |
| `if var is Type` | AHK v1 特殊语法，**必须换行写大括号**，不支持 `if(var is Type)`                      |
| 控制结构括号     | if/else/for/while/switch/case/try/catch/function/class **必须始终写 `{}`**，禁止省略 |
| Native 变量引用  | 函数内 Native 自动用 `λ_var` 临时变量中转，块前取出、块后写回                        |

## 已知限制

| 限制             | 说明                | Workaround                           | 告警 |
| ---------------- | ------------------- | ------------------------------------ | ---- |
| for 循环解构     | `for [a, b] in arr` | `for pair in arr` 后 `[a, b] = pair` | ✅   |
| 嵌套解构         | `[a, [b, c]] = x`   | 手动展开                             | ✅   |
| `>>>` 无符号右移 | AHK 不支持          | 用 `>>`                              | ✅   |
| `await`/`yield`  | AHK 无异步/生成器   | 同步代码                             | ✅   |

## 测试策略

测试用例需覆盖两个维度：

1. **顶层 vs 函数内部** — 顶层代码不涉及 ctx 转换，函数内部需要 `λ.xxx`
2. **简单 vs 闭包** — 内层函数修改外层变量是 ctx 转换的核心场景

**变量命名**: 函数内测试用例应避免与顶层全局变量同名（CoffeeScript 无 `let`，同名会引用全局）

## 提交检查

1. `pnpm build && pnpm test` — 全过
2. `pnpm lint` — 0 errors
3. 新功能有测试
4. **重要发现已更新到本文件**
