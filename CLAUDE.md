# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **元原则**：中文文档 · 300行限制 · AI友好优先 · 节省Tokens · 并行工具调用 · 代码优先于文档 · **人工要求的信息不可轻易移除** · **对话中发现的重要信息主动记录到本文件**

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
- **Item**: 不可变 `{type, value, scope, comment?}`，用 `clone()` 复制
- **Content**: Item 集合，用 `.push()` 或 `.reload()`，禁直接改 `.list`
- **Scope**: 缩进栈 `['global', 'class', 'function']`，需克隆防污染

### 内置函数

`script/segment/*.coffee` 构建时编译 → `src/processors/builtins.gen.ts`:

- `changeIndex.coffee` → 负索引支持
- `typeof.coffee` → 类型检测

**禁止直接写 `.ahk`**，必须写 `.coffee` 让构建编译。

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

| 错误                    | 后果           | 解决                       |
| ----------------------- | -------------- | -------------------------- |
| Formatter 未返回 `true` | token 重复处理 | 消费后返回 `true`          |
| 随机 salt               | 测试不稳定     | 固定 `salt: 'ahk'`         |
| 直接改 `content.list`   | Scope 未更新   | 用 `.reload()` / `.push()` |
| Processor 顺序错        | 转换错误       | 按序号插入正确位置         |
| 测试前未 build          | 测旧代码       | `pnpm build && pnpm test`  |
| segment/ 写 .ahk        | 不一致         | 写 .coffee                 |
| post-if (`y if x`)      | forbidden      | 用 `if x then y`           |

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

## 提交检查

1. `pnpm build && pnpm test` - 87 测试全过 (44 E2E + 20 unit + 23 error)
2. `pnpm lint` - 0 errors, 0 warnings
3. 新功能有测试
