# coffee-ahk

[English](./README.md) | [中文](./README.zh.md) | [日本語](./README.ja.md)

将 `coffeescript` 转译为 `ahk`。

[Documentation](./docs/documentation.md) | [中文文档](./docs/cn/documentation.md) | [AI Agent 使用指南](./USAGE.md)

> **AI 代理说明**: 参见 [USAGE.md](./USAGE.md)，了解如何编写用于 AHK 转译的 CoffeeScript。文档为中文，但 AI 代理可直接理解。

## 功能

- 将 CoffeeScript 转译为 AutoHotkey v1 脚本
- 支持类语法、继承与方法绑定
- 支持模块 import/export 语法（含 `.coffee`、`.ahk`、`.json`、`.yaml`）
  - `import './module'`（副作用）、`import m from './module'`（默认）、`import { a, b } from './module'`（具名）、`import m, { a } from './module'`（混合）
  - `export default`（单表达式、多行块或对象字面量）
  - `export { named, exports }`（具名导出，可选键值对）
  - 递归 import 解析与命名空间隔离
- 部分 npm 包管理支持（安装并导入本地/第三方模块）
- 支持函数式编程；函数为一等公民
- 箭头函数（`->`, `=>`）与 `this` 绑定
- 函数参数绑定、默认值与剩余参数
- 数组与对象解构赋值
- 支持多种语法糖，如解构、splat、链式比较、负索引、if-then-else 表达式
- try/catch/finally 错误处理
- 链式与隐式函数调用
- 匿名与高阶函数
- 反引号嵌入原生 AHK 代码
- 严格变量与保留字检查
- 通过插件提供可选的 TypeScript 静态类型系统支持

## 使用

```shell
pnpm i coffee-ahk
```

```typescript
import c2a from "coffee-ahk";

await c2a("./script/toolkit/index.coffee", {
  salt: "toolkit",
  save: true,
  verbose: false,
});
```

## 选项

| 选项       | 类型    | 默认值 | 描述                                   |
| ---------- | ------- | ------ | -------------------------------------- |
| `salt`     | string  | random | 生成函数的标识前缀                     |
| `save`     | boolean | true   | 写入 `.ahk` 文件                       |
| `string`   | boolean | false  | 返回编译后的字符串而非写文件           |
| `comments` | boolean | false  | 保留输出中的注释                       |
| `metadata` | boolean | true   | 在输出中包含时间戳注释                 |
| `verbose`  | boolean | false  | 启用调试日志                           |

## 限制

- AutoHotkey 不区分大小写；变量与函数名不区分大小写。
  **类名模拟为区分大小写：**
  - 类名必须以大写字母开头。
  - 为在 AHK v1 中模拟大小写，类标识符中的大写字母会被替换为全角 Unicode（如 `Animal` → `Ａnimal`）。
- 不支持 getter/setter
- **单字母类名被禁止**：AHK v1 对单字母类名存在问题。类名至少 2 个字符。
- **隐式 return 有限制**：
  - 普通函数最多 2 个换行（3 行代码）
  - 无大括号的对象字面量最多 1 个换行（2 行）
  - 以 `for`/`if`/`while`/`try` 结尾的函数必须显式 `return`
  - 超出以上限制需显式 `return`
- AHK 无真正布尔类型；`true`、`false`、`on`、`off` 仅为语法糖
- AHK 中字符与数字界限模糊；`'0'` 为假值
- `NaN`、`null`、`undefined` 会被转换为空字符串 `''`
- 不支持可选链 (`?`)（编译错误）
- 不支持无符号右移 (`>>>`)（编译错误）
- 不支持 `async`/`await` 与生成器（`yield`）（编译错误）
- 不支持 for 循环解构（`for [a, b] in arr`）（编译错误）。变通：`for item in arr` 再 `[a, b] = item`
- 不支持嵌套数组解构（`[a, [b, c]] = x`）（编译错误）。变通：手动展平
- 不支持嵌套 if-then-else 表达式（`if a then (if b then c else d) else e`）（编译错误）。变通：使用临时变量或拆分语句
- 整除（`//`）与取模（`%`、`%%`）与 AHK 语法冲突（编译错误）。请用 `Mod(a, b)`
- 避免在类外使用 `=>`；AHK 纯函数没有 `this`
- `.coffee` 文件必须为 UTF-8；`.ahk` 文件必须为带 BOM 的 UTF-8
- import/export 与 npm 包管理不完整
- **类 + 导出冲突**：AHK v1 类必须在顶层定义（不能在函数/闭包内）。导出模块会被 `do ->` 包裹以隔离作用域，因此类不能直接导出。变通：在单独文件中定义类且不 `export`，再用副作用导入（`import './myclass'`）把类引入顶层。
- **数组/对象索引限制**：AHK v1 中 `[]` 是 `{}` 的语法糖（`[a,b]` 等于 `{1:a, 2:b}`），且无法原生区分数组与对象。索引转换器（`ℓci`）假定数组用数字索引、对象用字符串键。如果对象使用数字键（如 `obj[0]`），会被错误转换为 `obj[1]`。注意：在 AHK v1 中，`obj[0]` 与 `obj["0"]` 访问的是**不同键**（数字 vs 字符串）。变量是例外：`i := "0"; obj[i]` 访问数字键（纯数字字符串会自动转换）。变通：字符串键用 `obj["0"]`，或使用 Native 嵌入直接访问 AHK。
- **Native 变量引用**：函数内的 Native 代码会自动使用临时变量（`λ_var`）桥接闭包变量。Native 块前：`λ_var := λ.var`，块后：`λ.var := λ_var`。这使 AHK 命令如 `Sort`、`StringUpper` 可以处理简单变量。

---

## 语言特性兼容性

| 功能 / 语法                               | CoffeeScript |   AutoHotkey v1    | coffee-ahk |
| ---------------------------------------- | :----------: | :----------------: | :--------: |
| **coffee-ahk 优势**（AHK ❌ → ✅）        |
| 箭头函数（`->`, `=>`）                    |      ✅      |         ❌         |     ✅     |
| 匿名函数                                  |      ✅      | ⚠️（仅 Func 对象） |     ✅     |
| `=>` 的 `this` 绑定                       |      ✅      |         ❌         |     ✅     |
| 数组解构                                  |      ✅      |         ❌         |     ✅     |
| 对象解构                                  |      ✅      |         ❌         |     🟡     |
| 字符串插值（`"#{}"`）                     |      ✅      | ⚠️（仅 `%var%`）   |     ✅     |
| 多行字符串（`"""`）                       |      ✅      |  ⚠️（续行语法）    |     ✅     |
| `unless`（否定 if）                       |      ✅      |         ❌         |     ✅     |
| `until`（否定 while）                     |      ✅      |         ❌         |     ✅     |
| 隐式 return                               |      ✅      |         ❌         |     🟡     |
| `do`（IIFE）                              |      ✅      |         ❌         |     ✅     |
| 隐式函数调用                              |      ✅      |   ⚠️（仅命令）     |     ✅     |
| `import`/`export`                         |      ✅      |   ⚠️（`#Include`） |     🟡     |
| **完全支持**                              |
| 类声明与继承                              |      ✅      |         ✅         |     ✅     |
| 构造函数（`__New`）                       |      ✅      |         ✅         |     ✅     |
| `super` / `base`                          |      ✅      |         ✅         |     ✅     |
| 静态方法/属性                             |      ✅      |         ✅         |     ✅     |
| 函数默认参数                              |      ✅      |  ✅（仅字面量）    |     ✅     |
| `if`/`else`, `switch`/`case`              |      ✅      |         ✅         |     ✅     |
| `for key, value in obj`                   |      ✅      |         ✅         |     ✅     |
| `while`/`loop`                            |      ✅      |         ✅         |     ✅     |
| `break`/`continue`                        |      ✅      |         ✅         |     ✅     |
| `try`/`catch`/`finally`/`throw`            |      ✅      |         ✅         |     ✅     |
| 数组/对象字面量                           |      ✅      |         ✅         |     ✅     |
| 布尔、比较、逻辑运算                      |      ✅      |         ✅         |     ✅     |
| 位运算（`&\|^~<<>>`）                     |      ✅      |         ✅         |     ✅     |
| `new` 运算符                              |      ✅      |         ✅         |     ✅     |
| 链式方法调用                              |      ✅      |         ✅         |     ✅     |
| 原生 AHK 嵌入（反引号）                   |      ❌      |         ✅         |     ✅     |
| **部分支持**                              |
| 剩余参数（`...args`）                     |      ✅      |    ⚠️（可变参）    |     🟡     |
| 函数调用中的展开                          |      ✅      |    ⚠️（可变参）    |     🟡     |
| `typeof`                                  |      ✅      |         ❌         |     ✅     |
| `instanceof`                              |      ✅      |         ❌         |     ✅     |
| 链式比较（`1<y<10`）                      |      ✅      |         ❌         |     ✅     |
| 负索引（`arr[-1]`）                       |      ✅      |         ❌         |     ✅     |
| If-then-else 表达式（`if a then b else c`）|      ✅      |         ❌         |     ✅     |
| **不支持**                                |
| 可选链（`?.`）                            |      ✅      |         ❌         |     ❌     |
| 空值合并（`??`）                          |      ✅      |         ❌         |     ❌     |
| Getter/Setter                             |      ✅      |   ⚠️（元函数）     |     ❌     |
| `async`/`await`                           |      ✅      |         ❌         |     ❌     |
| 生成器/`yield`                            |      ✅      |         ❌         |     ❌     |
| `Map`/`Set`/`Symbol`                      |      ✅      |         ❌         |     ❌     |

说明：coffee-ahk 列为 ❌ 的特性会触发 **编译错误**，并提供提示信息。

图例：
✅ 支持且等价  🟡 部分支持/有限制  ⚠️ 支持但有注意事项  ❌ 不支持
