# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **元原则**：中文文档 · 300行限制 · AI友好优先 · 节省Tokens · 并行工具调用 · 代码优先于文档 · **人工要求的信息不可轻易移除**

> **🔴 强制要求**：**完成任务后必须将对话中发现的重要信息（Bug、架构发现、设计决策）更新到本文件相应章节**

## 项目概述

**coffee-ahk**: CoffeeScript → AutoHotkey v1 转译器。支持类、模块、箭头函数、解构等 AHK v1 缺少的现代语法。

## 常用命令

```bash
pnpm build                 # 构建（测试前必须）
pnpm build && pnpm test    # 运行全部测试
pnpm test -- <name>        # 单测试，如 pnpm test -- array
pnpm test -- overwrite     # 更新 fixture
pnpm lint                  # 代码检查
pnpm watch                 # 监听 script/**/*.coffee
```

## 架构

### 转译流水线

```
CoffeeScript → tokens → Formatters(token→Item) → Processors(结构重写) → Renderer(Item→AHK) → 输出
```

**入口**: `src/index.ts::transpile(source, options)`

### 三层处理

**1. Formatters** (`src/formatters/`, 27个): token → Item

- 签名: `(ctx: Context) => boolean` - 返回 `true` 消费token
- 关键: `identifier.ts`, `operator.ts`, `function.ts`, `class.ts`, `forbidden.ts`

**2. Processors** (`src/processors/`, 31个): 批量改写 Item

- 签名: `(ctx: Context) => void | async`
- **严格顺序**: newLine(#1) → for(#2) → array(#3) → object(#4) → typeof(#5) → instanceof(#6) → variable(#7) → builtIn(#8) → class(#9) → function(#10)

**3. Renderer** (`src/renderer/`): Item → AHK 字符串，通过 `mapMethod` 映射

### 核心数据结构

- **Context**: `{token, type, value, content, scope, cache:{classNames, identifiers, global}, options}`
- **Item**: 不可变 `{type, value, scope, comment?}`
  - **必须用 `clone()` 复制**，确保 `comment` 等所有属性被复制
  - ⚠️ 直接 `new Item(type, value, scope)` 会丢失 `comment`
- **Content**: Item 集合，用 `.push()` 或 `.reload()`，禁直接改 `.list`
- **Scope**: 缩进栈 `['global', 'class', 'function']`，需克隆防污染

### 内置函数

`script/segment/*.coffee` 构建时编译 → `src/processors/builtins.gen.ts`:

- `changeIndex.coffee` → 负索引支持
- `typeof.coffee` → 类型检测

**禁止直接写 `.ahk`**，必须写 `.coffee` 让构建编译。

### 模块内联系统

**流程** (`src/file/include/`): import 替换 → export 解析 → 模块组装

**关键文件**:
- `include.ts::main()` - 入口，组装最终 CoffeeScript
- `transformer/transform.ts::parseExportsFromCoffee()` - 解析 export 和函数体

**核心逻辑** (`parseExportsFromCoffee`):
1. 遍历模块每一行
2. 遇到 `export` 开头的行：
   - 记录缩进级别 (`exportLineIndent`)
   - 收集后续所有匹配缩进的行到 `exportBody`（包括空行）
   - **关键**: `while` 循环中必须用 `line === undefined` 而非 `!line` 判断数组结束
3. 非 export 行进入 `codeLines`
4. `codeLines` 经 `closureCoffee` 添加 2 空格缩进后成为模块闭包体

**已知 Bug 和修复** (2025-11-24):
- **问题**: `if (!nextLine) break` 会在遇到空字符串时中断循环（空字符串是 falsy）
- **后果**: export 后有空行时，函数体未被收集到 `exportBody`，留在 `codeLines` 中
- **影响**: 函数体获得双重缩进（原有 2 空格 + 闭包添加 2 空格 = 4 空格），导致 "unexpected indentation" 编译错误
- **修复**: 改为 `if (nextLine === undefined) break`，仅在数组末尾中断
- **附加修复**: 跳过 export 前的 `###* @type ... ###` 类型注释（否则会被添加到 `codeLines` 造成缩进不一致）

## 代码规范

```typescript
// ✅ 正确
const item = array.at(i); // 数组用 at()
if (!item) return; // 空值检查
const s = `${a}${b}`; // 模板字符串拼接
const flag = x?.is("a") === true || x?.is("b") === true; // 布尔链

// ❌ 错误
const item = array[i] as Item; // 禁止 as 断言
const s = a + b; // 禁止 + 拼接字符串
const flag = x?.is("a") || x?.is("b"); // ESLint 警告
```

TypeScript 严格模式: `noImplicitAny`, `noUncheckedIndexedAccess`

## 转译选项

```typescript
{
  (ast, coffeeAst, comments, metadata, salt, save, string, verbose);
}
```

测试必须固定 `salt: 'ahk'`

## 关键约束

- **大小写**: AHK 不敏感；类名用全角 (`Animal` → `Ａnimal`)，与变量冲突报错
- **行长**: 最大 200 字符，`splitAtCommas()` 自动在逗号处换行
- **编码**: 输出 UTF-8 with BOM
- **禁止语法**: `?.`, `??`, `||=`, `&&=`, `//`, `%%`, `in`, `delete` - 见 `data/forbidden.yaml`

## 常见陷阱

| 错误                       | 后果             | 解决                       |
| -------------------------- | ---------------- | -------------------------- |
| Formatter 未返回 `true`    | token 重复处理   | 消费后返回 `true`          |
| 随机 salt                  | 测试不稳定       | 固定 `salt: 'ahk'`         |
| 直接改 `content.list`      | Scope 未更新     | 用 `.reload()` / `.push()` |
| Processor 顺序错           | 转换错误         | 按序号插入正确位置         |
| 测试前未 build             | 测旧代码         | `pnpm build && pnpm test`  |
| segment/ 写 .ahk           | 不一致           | 写 .coffee                 |
| post-if (`y if x`)         | forbidden        | 用 `if x then y`           |
| **Item.clone() 未复制属性**| **注释等数据丢失**| **克隆所有属性包括comment**|
| **空行判断用 `!line`**     | **export解析中断**| **用 `line === undefined`**|

## 新功能开发

| 场景          | 层                    | 示例             |
| ------------- | --------------------- | ---------------- |
| 单 token 语法 | Formatter             | `?.` → forbidden |
| 多行结构重写  | Processor             | 数组解构         |
| 需回溯        | Formatter + Processor | 隐式返回         |

**添加 Formatter**: `src/formatters/<name>.ts` → 注册 `formattersMap` → 添加 `script/test/<name>.coffee`

**添加 Processor**: 按顺序插入（依赖 newLine 放 #1 后，结构重写放 builtIn 前）

## 架构要点

1. Formatter 单向消费：每 token 仅一个 formatter 处理
2. Processor 顺序敏感：newLine → 结构 → 内置 → 定型
3. Item 不可变：用 `clone()`
4. Scope 自动管理：`Content.push` 自动 reload
5. 内置异步加载：builtInLoader 在 function 前

## 注释系统设计

**注释保留**：`comments: true` 选项启用（默认 `false`）

**工作原理**：
1. **Formatter 阶段** (`comment.ts`)：
   - 读取 CoffeeScript token 的 `comments` 属性
   - 比较 comment 行号和 token 行号判断是否 standalone
   - 在 comment 字符串前添加 `STANDALONE:` 或 `INLINE:` 前缀
   - 附加到 `content.last.comment` 数组

2. **Renderer 阶段** (`renderer/index.ts`)：
   - Standalone 注释：在 item 前渲染为独立行，格式 `<indent>; <content>\n`
   - Inline 注释：在 item 后添加，格式 ` ; <content>`

3. **Item.clone() 修复**：
   - 必须复制 `comment` 属性，否则 processor 中 clone 的 item 会丢失注释

**特性**：
- ✅ 独立注释（单独一行）vs 行内注释（代码同行）
- ✅ 基于 scope 的正确缩进
- ✅ 多行注释和块注释 (`###`)
- ✅ JSDoc 风格注释 (`###*`)

**已知限制**：
- ⚠️ CoffeeScript 将注释附加到下一个有意义的 token，而非语句开始
  - 示例：`# Comment\nglobal b = 1` 中注释附加到 `b`（identifier），导致渲染为 `global\n; Comment\nb := 1`
  - 理想输出：`; Comment\nglobal b := 1`
- ⚠️ 类属性/方法注释后可能影响缩进（cosmetic issue）

**技术细节**：
- Comment metadata 保存在 `Item.comment: string[]`，每个字符串带 `STANDALONE:` 或 `INLINE:` 前缀
- CoffeeScript token 的 `comment.locationData.first_line` 用于判断注释类型
- Token 行号：`token[2].first_line`

## 提交检查

1. `pnpm build && pnpm test` - 87 测试全过 (44 E2E + 20 unit + 23 error)
2. `pnpm lint` - 0 errors, 0 warnings
3. 新功能有测试
4. **重要发现已更新到本文件**
