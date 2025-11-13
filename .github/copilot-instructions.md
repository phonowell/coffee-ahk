# `coffee-ahk` AI 协作指南（中文）

面向智能编码代理的项目专用速查说明。仅描述本仓库真实存在的结构与流程，避免泛化空话。

## 1. 总体流水线

`CoffeeScript 源码` → CoffeeScript 编译产出 tokens → `formatters`（逐 token 生成内部 Item）→ `processors`（结构重写 + 内置片段注入）→ `renderer` 输出 AHK v1 脚本 → 可选写回文件。
入口：`src/index.ts` 暴露 `transpile(source, options)`，自动匹配 `foo.coffee / foo/index.coffee`；`options.string=true` 走纯文本模式。

## 2. 运行时核心结构

- `Context`（`src/entry/index.ts` 构建）：当前 token 元数据、缓存（`classNames`/`identifiers`）、缩进、选项、共享 `Scope` 与 `Content`。
- `Content`：内部 Item 顺序集合，使用 `.push()` / `.reload()`；不要直接改私有数组。
- `Item`：最小片段（`type`/`value`/`scope`/可选注释），可 `clone()`。
- `Scope`：线性作用域栈，需克隆/重载保证不泄漏。

## 3. Formatters 约定

- 每个 `(ctx)=>boolean`；返回 `true` 表示消费结束，后续 formatter 不再触发（除 `comment`）。
- 遍历时跳过 `comment`，最后单独执行以附着注释。
- 新增：`src/formatters/<name>.ts` + 注册到 `formattersMap`；务必只在完全处理时返回 `true`。
- 拼写历史：原键 `indentifier` 已更正为 `identifier`；如外部脚本曾依赖旧键需同步修改。

## 4. Processors 顺序（`src/processors/index.ts`）

1. `newLineProcessor` 必须最先：行/分隔规范化。
2. `for` / `array` / `object` / `variable`：结构层重写。
3. `builtInLoaderProcessor` 异步注入内置（`builtins.gen.ts` 中如 `changeIndex_ahk`）。
4. `class` / `function`：最终定型与绑定。
   新增 processor 时遵循：依赖规范行的放 #1 之后，需原始 token 顺序的放结构重写之前。

## 5. 构建（`task/build.ts`）

- `data/forbidden.yaml` → `forbidden.json`（供 `forbiddenFormatter`）。
- 编译 `script/segment/changeIndex.coffee` → 注入 `src/processors/builtins.gen.ts`。
- 执行 `esbuild` + `tsc --emitDeclarationOnly` 后清理 dist 只留入口。
  修改内置段：编辑 `script/segment/*.coffee` → `pnpm build`。

## 6. 测试（`task/test.ts`）

- 对比：源 TS 版本输出 vs 构建后 dist 版本输出 vs 固定 fixture(`script/test/*.ahk`)。
- 不一致时打印差异：第一段实际结果 → `---TURN 1---` → 期望；或第二段对应 dist。
- 覆盖更新 fixture：`pnpm task test -- overwrite`。

## 7. 调试 / 观察

- `pnpm watch` 监听 `script/**/*.coffee`，强制 `salt:'ahk'`，开启 `coffeeAst` 与 `verbose` 打印 tokens 与 Item 分隔线。
- `logger/index.ts` 用 `new-line` Item 生成分段可视化。

## 8. 选项语义（`src/index.ts`）

- 固定 `salt` 保证可重复（测试用 `'ahk'`）。
- `comments` 开启需 formatter 正确保留注释。
- `metadata:false` 以保持与 fixture 一致。
- `string:true` 返回字符串不写文件；`save:false` 禁止落盘。
- `ast`/`coffeeAst`/`verbose` 打印内部调试信息。
  不要直接篡改 `DEFAULT_OPTIONS`，只做浅合并。

## 9. 命名与大小写

- 类名首字母大写并转换为全角模拟大小写敏感。
- 变量/函数名不可与任何类名冲突；冲突编译报错（使用 `Context.cache.classNames` 检查）。
- 禁止语法统一维护于 `data/forbidden.yaml`，添加后需重建。

## 10. 新语言功能策略

- 单 token 语法糖：优先新增 formatter。
- 跨多行结构：使用 processor；避免重复“回放”原 tokens。
- 需要回溯：可先在 formatter 推临时 Item，再在后续 processor 二次改写。

## 11. 常见陷阱

- 忘记返回 `true` → token 被后续 formatter 再处理。
- 使用随机 `salt` 导致测试不稳定 → 测试固定。
- Scope 泄漏：克隆 Item 或依赖 `Content.push` 自动 `scope.reload`。
- 末尾多余空白：`render(ctx).trim()` 已裁剪；避免创建无意义占位 Item。

## 12. 常用命令

```powershell
pnpm i
pnpm build
pnpm test
pnpm task test -- overwrite
pnpm watch
pnpm lint
pnpm task publish
```

## 13. 扩展/修改建议

- 大改前执行 `pnpm test` 建立基线。
- 改 `forbidden.yaml` 或内置段后重建再测。
- 新增 formatter 必配测试用例：`script/test/<name>.coffee` + 对应 `.ahk`。
- 避免在 processor 中全面重构已有 Items；做增量调整。

---

需要：示例 formatter 模板 / processor 模板 / renderer 关键拼接策略 等补充？告诉我再迭代。
