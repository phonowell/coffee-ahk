---
name: transpile-debugger
description: 快速调试 CoffeeScript→AHK 转译（执行→展示源码/AST/AHK/错误→对比测试），use when debugging transpilation errors or testing syntax (project)
allowed-tools: Read, Grep, Glob, Write, Bash
---

# Transpile Debugger

快速调试 CoffeeScript→AHK 转译器，展示完整转译流程和错误分析。

## 何时使用

调试转译错误 / 测试新语法 / 验证输出 AHK / 对比现有测试案例时

**效率优先**：直接使用 Read/Grep/Glob/Write/Bash 工具，避免调用 Task 工具

**协同 skill**：**被 `formatter-creator` / `processor-creator` / `test-creator` skill 调用用于调试**，也可独立使用

## 核心原则

快速反馈 · 完整展示（源码→AST→AHK→错误） · 智能对比 · 利用上下文节省 tokens

## 工作流程

### 1. 接收输入

**支持格式**：
- **代码片段**：直接提供 CoffeeScript 代码
- **文件路径**：现有 `.coffee` 文件路径
- **测试名称**：引用 `script/test/<name>.coffee`

**默认配置**：
- 盐值：`salt: 'test'`（调试用，区别于测试的 `salt: 'ahk'`）
- AST：默认显示（可选关闭）
- 元数据：默认关闭

### 2. 准备转译环境

**检查构建状态**：
```bash
# 检查 dist/index.js 是否最新
stat -f "%m" dist/index.js src/**/*.ts
```

**自动重构建**：
- 如果源码比 dist 新：提示 `正在重新构建...` + 执行 `pnpm build`
- 否则跳过构建（节省时间）

**创建临时文件**（代码片段场景）：
```bash
# 写入 /tmp/debug-transpile.coffee
```

### 3. 执行转译

**命令**：
```bash
node -e "require('./dist/index.js').default('/tmp/debug-transpile.coffee', { salt: 'test', ast: true, metadata: false }).then(result => console.log(JSON.stringify(result, null, 2)))"
```

**捕获输出**：
- 成功：获取 AHK 代码和 AST
- 失败：捕获错误信息和堆栈

### 4. 展示结果

**成功场景**：

```
=== CoffeeScript 源码 ===
<source code>

=== AST（部分关键节点）===
<formatted AST highlights>

=== 生成的 AHK ===
<generated AHK code>

=== 转译信息 ===
- 函数数量：<count>
- 闭包变量：<ctx vars>
- 特殊处理：<notes>
```

**失败场景**：

```
❌ 转译失败

=== CoffeeScript 源码 ===
<source code>

=== 错误信息 ===
<error message>

=== 可能原因 ===
- 不支持的语法（如 `import * as`、`export const`）
- 禁用字冲突（检查 data/forbidden.yaml）
- Formatter/Processor 错误

=== 相关文件 ===
<list related formatters/processors based on error>
```

### 5. 智能对比

**查找相似测试**：
```bash
# Grep script/test/ 查找相似语法
grep -l "<keyword>" script/test/*.coffee
```

**对比展示**：
```
=== 相似测试案例 ===
script/test/array.coffee - 数组解构语法
script/test/typeof.coffee - typeof 处理

提示：可以对比这些测试的 .ahk 输出了解预期行为
```

### 6. 调试建议

**基于错误类型提供建议**：

| 错误类型 | 建议 |
|---------|------|
| `Unexpected token` | 检查 Formatter 是否覆盖该 token 类型 |
| `Forbidden identifier` | 查看 data/forbidden.yaml，使用其他变量名 |
| `Cannot read property` | Processor 顺序错误或 Item 结构问题 |
| `Maximum call stack` | 递归处理错误，检查 Processor 逻辑 |
| 生成 AHK 语法错误 | Renderer 问题，检查 src/renderer/ |

**相关文件提示**：
- 基于错误堆栈追踪到具体文件
- 列出可能相关的 Formatter/Processor

### 7. 快捷命令

**仅转译**：
```bash
node -e "require('./dist/index.js').default('<file>', { salt: 'test' }).then(console.log)"
```

**查看 AST**：
```bash
node -e "require('./dist/index.js').default('<file>', { salt: 'test', ast: true }).then(r => console.log(JSON.stringify(r, null, 2)))"
```

**对比测试**：
```bash
pnpm test -- <name>  # 运行特定测试
diff script/test/<name>.ahk /tmp/debug-transpile.ahk  # 对比输出
```

## 使用示例

**示例 1：调试代码片段**

输入：
```coffee
x = typeof y
```

输出：
```
=== 生成的 AHK ===
ℓtype := ""
x := (IsObject(y) ? "object" : (ℓtype := Type(y)) == "Integer" || ℓtype == "Float" ? "number" : ℓtype == "String" ? "string" : "undefined")

=== 相似测试 ===
script/test/typeof.coffee
```

**示例 2：转译失败**

输入：
```coffee
import * as utils from './utils'
```

输出：
```
❌ 转译失败

错误：不支持 `import * as` 语法
参考：CLAUDE.md:40 和 src/file/include/source-resolver.ts:46

建议：使用 `import { a, b } from './utils'` 替代
```

## 注意事项

调试用盐值 `salt: 'test'` 区别于测试 `salt: 'ahk'` · 代码片段自动写入 /tmp/ · 不修改源文件 · dist/ 过期自动重构建 · 大型 AST 仅显示关键节点 · 利用上下文已有信息节省 tokens
