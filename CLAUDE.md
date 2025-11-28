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

**Processor 顺序**: newLine(#1) → for(#2) → array(#3) → object(#4) → typeof(#5) → instanceof(#6) → variable(#7) → builtIn(#8) → class(#9) → function(#10)

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

| 文件                            | 功能                     |
| ------------------------------- | ------------------------ |
| `cache.ts`                      | 缓存、循环依赖检测、Kahn |
| `source-resolver.ts`            | 路径解析                 |
| `transformer/transform.ts`      | export 解析、闭包包装    |
| `transformer/replace-anchor.ts` | import → 变量赋值        |

**注意**: 遍历行时用 `line === undefined` 判断结束（空字符串是 falsy）

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
| 行长      | 最大 200 字符，`splitAtCommas()` 自动换行     |
| 编码      | UTF-8 with BOM                                |
| 禁止语法  | `?.` `??` `                                   |     | =` `&&=` `//` `%%` `in` `delete`—`forbidden.yaml` |
| 测试 salt | 必须固定 `salt: 'ahk'`                        |
| 数组/对象 | AHK v1 无法区分，`[a,b]` 等同于 `{1:a, 2:b}`  |

**索引限制**: `ℓci` 假设数组用数字索引、对象用字符串索引。`obj[0]` 会被转换为 `obj[1]`（可能错误）— 用 `obj["0"]` 访问字符串键。

## 常见陷阱

| 错误                        | 解决                       |
| --------------------------- | -------------------------- |
| Formatter 未返回 `true`     | 消费后返回 `true`          |
| 直接改 `toArray()` 返回值   | 用 `.reload()` / `.push()` |
| Processor 顺序错            | 按序号插入                 |
| 测试前未 build              | `pnpm build && pnpm test`  |
| `new Item()` 不用 `clone()` | 用 `clone()`               |
| `!line` 判断空行            | 用 `line === undefined`    |
| post-if (`y if x`)          | 用 `if x then y`           |

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
                          ahk_1(λ := "") {
                            if(!λ){
                              λ:={}
                            }
                            return λ.a + λ.b
                          }
```

**跳过 ctx**: 全局变量 | `this` | `ℓxxx` | 首字母大写 | 非函数作用域 | `salt='salt'` 编译段落

**ctx-transform.ts** (412行，已稳定，非必要勿读):

| 函数 | 功能 |
|------|------|
| `shouldUseCtx` | 判断标识符是否需要转为 `λ.xxx` |
| `collectParams` | 收集用户函数的参数列表 |
| `transformFunctions` | 函数定义加 `λ := ""` 参数、初始化 `if(!λ){λ:={}}` |
| `collectCatchVars/ForVars` | 收集 catch/for 变量（跳过 ctx 转换） |
| `transformVars` | `identifier` → `λ.identifier` |
| `addBind` | `Func("xxx")` → `Func("xxx").Bind(λ)` |

## Class 与 Export

**问题**: AHK v1 class 必须顶层定义，export 模块被 `do ->` 包裹导致冲突

**方案**: 分离文件 — class 文件不用 export，主文件用副作用导入 `import './animal'`

## AHK v1 兼容修复

| 问题            | 方案                                            |
| --------------- | ----------------------------------------------- |
| `this` 作参数名 | 用 `ℓthis`，函数体加 `this := ℓthis`            |
| 对象键名表达式  | `shouldUseCtx` 跳过 object scope 后跟 `:` 的    |
| catch 变量      | `collectCatchVars` 在 catch scope 跳过 ctx      |
| `do => @a` this | `arrow.ts` 标记，`do.ts` 在 `.Call()` 传 `this` |
| `Func.Call()`   | 无用户参数时 `λ := ""`，有参数时 `λ` 必需       |
| 单行 if 异常    | `if(!λ)λ:={}` 改为 `if(!λ){λ:={}}` 多行格式     |
| 可选参数顺序    | AHK 要求可选参数后全为可选，故有参数时 `λ` 必需 |

## 历史修复记录

- **2025-11-24**: Export 解析空行中断 (`!nextLine` → `=== undefined`)、类型注释干扰
- **2025-11-25**: 链式负索引 `nested[0][-1]`、`collectArrayExpression()` 回溯
- **2025-11-26**: Content/Scope API 统一、闭包 λ 实现、class/export 分离方案
- **2025-11-27**: Item 类型系统重构（严格 type-value 约束）、`::` 输出为 `prototype`、Content.push/unshift 多参数优化
- **2025-11-28**: 单行 if 改多行花括号、`λ` 条件可选（无用户参数时 `λ := ""`，有参数时 `λ` 必需）

## 提交检查

1. `pnpm build && pnpm test` — 全过
2. `pnpm lint` — 0 errors
3. 新功能有测试
4. **重要发现已更新到本文件**
