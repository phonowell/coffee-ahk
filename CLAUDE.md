# CLAUDE.md

> **元原则**：中文文档 · 300行限制 · AI友好 · 节省Tokens · 代码优先于文档 · **人工要求的信息不可轻易移除**

> **🔴 强制要求**：**完成任务后必须将对话中发现的重要信息（Bug、架构发现、设计决策、待验证问题）更新到本文件相应章节**

## 项目概述

**coffee-ahk**: CoffeeScript → AutoHotkey v1 转译器。支持类、模块、箭头函数、解构等现代语法。

## 常用命令

```bash
pnpm build                 # 构建（测试前必须）
pnpm build && pnpm test    # 运行全部测试
pnpm test -- <name>        # 单测试，如 pnpm test -- array
pnpm test -- overwrite     # 更新 fixture
pnpm lint                  # 代码检查
pnpm watch                 # 监听 script/**/*.coffee
```

**调试转译**（先 `pnpm build`）:
```bash
# ✅ 正确：文件路径 + default export
node -e "
const transpile = require('./dist/index.js').default;
transpile('/tmp/test.coffee', { salt: 'test' }).then(console.log);
"
# ❌ 错误
node_modules/.bin/coffee --transpile  # CoffeeScript CLI，非 coffee-ahk
require('./dist/index.js').transpile  # 应用 .default
transpile('代码字符串', ...)            # 需要文件路径
```

## 架构

### 转译流水线

```
CoffeeScript → tokens → Formatters(token→Item) → Processors(结构重写) → Renderer(Item→AHK)
```

**入口**: `src/index.ts::transpile(filePath, options)`

### 三层处理

| 层 | 位置 | 签名 | 说明 |
|---|---|---|---|
| Formatters | `src/formatters/` (27个) | `(ctx) => boolean` | token→Item，返回`true`消费 |
| Processors | `src/processors/` (31个) | `(ctx) => void` | 批量改写，**顺序敏感** |
| Renderer | `src/renderer/` | - | Item→AHK，`mapMethod`映射 |

**Processor 顺序**: newLine(#1) → for(#2) → array(#3) → object(#4) → typeof(#5) → instanceof(#6) → variable(#7) → builtIn(#8) → class(#9) → function(#10)

### 核心数据结构

- **Context**: `{token, type, value, content, scope, cache, options}`
- **Item**: 不可变 `{type, value, scope, comment?}` — **必须用 `clone()` 复制**
- **Content**: Item 集合，用 `.push()` / `.reload()`，禁直接改 `.list`
  - `at(i)` 返回 `Item | undefined`，用 `at(-1)` 取最后一个
  - `pop()` / `shift()` 返回 `Item | undefined`
- **Scope**: 缩进栈，需克隆防污染
  - `includes(value)` 检查是否包含某 scope
  - `pop()` / `shift()` 返回 `ScopeType | undefined`

### 内置函数

`script/segment/*.coffee` → 构建编译 → `src/processors/builtins.gen.ts`
- `changeIndex.coffee` → **统一索引转换**（0-based→1-based、负索引、变量索引）
- `typeof.coffee` → 类型检测

**索引处理策略 (v0.0.74+)**: 所有数字索引统一通过 `__ci__` 运行时函数处理，支持链式负索引如 `nested[0][-1]`。字符串键直接使用不转换。

**禁止直接写 .ahk**，必须写 .coffee。

### 模块内联系统

**流程** (`src/file/include/`): import 替换 → export 解析 → 模块组装

**关键**: `parseExportsFromCoffee()` 遍历模块行，收集 export 体时 **必须用 `line === undefined` 判断结束**（空字符串是 falsy）

## 代码规范

```typescript
// ✅ 正确
const item = array.at(i);                              // 数组用 at()
if (!item) return;                                     // 空值检查
const s = `${a}${b}`;                                  // 模板字符串
const flag = x?.is("a") === true || x?.is("b") === true; // 布尔链

// ❌ 错误
array[i] as Item;     // 禁 as 断言
a + b;                // 禁 + 拼字符串（用模板）
x?.is("a") || x?.is("b"); // ESLint 警告
```

TypeScript 严格模式: `noImplicitAny`, `noUncheckedIndexedAccess`

## 关键约束

- **大小写**: AHK 不敏感；类名用全角 (`Animal` → `Ａnimal`)
- **行长**: 最大 200 字符，`splitAtCommas()` 自动换行
- **编码**: UTF-8 with BOM
- **禁止语法**: `?.` `??` `||=` `&&=` `//` `%%` `in` `delete` — 见 `data/forbidden.yaml`
- **测试 salt**: 必须固定 `salt: 'ahk'`

## 常见陷阱

| 错误 | 后果 | 解决 |
|---|---|---|
| Formatter 未返回 `true` | token 重复处理 | 消费后返回 `true` |
| 直接改 `content.list` | Scope 未更新 | 用 `.reload()` / `.push()` |
| Processor 顺序错 | 转换错误 | 按序号插入 |
| 测试前未 build | 测旧代码 | `pnpm build && pnpm test` |
| `new Item()` 不用 `clone()` | 丢失 comment | 用 `clone()` |
| `!line` 判断空行 | 循环提前中断 | 用 `line === undefined` |
| post-if (`y if x`) | forbidden | 用 `if x then y` |

## 新功能开发

| 场景 | 层 | 示例 |
|---|---|---|
| 单 token 语法 | Formatter | `?.` → forbidden |
| 多行结构重写 | Processor | 数组解构 |
| 需回溯 | Formatter + Processor | 隐式返回 |

**添加 Formatter**: `src/formatters/<name>.ts` → 注册 `formattersMap` → 添加测试
**添加 Processor**: 按顺序插入（依赖 newLine 放 #1 后，结构重写放 builtIn 前）

## 注释系统

**启用**: `comments: true`（默认 `false`）

**流程**: Formatter 阶段读取 token comments → 判断 standalone/inline → 附加到 `Item.comment[]` → Renderer 渲染

**限制**: CoffeeScript 将注释附加到下一个 token，非语句开始

## 已知问题

### 已修复 (2025-11-24)
- **Export 解析空行中断**: `if (!nextLine) break` 遇空字符串中断 → 改用 `nextLine === undefined`
- **类型注释干扰**: export 前的 `###* @type ###` 需跳过

### 已解决 (2025-11-25)
- **链式负索引**: `nested[0][-1]` 之前无法正确转换（arrayItems 收集不完整）
- **解决方案**: 统一使用 `__ci__` 运行时函数处理所有数字索引，从右到左处理避免修改干扰
- **收集逻辑**: `collectArrayExpression()` 支持回溯索引表达式，正确收集 `nested[0]` 整体

### API 一致性改进 (2025-11-26)
- **Content 类**: 移除 `last` getter，统一用 `at(-1)`；`pop()`/`shift()` 返回 `undefined` 而非空 Item
- **Scope 类**: 添加 `includes()` 方法；`pop()`/`shift()` 返回 `undefined` 而非空字符串；优化 `isEqual()` 避免数组复制
- **移除冗余检查**: `identifier.ts` 中类名与变量冲突检查已移除（全角方案已处理）

### 待验证
- **BUG_REPORT.md**: 声称 `obj[func.Call()] := value` 在 AHK v1 静默失败 — 需真实环境测试

## 提交检查

1. `pnpm build && pnpm test` — 42 E2E + 20 unit + 23 error 全过
2. `pnpm lint` — 0 errors
3. 新功能有测试
4. **重要发现已更新到本文件**
