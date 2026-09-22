# AGENTS.md

## 关键约束

- Read/Glob/Grep > Task · 并行≤3 · 避免开放式
- Skill 调用需等待完成再执行
- TodoWrite ≥3步必建·实时更新·完成即标记
- 精简冗余 · 冲突信代码 · 客观诚实·不主观评价·不因情绪转移立场·不编造事实·立刻暴露不确定信息

## 技术栈

- CoffeeScript → AutoHotkey v1 · 入口 `src/index.ts` (transpile) → `src/entry/index.ts` (管线)

## 核心命令

- `pnpm build && pnpm test` (vitest)
- `pnpm test -- <name>` · `pnpm test overwrite [name]` 重建 fixture
- `pnpm lint` (oxlint) · `pnpm fmt` (oxfmt)
- 单文件编译: `node -e "import('./dist/index.js').then(m=>m.default('<file>'))"` (dist 无 CLI，仅导出 API)

## 目录结构

- `src/types/`: Item 字段就地可变为设计 · 跨位置复用前必须 `clone()` · `Content.push(...items)` 多参 · `Scope` 缩进栈
- `src/file/include/`: import/export→拓扑排序→组装 · `IncludeContext` 每次编译独立实例(并发安全) · 支持 default/named export · 禁 `import * as`/`import {x as y}`/`export const`
- `data/forbidden.yaml` + `src/processors/variable/`: AHK 内置与 `A_` 前缀禁用

## 工作流

- Formatters → Processors → Renderer
- 编译/调试问题必须先调 `debug-coffee-ahk` skill (禁手动重复尝试命令)
- 架构/执行顺序/关键职责/新陷阱变更 → 同步更新 `debug-coffee-ahk` skill

## Skill 使用

- 调用后等待完成再执行
- 编译无输出/无错误 → 先调 `debug-coffee-ahk` skill 或 `{verbose:true}`

## 代码规范

- `array.at(i)` 非 `[]` · 模板字符串 · `x?.is("a") === true` 禁 `||` 链
- 单文件 ≤200行(`cloc`) 超限拆分
- 禁手动改 `script/test/*.ahk` → `pnpm test overwrite`
- 类型规范: ≥5 处非空断言 → 立即重构类型架构 (禁 lint-disable 注释批量压制)

## 约束

- 禁用字: AHK 内置+`A_` 前缀禁赋值/参数/catch/for/解构/类名 (`data/forbidden.yaml`, `src/processors/variable/`)
- 禁用符: `%` 运算符→`Mod(a,b)` (`src/formatters/operator.ts:151`)
- AHK 输出: 类名全角·索引1-based·UTF-8 BOM·控制结构`{}`·单字母类名禁用 (`src/processors/class/`, `script/segment/changeIndex.coffee`, `src/renderer/basic.ts` renderIdentifier)
- 内部变量: `λ`闭包·`ℓci`索引·`ℓtype`typeof·`ℓthis`this (`src/constants.ts`)
- salt: 默认按源路径/内容 hash 确定性生成(`s`+base36); `BUILTIN_SALT='salt'` 仅 builtin 段编译用(跳过 ctx-transform)

## 闭包

- AHK `.Bind()` 值拷贝 → `λ` 对象传引用 (`src/processors/function/ctx-transform/`)
- 跳过: 全局|`this`|`ℓxxx`|首字母大写|非函数作用域
- 顺序: collectParams → transformFunctions → transformVars → addBind
- 冲突: `collectParams` 检测 `Func("child").Bind(λ)` 层级 · 排除 `ℓ` · `scope.includes('function')` 判嵌套

## 错误处理

- `TranspileError(ctx,type,msg)` 有 Context·带 `line`/`column` 字段; `createTranspileError(type,msg,solution,line?)` 无 Context (`src/utils/error.ts`)
- Formatters/Processors 当前 token 错误→`TranspileError`
- 文件不存在·循环依赖·闭包冲突汇总→`createTranspileError`
- 行号解析: `e.line` → `e.location.first_line`(CoffeeScript 原生错) → message 文本兜底 (`src/index.ts` getErrorLine)
- 行号映射: include 合并建 `{file,line,content}[]` 经 `mappingRef` 参数传出 (`src/index.ts`, `src/file/include/cache.ts`); 展示 `📍 {文件}:{行号}` + 上下2行

## 陷阱

- Formatter 必须返回 `true` (未消费 token 编译时 warning 列出); `!line` 跳空行, `=== undefined` 判结束
- Renderer 用 `RenderContext.list` 共享快照, 禁 item 级 `toArray()` (O(n²))
- `toArray()` 返回值改动需 `.reload()`/`.push()`
- 隐式 return ≤3行需显式 `return` (`src/processors/function/implicit-return.ts:51`)
- for 解构/嵌套解构需分步; 对象数字键禁止(仅字符串)
- 嵌套闭包同名参数需改名避免 `λ` 冲突 (`src/processors/function/ctx-transform/params.ts:67`)
- void 不可移除: anonymous 提取·pickItem 递归依赖 `item.type='void'` → reload() filter (`src/processors/function/anonymous/pick-item.ts:27`)

## 输出格式

- 禁预告("让我..."/"现在...") · 状态符号(✓/✗/→) · 批量Edit · 数据优先省略叙述("根据分析..."/"我发现...")
- 工具结果直达结论 · 禁确认语("好的"/"明白了") · 工具间隔零输出
- 错误格式 `✗ {位置}:{类型}` · 代码块零注释 · ≥2条信息用列表
- 路径缩写(`.`项目根 · `~`主目录) · 禁总结性重复("我已经...")
- 进度 `{当前}/{总数}` · 提问单刀直入
