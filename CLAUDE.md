# CLAUDE.md

> **haiku 优先简单任务** · **输出 tokens 5x 价格惜字如金** · 中文 · **≤200行/文件≤100行/本文** · **人工信息禁删**
> Read/Glob/Grep > Task · 并行≤3 · 合并探索 · 避免开放式

**CoffeeScript → AutoHotkey v1** - 入口 [src/index.ts:18](src/index.ts#L18)

## 规范

**代码**: `array.at(i)` 非 `[]` · 模板字符串 · `x?.is("a") === true` 非 `||` 链
**行数**: ≤200行（`cloc`）超限→简化逻辑→拆分

```bash
pnpm build && pnpm test           # 先构建
pnpm test -- <name>
node -e "require('./dist/index.js').default('/tmp/test.coffee', { salt: 'test' }).then(console.log)"
```

## 架构

**流水线**: CoffeeScript → tokens → Formatters → Processors → Renderer → AHK

| 层         | 位置                               | 说明                        |
| ---------- | ---------------------------------- | --------------------------- |
| Formatters | [src/formatters/](src/formatters/) | token→Item 返回 `true` 消费 |
| Processors | [src/processors/](src/processors/) | 结构重写 **顺序敏感**       |
| Renderer   | [src/renderer/](src/renderer/)     | Item→AHK                    |

**数据** ([types/](src/types/)): `Item` 不可变用 `clone()` · `Content.push(...items)` 多参数 · `Scope` 缩进栈

## 模块

[src/file/include/](src/file/include/) - import/export 解析 → 拓扑排序 → 组装

**支持**: `import x from './m'` | `import {a,b}` | `export default` | `export {a,b}`
**禁止**: `import * as` | `import {x as y}` | `export const` - [source-resolver.ts:46](src/file/include/source-resolver.ts#L46) · [parse-exports.ts:93](src/file/include/transformer/parse-exports.ts#L93)

## 约束

| 类别     | 规则                                              | 位置                                                                                      |
| -------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 禁用字   | AHK内置+`A_`前缀禁止赋值/参数/catch/for/解构/类名 | [data/forbidden.yaml](data/forbidden.yaml) · [variable/](src/processors/variable/)        |
| AHK输出  | 类名全角·索引1-based·UTF-8 BOM·控制结构`{}`       | [class/](src/processors/class/) · [changeIndex.coffee](script/segment/changeIndex.coffee) |
| 内部变量 | `λ`闭包·`ℓci`索引·`ℓtype`typeof·`ℓthis`this       | [constants.ts](src/constants.ts)                                                          |

## 闭包

AHK `.Bind()` 值拷贝 → `λ` 对象传引用 [src/processors/function/ctx-transform/](src/processors/function/ctx-transform/)

```coffee
fn = (a) -> (b = 1; inner = -> a + b; inner())
# → ahk_2(a) { λ:={a:a}; λ.b:=1; λ.inner:=Func("ahk_1").Bind(λ); ... }
```

**跳过 ctx**: 全局|`this`|`ℓxxx`|首字母大写|非函数作用域

**处理顺序**: collectParams → transformFunctions → transformVars → addBind
**冲突检测**: `collectParams` 中检测 `Func("child").Bind(λ)` 模式建立层级·排除 `ℓ` 前缀·函数提取后都在顶层靠 `scope.includes('function')` 判断嵌套

## 陷阱/限制

| 问题                       | 解决                                | 位置                                                                    |
| -------------------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| Formatter 未返 `true`      | 消费后返回                          | -                                                                       |
| 改 `toArray()` 返回值      | 用 `.reload()`/`.push()`            | -                                                                       |
| `!line` vs `=== undefined` | 跳空行`!line` 判结束`=== undefined` | -                                                                       |
| 隐式 return ≤3行           | 显式 `return`                       | [implicit-return.ts:52](src/processors/function/implicit-return.ts#L52) |
| for 循环解构/嵌套解构      | 分步/手动展开                       | -                                                                       |
| 对象用数字键               | 禁止，仅用字符串键                  | -                                                                       |
| 嵌套闭包同名参数           | 使用不同参数名避免 `λ` 冲突         | [params.ts:18](src/processors/function/ctx-transform/params.ts#L18)     |
