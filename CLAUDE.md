# CLAUDE.md

> **元原则**：中文文档 · 100行限制 · 节省 Tokens · 代码优先 · 渐进式披露 · 任务完成后更新重要发现

## 项目

CoffeeScript → AutoHotkey v1 转译器。入口 [src/index.ts:18](src/index.ts#L18)。

## 命令

```bash
pnpm build && pnpm test           # 必须先构建
pnpm test -- <name>               # 单测试
node -e "require('./dist/index.js').default('/tmp/test.coffee', { salt: 'test' }).then(console.log)"
```

## 架构

**流水线**: CoffeeScript → tokens → Formatters → Processors → Renderer → AHK

| 层         | 位置                 | 说明                                  |
| ---------- | -------------------- | ------------------------------------- |
| Formatters | [src/formatters/](src/formatters/)     | token→Item，返回 `true` 消费           |
| Processors | [src/processors/](src/processors/)     | 结构重写，**顺序敏感**（见 index.ts） |
| Renderer   | [src/renderer/](src/renderer/)       | Item→AHK                              |

**核心数据**（见 [src/types/](src/types/)）:
- `Item`: 不可变，**必须 `clone()` 复制**
- `Content`: Item 集合，支持 `push(...items)` 多参数
- `Scope`: 缩进栈

**内部变量** ([src/constants.ts](src/constants.ts)): `λ` 闭包 | `ℓci` 索引 | `ℓtype` typeof | `ℓthis` this

## 模块系统

**位置**: [src/file/include/](src/file/include/) — import/export 解析 → 拓扑排序 → 组装

**支持**: `import x from './m'` | `import {a,b}` | `export default` | `export {a,b}`
**不支持**: `import * as` | `import {x as y}` | `export const` — 错误信息见 [source-resolver.ts:46](src/file/include/source-resolver.ts#L46) 和 [parse-exports.ts:93](src/file/include/transformer/parse-exports.ts#L93)

## 规范与约束

**文件行数**: ≤200 行，超出需拆分或优化。检查方法：`cloc <file>`

**代码风格**:
```typescript
// ✅ array.at(i) + 空值检查 | 模板字符串 | x?.is("a") === true
// ❌ array[i] as Item | a + b 拼字符串 | x?.is("a") || x?.is("b")
```

**禁用字** ([data/forbidden.yaml](data/forbidden.yaml) + `A_` 前缀):
- **完全禁止**: 赋值/参数/catch/for/解构目标/类名（AHK 内置 + `A_`）
- **仅禁 `A_`**: 对象键/类属性/解构键
- **完全允许**: 读取/调用
- 实现位置见 [src/processors/variable/](src/processors/variable/)

**AHK 约束**:
- 类名全角（[src/processors/class/](src/processors/class/)）
- 索引 0→1-based（[script/segment/changeIndex.coffee](script/segment/changeIndex.coffee)）
- UTF-8 with BOM
- 控制结构必须写 `{}`

## 闭包实现

**问题**: AHK `.Bind()` 值拷贝 → **方案**: `λ` 对象传引用（详见 [src/processors/function/ctx-transform/](src/processors/function/ctx-transform/)）

```coffee
fn = (a) -> (b = 1; inner = -> a + b; inner())
# → ahk_2(a) { λ:={a:a}; λ.b:=1; λ.inner:=Func("ahk_1").Bind(λ); ... }
```

**跳过 ctx**: 全局 | `this` | `ℓxxx` | 首字母大写 | 非函数作用域

## 陷阱

| 问题                       | 解决                                               |
| -------------------------- | -------------------------------------------------- |
| Formatter 未返回 `true`    | 消费后返回                                         |
| 直接改 `toArray()` 返回值  | 用 `.reload()` / `.push()`                         |
| `!line` vs `=== undefined` | 跳空行用 `!line`；判结束用 `=== undefined`         |

## 限制

| 限制             | Workaround                   | 位置                                                     |
| ---------------- | ---------------------------- | -------------------------------------------------------- |
| 隐式 return ≤3行 | 显式 `return`                | [implicit-return.ts:52](src/processors/function/implicit-return.ts#L52) |
| for 循环解构     | 分两步                       | -                                                        |
| 嵌套解构         | 手动展开                     | -                                                        |

## 开发

**新功能**: 单 token → Formatter；多行重写 → Processor（按序插入 [src/processors/index.ts](src/processors/index.ts)）

**测试**: 覆盖 顶层/函数内 × 简单/闭包。盐固定 `salt: 'ahk'`

**提交检查**:
1. `pnpm build && pnpm test && pnpm lint` 全过
2. 新功能有测试
3. 文件 ≤200 行
4. **重要发现已更新到本文件**
