# CLAUDE.md

> **元原则**：中文文档 · AI友好 · 代码>文档 · **人工要求的信息不可移除** · **所有文件≤200行** · **本文件≤100行**
> **效率优先**：直接工具优于 subagent（Read/Glob/Grep > Task）· 并行任务≤3个 · 合并相关探索 · 明确任务避免开放式

## 项目概览

**CoffeeScript → AutoHotkey v1 转译器** - 入口 [src/index.ts:18](src/index.ts#L18)

## 核心规范

**代码约束**: `array.at(i)` 非 `array[i]` · 模板字符串 非 拼接 · `x?.is("a") === true` 非 `||` 链
**文件行数**: 所有代码文件≤200行（用 `cloc` 检查）- 超出时优先**简化逻辑**（删冗余/合并重复）其次**拆分文件**

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

**核心数据** ([types/](src/types/)): `Item` 不可变必须 `clone()` · `Content` 支持 `push(...items)` 多参数 · `Scope` 缩进栈

## 模块系统

**位置**: [src/file/include/](src/file/include/) - import/export 解析 → 拓扑排序 → 组装

**支持**: `import x from './m'` | `import {a,b}` | `export default` | `export {a,b}`
**不支持**: `import * as` | `import {x as y}` | `export const` - 错误见 [source-resolver.ts:46](src/file/include/source-resolver.ts#L46) 和 [parse-exports.ts:93](src/file/include/transformer/parse-exports.ts#L93)

## 关键约束

| 类别 | 规则 | 参考 |
|------|------|------|
| 禁用字 | AHK内置 + `A_` 前缀禁止赋值/参数/catch/for/解构目标/类名 | [data/forbidden.yaml](data/forbidden.yaml) + [variable/](src/processors/variable/) |
| AHK输出 | 类名全角 · 索引1-based · UTF-8 BOM · 控制结构带 `{}` | [class/](src/processors/class/) · [changeIndex.coffee](script/segment/changeIndex.coffee) |
| 内部变量 | `λ` 闭包 · `ℓci` 索引 · `ℓtype` typeof · `ℓthis` this | [constants.ts](src/constants.ts) |

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

## 开发与集成

**新功能**: 单 token → 使用 `formatter-creator` skill · 多行重写 → 使用 `processor-creator` skill
**调试**: 使用 `transpile-debugger` skill 快速测试转译输出
