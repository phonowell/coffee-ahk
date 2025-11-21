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

| 文件          | 处理token                                      | 生成Item                               |
| ------------- | ---------------------------------------------- | -------------------------------------- |
| identifier.ts | IDENTIFIER                                     | identifier（检类名冲突）               |
| operator.ts   | +/-/++/--/&&/\|\|/!/\*\*/&/\|/^/~/<</>>/typeof/instanceof | math/logical-operator/negative/compare/edge:instanceof-class |
| function.ts   | ->/=>、CALL_START                              | function/edge:call-start               |
| string.ts     | STRING                                         | string/edge:interpolation-\*           |
| class.ts      | CLASS                                          | class（注册classNames）                |
| forbidden.ts  | 全部                                           | 验证禁用语法（?./??/\|\|=）            |
| sign.ts       | ,/:/.../=                                      | sign                                   |

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
**执行顺序（严格）**：newLine(#1规范行) → for(#2索引) → array(#3) → object(#4) → typeof(#5) → instanceof(#6) → variable(#7) → builtIn(#8异步注入) → class(#9) → function(#10定型)

| 文件                        | 功能       | 操作                                      |
| --------------------------- | ---------- | ----------------------------------------- |
| for.ts                      | for-in循环 | 插入 `name = name - 1`（AHK索引从1）      |
| typeof.ts                   | typeof运算 | 包装表达式为`__typeof_salt__(expr)`       |
| instanceof.ts               | instanceof | 类名标识符→字符串`"ClassName"`            |
| chained-compare.ts          | 链式比较   | `1<y<10` → `1<y && y<10`                  |
| function/implicit-return.ts | 隐式返回   | 简单函数末尾加return                      |
| array/deconstruct.ts        | 数组解构   | `[a,b]=arr` → 多行赋值                    |
| variable/boost-global.ts    | 全局提升   | 未声明变量→global                         |
| build-in-loader.ts          | 注入内置   | 从builtins.gen.ts加载(changeIndex/typeof) |

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

**构建**（`task/build.ts`）：`pnpm i` → `forbidden.yaml→json` → `segment/*.coffee→*.ahk→builtins.gen.ts` → `esbuild` → `tsc --emitDeclarationOnly` → 清理dist

**Segment文件**（`script/segment/`）：内置函数必须用CoffeeScript编写，构建时编译为AHK

- `changeIndex.coffee` → 数组索引转换（支持负索引）
- `typeof.coffee` → 类型检测函数
- **禁止直接编写.ahk**，必须通过coffee编译生成

**测试**（84个：40 E2E + 20 unit + 24 error，覆盖率95.3%）：

- `pnpm build && pnpm test` - **必须先build！**
- `pnpm test -- overwrite` - 更新fixture
- `pnpm test -- <name>` - 单测试
- 特性：超时保护、Diff显示、空值检测、报告输出

**调试**：`pnpm watch` 监听 `script/**/*.coffee`

**进程退出**：`task/index.ts` 使用 `main().then(() => process.exit(0))` 确保测试完成后立即退出，避免fire-keeper句柄导致的10秒等待

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

| 错误               | 后果          | 解决                               |
| ------------------ | ------------- | ---------------------------------- |
| Formatter忘返true  | Token重复处理 | 完全消费返true                     |
| 随机salt           | 测试不稳定    | 固定salt:'ahk'                     |
| 直接改content.list | Scope未更新   | 用.reload/.push                    |
| Scope泄漏          | 作用域污染    | clone或自动reload                  |
| Processor索引偏移  | 插入位置错    | 倒序cache或splice                  |
| 使用非法ScopeType  | 类型错误      | 仅用合法类型（见ScopeType.ts）     |
| 测试前未build      | 测旧代码      | **必须 `pnpm build && pnpm test`** |
| segment写.ahk      | 不一致        | 必须写.coffee让构建编译            |
| 使用post-if语法    | forbidden报错 | 用标准 `if x then y` 代替 `y if x` |

### 错误与警告系统

- **行号显示**：formatter错误含行号 `token[2].first_line + 1`
- **源码上下文**：编译失败时显示出错行前后代码（`showSourceContext`+`rethrowWithContext`）
- **警告输出**：`Context.warnings` + `printWarnings()` 输出非致命警告
- 辅助函数：`getForbiddenReason(name)`, `extractLineNumber(msg)`

### 已知限制

- comment测试仅验证不崩溃（需`options.comments=true`）
- 无符号右移`>>>`不支持（AHK无对应语法）
- 隐式return仅支持简单表达式，不支持if/switch分支

### instanceof 实现

`obj instanceof Class` → `obj.__Class == "Class"`

- Formatter: `relation/instanceof` → `.`+`property:__Class`+`compare:==`+`edge:instanceof-class`
- Processor: `instanceof-class`标记后的identifier → string字面量

### 链式比较展开

`1 < y < 10` → `1 < y && y < 10`

- Processor `chained-compare.ts`: 检测连续compare，插入`&&`和中间操作数克隆

### 负索引支持

`arr[-1]` → `arr[arr.Length()]`（字面量）
`arr[a]`（a=-1）→ `arr[__ci__.Call(arr, a)]`（变量，运行时判断）

- `changeIndex.coffee`: `__ci__(arr, idx)` 接收数组和索引两个参数
- 负数：`arr.Length() + idx + 1`，正数：`idx + 1`
- `processIdentifierType`: 传入数组参数到`__ci__`调用
- `processNegativeIndex`: 字面量负索引直接展开为`arr.Length()`表达式

### TypeScript 严格模式

项目启用了完整严格模式（`noImplicitAny: true`, `noUncheckedIndexedAccess: true`）：

- **数组访问必须用 `at()` 方法**：`array.at(i)` 返回 `T | undefined`，配合空值检查
- **禁止 `as T` 类型断言绕过**：用条件检查代替
- **正则匹配结果检查**：`if (m?.[1] && m[2])` 同时满足 TS 和 ESLint
- **布尔链式判断**：`a?.is('x') === true || b?.is('y') === true` 避免 ESLint prefer-nullish-coalescing 警告

```typescript
// ✅ 正确
const item = array.at(i);
if (!item) return;
console.log(item.value);

// ✅ 布尔链（避免 || 触发 prefer-nullish-coalescing）
const flag = next?.is(".") === true || next?.is("x") === true;

// ❌ 错误
const item = array[i] as Item; // 不安全的类型断言
const flag = next?.is(".") || next?.is("x"); // ESLint警告
```

---

## 12. 修改检查清单

**开发流程**：`pnpm build && pnpm test` 确保基线 → 修改 → `pnpm build && pnpm test` → `pnpm lint`

**提交前必须**：

1. `pnpm build && pnpm test` 全部通过（84/84）
2. `pnpm lint` 无错误无警告（0 errors, 0 warnings）
3. 新功能添加测试，必要时 `pnpm test -- overwrite`

---

## 13. 架构关键点

1. **Formatter单向消费**：每token仅一个formatter处理
2. **Processor顺序敏感**：严格依赖（newLine→结构→内置→定型）
3. **不可变Item**：clone()勿直接改
4. **Scope自动管理**：Content.push自动reload
5. **内置异步加载**：builtInLoader在function前

---

**注意**：类名宽体字符（Ａnimal）是§9命名规则实现；native测试中`msg`是AHK全局变量
