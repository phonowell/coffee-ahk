<!--
本文件（llms.md）为 coffee-ahk 项目概要，**Agent 规则**须始终位于最顶部，且每次 agent 相关变更后需同步更新。
“本文件”在下文及全文均指 llms.md。
-->

# Agent 规则

1. 本模块（Agent 规则）必须始终放在文件最顶部。
2. 本文件（llms.md）必须符合 llms 的格式规范。
3. 仅需确保本文件对机器友好。
4. 对本文件进行任何修改时，均需要按照 Agent 规则重构一次文件。
5. 当项目发生任意变化时，均需要同步本文件。
6. 文件结尾必须包含 `# EOF`。

---

# 1. 核心流程

- 输入：.coffee 文件或字符串，经 [`src/file/read.ts`](src/file/read.ts:1) 读取
- 解析与转换：[`src/entry/index.ts`](src/entry/index.ts:1)、[`src/formatters/`](src/formatters/index.ts:1)、[`src/processors/`](src/processors/)
- 输出：[`src/file/write.ts`](src/file/write.ts:1) 生成 .ahk
- 日志：[`src/logger/index.ts`](src/logger/index.ts:1)
- 支持类型：.coffee、.ahk、.json、.yaml
- 中间产物：AST、格式化对象、日志、缓存
- 递归、基于缓存的转换，所有 export 统一收集并 return
- .ahk 输出包裹代码块，变量名基于 salt 生成避免冲突

# 2. 类型与目录结构

- 关键类型：[`Content`](src/models/Content.ts:1)、[`Item`](src/models/Item.ts:1)、[`Scope`](src/models/Scope.ts:1)
- 目录结构：
  - [`src/`](src/index.ts:1)：核心源码（TypeScript，ESM）
  - [`src/formatters/`](src/formatters/index.ts:1)：token 语法映射
  - [`src/processors/`](src/processors/)：批量内容转换
  - [`src/models/`](src/models/)：类型定义
  - [`src/file/`](src/file/index.ts:1)：IO、缓存、解析
  - [`src/logger/`](src/logger/index.ts:1)：日志
  - [`src/utils/`](src/utils/)：工具函数
  - [`data/`](data/forbidden.json:1)：配置、禁用项
  - [`script/test/`](script/test/)：测试用例（.coffee/.ahk，1:1 映射）
  - [`task/`](task/)：自动化脚本

# 3. 导入与导出规范

- 所有 TypeScript/JavaScript 源码采用 ESM 规范，import 语句必须显式带后缀（.js、.ts）
- .coffee 文件包裹为闭包，其他类型直接插入
- import/export 依赖递归处理、去重、缓存跟踪，所有 export 统一收集并 return

# 4. 构建与输出

- 输出目标：AutoHotkey v1（无属性访问器、无真实模块系统、无布尔类型）
- 类名区分大小写，采用全角 Unicode 字母模拟（大写字母 → 全角）
- .coffee 文件为 UTF-8，.ahk 文件为带 BOM 的 UTF-8
- CoffeeScript 的 export 通过闭包变量/return 模拟
- 变量/函数/参数名不得与类名冲突
- 自动化脚本：pnpm task <任务名>

# 5. 测试与错误处理

- 测试用例位于 [`script/test/`](script/test/)（.coffee/.ahk，1:1 映射），需覆盖典型与边缘情况
- 测试运行器：转译 .coffee 并与 .ahk 比较
- 批量测试：pnpm test；单文件测试：pnpm test xxx；覆盖所有 .ahk：pnpm test overwrite
- 错误抛出格式：throw new Error('ahk/file: ...')

# 6. 代码风格与维护

- 代码必须严格遵循 [`eslint.config.mjs`](eslint.config.mjs:1) 配置，提交前需通过 eslint 检查
- 结构、核心、配置变更后需同步更新本概要
- 每个源文件（不含空行和注释）不得超过90行，超出需拆分

# 7. 兼容性与限制

- 不支持：可选链、getter/setter、NaN/null/undefined（仅底层类型识别）、完整 import/export、npm 生态仅支持 main 字段
- 隐式返回已实现常见场景，复杂分支/嵌套下行为可能不同

# EOF
