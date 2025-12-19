# CLAUDE.md

> **haiku 简单任务** · **输出 5x 价格** · 中文 · **≤200行/文件≤100行/本文** · **人工信息禁删**
> Read/Glob/Grep > Task · 并行≤3 · 避免开放式 · **Skill 调用需等待完成** · **TodoWrite ≥3步必建**

> **输出约束**: 禁预告("让我..."/"现在...") · 状态符号(✓/✗/→) · 批量Edit · 数据优先省略叙述("根据分析..."/"我发现...") · 工具结果直达结论 · 禁确认语("好的"/"明白了") · 工具间隔零输出 · 错误格式`✗ {位置}:{类型}` · 代码块零注释 · ≥2条信息用列表 · 路径缩写(`.`项目根 · `~`主目录) · 禁总结性重复("我已经...") · 进度`{当前}/{总数}` · 提问单刀直入

**CoffeeScript → AutoHotkey v1** - 入口 [src/index.ts:18](src/index.ts#L18)

**精简冗余 · 冲突信代码 · 客观诚实 · 不主观评价 · 不因情绪转移立场 · 不编造事实 · 立刻暴露不确定信息**

## 规范

**代码**: `array.at(i)` 非 `[]` · 模板字符串 · `x?.is("a") === true` 非 `||` 链 · ≤200行(`cloc`)超限→拆分

```bash
pnpm build && pnpm test
pnpm test -- <name>
node -e "require('./dist/index.js').default('/tmp/test.coffee',{salt:'test'}).then(console.log)"
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

[src/file/include/](src/file/include/) - import/export → 拓扑排序 → 组装

**支持**: `import x from './m'` | `import {a,b}` | `export default` | `export {a,b}`
**禁止**: `import * as` | `import {x as y}` | `export const` - [source-resolver.ts:46](src/file/include/source-resolver.ts#L46) [parse-exports.ts:93](src/file/include/transformer/parse-exports.ts#L93)

## 约束

| 类别     | 规则                                              | 位置                                                                                      |
| -------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 禁用字   | AHK内置+`A_`前缀禁止赋值/参数/catch/for/解构/类名 | [data/forbidden.yaml](data/forbidden.yaml) · [variable/](src/processors/variable/)        |
| AHK输出  | 类名全角·索引1-based·UTF-8 BOM·控制结构`{}`·单字母类名禁用 | [class/](src/processors/class/) · [changeIndex.coffee](script/segment/changeIndex.coffee) · [identifier.ts:17](src/formatters/identifier.ts#L17) |
| 内部变量 | `λ`闭包·`ℓci`索引·`ℓtype`typeof·`ℓthis`this       | [constants.ts](src/constants.ts)                                                          |

## 闭包

AHK `.Bind()` 值拷贝 → `λ` 对象传引用 [src/processors/function/ctx-transform/](src/processors/function/ctx-transform/)

```coffee
fn = (a) -> (b = 1; inner = -> a + b; inner())
# → ahk_2(a) { λ:={a:a}; λ.b:=1; λ.inner:=Func("ahk_1").Bind(λ); ... }
```

**跳过**: 全局|`this`|`ℓxxx`|首字母大写|非函数作用域
**顺序**: collectParams → transformFunctions → transformVars → addBind
**冲突检测**: `collectParams` 检测 `Func("child").Bind(λ)` 建立层级 · 排除 `ℓ` · `scope.includes('function')` 判断嵌套

## 陷阱

| 问题                       | 解决                                | 位置                                                                    |
| -------------------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| Formatter 未返 `true`      | 消费后返回                          | -                                                                       |
| 改 `toArray()` 返回值      | `.reload()`/`.push()`               | -                                                                       |
| `!line` vs `=== undefined` | 跳空行`!line` 判结束`=== undefined` | -                                                                       |
| 隐式 return ≤3行           | 显式 `return`                       | [implicit-return.ts:52](src/processors/function/implicit-return.ts#L52) |
| for 循环解构/嵌套解构      | 分步/手动展开                       | -                                                                       |
| 对象数字键                 | 禁止·仅字符串键                     | -                                                                       |
| 嵌套闭包同名参数           | 不同参数名避免 `λ` 冲突             | [params.ts:18](src/processors/function/ctx-transform/params.ts#L18)     |

## mimo-v2-flash 陷阱

**低智力模型** · 转义计算错误 · 复杂字符串拼接失败 · 无感知失败能力

**Edit 转义**: Read显示≠Edit匹配 · `od -c`验证原字节 · 2次失败→Node.js脚本

```js
// Edit失败→fs直接操作
const fs=require('fs'), lines=fs.readFileSync(p,'utf8').split('\n');
fs.writeFileSync(p,[...lines.slice(0,idx),...newLines,...lines.slice(idx)].join('\n'));
```

