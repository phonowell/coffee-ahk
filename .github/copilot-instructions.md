# `coffee-ahk` AI 协作指南（中文）

> **元原则**：中文文档 · 300行限制 · AI友好优先 · 节省Tokens · 并行工具调用 · 代码优先于文档 · **人工要求的信息不可轻易移除**

面向智能编码代理的项目专用速查说明。仅描述本仓库真实存在的结构与流程，避免泛化空话。

---

## 1. 总体流水线

```
CoffeeScript源码 → CoffeeScript编译tokens → formatters(token→Item)
→ processors(结构重写+内置注入) → renderer(Item→AHK) → 输出
```

**入口**：`src/index.ts::transpile(source, options)` 自动匹配 `foo.coffee`/`foo/index.coffee`；`string=true` 返回字符串，`save=false` 禁写盘。

---

## 2. 核心数据结构

**Context**（`src/types/index.ts`）：`{token, type, value, content, scope, cache:{classNames, identifiers, global}, options}`
**Item**（`src/models/Item.ts`）：`{type, value, scope, comment?}` 不可变，用 `clone()` 复制。32种类型见 `ItemType.ts`
**Content**（`src/models/Content.ts`）：Item集合，用 `.push(type, value)`（自动scope.reload）、`.reload(items)` 操作，禁直接改 `.list`
**Scope**（`src/models/Scope.ts`）：缩进栈 `['global', 'class', 'function']`，需克隆防污染

---

## 3. Formatters 层（27个）

**签名**：`(ctx: Context) => boolean` 返回 `true` 消费token终止后续；`false` 继续下一个
**执行**：遍历非comment formatter → 最后执行 `comment` 附着注释

| 文件          | 处理token                | 生成Item                               |
| ------------- | ------------------------ | -------------------------------------- |
| identifier.ts | IDENTIFIER               | identifier（检类名冲突）               |
| operator.ts   | +/-/++/--/&&/\|\|/!/\*\* | math/logical-operator/negative/compare |
| function.ts   | ->/=>、CALL_START        | function/edge:call-start               |
| string.ts     | STRING                   | string/edge:interpolation-\*           |
| class.ts      | CLASS                    | class（注册classNames）                |
| forbidden.ts  | 全部                     | 验证禁用语法（?./??/\|\|=）            |
| sign.ts       | ,/:/.../=                | sign                                   |

**新增**：创建 `src/formatters/<name>.ts` → 注册 `formattersMap` → 添加 `script/test/<name>.coffee` 测试

<details><summary>Formatter模板</summary>

```typescript
import type { Context } from "../types";
const main = (ctx: Context): boolean => {
  const { content, type, value } = ctx;
  if (type !== "YOUR_TYPE") return false;
  content.push("identifier", value);
  return true;
};
export default main;
```

</details>

---

## 4. Processors 层（31个）

**签名**：`(ctx: Context) => void|async` 批量改写Item结构
**执行顺序（严格）**：newLine(#1规范行) → for(#2索引) → array(#3) → object(#4) → variable(#5) → builtIn(#6异步注入) → class(#7) → function(#8定型)

| 文件                        | 功能       | 操作                                 |
| --------------------------- | ---------- | ------------------------------------ |
| for.ts                      | for-in循环 | 插入 `name = name - 1`（AHK索引从1） |
| function/implicit-return.ts | 隐式返回   | 简单函数末尾加return                 |
| array/deconstruct.ts        | 数组解构   | `[a,b]=arr` → 多行赋值               |
| variable/boost-global.ts    | 全局提升   | 未声明变量→global                    |
| build-in-loader.ts          | 注入内置   | 从builtins.gen.ts加载                |

**新增**：插入正确顺序位置（依赖规范行放#1后，需原始token顺序放结构重写前）

<details><summary>Processor模板</summary>

```typescript
import Item from "../models/Item.js";
const main = (ctx: Context) => {
  const { content } = ctx;
  const cache: [number, Item[]][] = [];
  content.list.forEach((item, i) => {
    if (!item.is("identifier", "value")) return;
    cache.push([i + 1, [new Item("new-line", indent, scope)]]);
  });
  if (cache.length) {
    const list = content.list;
    for (const [idx, items] of cache) list.splice(idx, 0, ...items);
    content.reload(list);
  }
};
```

</details>

---

## 5. Renderer 层

**职责**：Item → AHK字符串，核心：`src/renderer/index.ts::mapMethod`

```typescript
mapMethod = {
  "new-line": newLine2, // 函数：\n+缩进+logger分段
  identifier: identifier2, // 函数：类名首字母→全角
  edge: edge2, // 函数：block-start→{ call-start→(
  if: if2, // 函数：if/else/switch
  class: "class ", // 字符串：直接替换
  math: " ~ ", // 模板：~→value
  void: "", // 移除
  super: "base", // AHK映射
};
```

**注释流程**：Formatter附着→Renderer收集(`setCacheComment`)→`injectComment`插入

---

## 6. 文件系统

- **read.ts**：UTF-8-BOM自动检测，处理include
- **write.ts**：强制UTF-8-BOM（AHK v1要求）
- **include/**：模块解析（source-resolver路径查找、cache防循环、transformer转import为native）

---

## 7. 构建/测试/调试

**构建**（`task/build.ts`）：`pnpm i` → `forbidden.yaml→json` → `segment/*.coffee→builtins.gen.ts` → `esbuild` → `tsc --emitDeclarationOnly` → 清理dist

**测试系统**（`task/test/`）- 四层防护 + 增强功能：

```
pnpm test  # 运行所有84个测试
├─ 1️⃣ 端到端（38个） 2️⃣ 单元（20个） 3️⃣ 错误（26个，见`task/test/errors.ts`）
├─ 4️⃣ 覆盖率：95.2%（26/26 formatters, 14/16 processors）
├─ 🛡️ 超时保护：每个测试10秒超时，防止死循环
├─ 📊 Diff显示：失败时逐行对比（git风格：- expected, + actual）
├─ ⏱️ 耗时统计：显示总执行时间
├─ 🚫 空值检测：编译结果或fixture为空时报错，防止假阳性
├─ 📝 报告输出：生成test-report.md（成功/失败均输出）
└─ 🔍 Dist检查：测试前验证dist/index.js存在
```

| 命令                      | 用途                    |
| ------------------------- | ----------------------- |
| `pnpm test`               | 完整测试套件（~7s并行） |
| `pnpm test -- overwrite`  | 更新fixture             |
| `pnpm test -- <name>`     | 单测试文件              |
| `pnpm task test-unit`     | 仅单元测试              |
| `pnpm task test-errors`   | 仅错误测试              |
| `pnpm task test-coverage` | 仅覆盖率                |

**调试**（`task/watch.ts`）：监听 `script/**/*.coffee`，固定 `salt:'ahk'`，开启 `coffeeAst`+`verbose`（含编译耗时）

---

## 8. 选项配置

```typescript
DEFAULT_OPTIONS = {
  ast: false, // AST JSON调试
  coffeeAst: false, // 打印tokens
  comments: false, // 保留注释
  metadata: true, // 时间戳
  salt: "", // 函数名盐（测试用'ahk'固定）
  save: true, // 写文件
  string: false, // 仅返回字符串
  verbose: false, // 详细日志
};
```

**重要**：固定salt保证测试可重复

---

## 9. 命名规则

**类名**：首字母→全角 `Animal→Ａnimal`（模拟大小写敏感），注册 `cache.classNames`，与变量/函数冲突报错
**禁止语法**：维护 `data/forbidden.yaml`（`?.`/`??`/`||=`等），修改后重建

---

## 10. 新功能开发策略

| 场景          | 推荐层                          | 示例                 |
| ------------- | ------------------------------- | -------------------- |
| 单token语法糖 | Formatter                       | `?.`→报错(forbidden) |
| 多行结构重写  | Processor                       | 数组解构→多行        |
| 需回溯        | Formatter临时Item+Processor改写 | 隐式返回             |

---

## 11. 常见陷阱与已知问题

### 开发陷阱

| 错误               | 后果          | 解决              |
| ------------------ | ------------- | ----------------- | ---- | ----- | ------- | --------------------- |
| Formatter忘返true  | Token重复处理 | 完全消费返true    |
| 随机salt           | 测试不稳定    | 固定salt:'ahk'    |
| 直接改content.list | Scope未更新   | 用.reload/.push   |
| Scope泄漏          | 作用域污染    | clone或自动reload |
| Processor索引偏移  | 插入位置错    | 倒序cache或splice |
| 使用非法ScopeType  | 类型错误      | 仅用`''           | 'if' | 'for' | 'class' | 'function'`等合法类型 |

### 错误与警告系统

- **行号显示**：formatter错误含行号 `token[2].first_line + 1`
- **源码上下文**：编译失败时显示出错行前后代码（`showSourceContext`+`rethrowWithContext`）
- **警告输出**：`Context.warnings` + `printWarnings()` 输出非致命警告
- 辅助函数：`getForbiddenReason(name)`, `extractLineNumber(msg)`

### 已知限制

- comment测试仅验证不崩溃（需`options.comments=true`）
- 位运算符已禁止；链式比较`1<y<10`未正确展开为`(1<y)&&(y<10)`

---

## 12. 命令速查

```bash
pnpm i && pnpm build            # 安装+构建
pnpm test                       # 84个测试（E2E+单元+错误+覆盖率）
pnpm test -- overwrite          # 更新fixture
pnpm test -- <name>             # 单测试
pnpm watch                      # 监听开发
pnpm lint                       # ESLint检查
```

---

## 13. 修改检查清单

**开发前**：

1. `pnpm test` 确保基线通过（74/74）
2. 理解 formatter/processor 顺序和职责

**开发中**：

- 改 `forbidden.yaml`/`segment/*` → `pnpm build` 重新生成
- 新 formatter → 注册 `formattersMap` + 添加测试用例
- 新 processor → 插入**正确顺序**（见§4执行顺序）
- 使用合法 ScopeType（见 `src/models/ScopeType.ts`）
- 避免直接修改 `content.list`，用 `.push()` / `.reload()`

**提交前**：

1. `pnpm test` 验证全部通过
2. 必要时 `pnpm test -- overwrite` 更新 fixture
3. `npx tsc --noEmit` 验证 TypeScript 类型无错误
4. `pnpm lint` 验证 ESLint 无错误（warning可接受）
5. 新功能添加对应测试（E2E/单元/错误场景）
6. 更新文档（本文件或 README）

**⚠️ 代码质量规则**：所有代码必须同时通过 TypeScript 和 ESLint 双重检测。

---

## 14. 架构关键点

1. **Formatter单向消费**：每token仅一个formatter处理
2. **Processor顺序敏感**：严格依赖（newLine→结构→内置→定型）
3. **不可变Item**：clone()勿直接改
4. **Scope自动管理**：Content.push自动reload
5. **注释后置**：所有formatter后附着
6. **类名冲突检测**：identifier查classNames
7. **内置异步加载**：builtInLoader在function前

---

## 附录：项目统计

**Formatters（26个）**：alias, array, boolean, bracket, class, comment, do, for, forbidden, function, identifier, if, indent, module, native, new-line, nil, number, object, operator, property, sign, statement, string, switch, try, while

- 测试覆盖：25/26 (96.2%)
- 未测：forbidden

**Processors（23个）**：newLine, for, array(5), object(3), variable(4), builtIn, class(3), function(11)

- 测试覆盖：11/23 (47.8%)

**Models（5个）**：Item, Content, Scope, ItemType, ScopeType

**测试套件**：74个测试

- 端到端：38个（script/test/\*.coffee）
- 单元测试：20个（Item/Content/Scope）
- 错误场景：16个（禁止语法验证）
- 总覆盖率：73.5% (36/49组件)

---

**注意**：native测试中`msg`是AHK全局变量；类名宽体字符（Ａnimal）是§9命名规则实现
