---
name: code-refactor
description: 执行 200 行文件限制和项目代码规范检查，use when refactoring code or splitting large files (project)
allowed-tools: Read, Grep, Glob, Edit
---

# Code Refactor

重构 .ts/.tsx 文件，强制执行 200 行限制和项目规范。

## 何时使用

"重构代码" / "优化代码" / "检查规范" / 拆分超 200 行文件 / 代码审查

**效率优先**：直接使用 Read/Glob/Grep 工具，避免调用 Task 工具

**前置建议**：复杂重构先用 `task-confirm` skill 确认目标和范围

## 核心原则

真实 (忠实业务逻辑) · 正确 (类型安全无副作用) · 优雅 (清晰易读) · 最小化 (仅实现必需) · 利用上下文 (节省 tokens)

## 硬性规范

### 文件长度 ≤200 行

排除 `src/api/` 自动生成代码 · 容忍区间 200-220 行需评估 ROI

检查：`find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sh -c 'wc -l "$1" | awk "{if (\$1 > 200) print \$1, \"$1\"}"' _ {} \; | grep -v "src/api/"`

### Hook 依赖数组

遵循 `react-hooks/exhaustive-deps: error`，未使用依赖需 `void` 标记：

```tsx
// ✅ 正确
useEffect(() => {
  void token // 语义依赖未直接使用
  fetchData()
}, [token, fetchData])

// ❌ 错误 - extraDep 未使用也未标记
useEffect(() => console.log(data), [data, extraDep])
```

### 代码风格

- **Early return**: if-return 优先，禁 else-return (`no-else-return`)
- **箭头函数**: `const foo = () => {}` 替代 `function` (`func-style: expression`)
- **花括号**: 单行语句不用 (`curly: multi-or-nest`)
- **类型**: `type` 非 `interface` (`consistent-type-definitions`) + `import type` (`consistent-type-imports`)
- **扩展名**: 必须 `.js` (`import/extensions: always`)

### 项目工具

样式: Stylus `$bgi` `$size` `$ellipsis` ([basic.styl](src/includes/basic.styl)) · 状态: `useAtom` `useApi` · 埋点: `sendStat` · 类名: `.area-*` `.float-*` `.part-*` ([fn.styl](src/includes/fn.styl))

## 工作流程

### 1. 识别超限

Glob 查找 `**/*.{ts,tsx}` + Bash 计算行数（排除 `src/api/`）

### 2. ROI 评估

220+ 行必拆 · 200-220 行：明显职责分离 → 拆；高内聚或成本 > 收益 → 保持

### 3. 执行拆分

Read 识别职责边界（子组件/Hook/常量/类型） → 拆分到独立文件 → Edit 更新导入（带 `.js`） → 验证 `pnpm exec eslint --fix && pnpm exec tsc`

### 4. 验证清单

- [ ] 超 220 行已拆分
- [ ] `pnpm exec tsc` 通过
- [ ] 导入带 `.js`
- [ ] Hook 依赖完整或 `void` 标记
- [ ] 箭头函数 + 无 else-return

## 快速命令

```bash
# 检查超限
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sh -c 'wc -l "$1" | awk "{if (\$1 > 200) print \$1, \"$1\"}"' _ {} \; | grep -v "src/api/"

# 修复 + 类型检查
pnpm exec eslint --fix src/ && pnpm exec tsc
```

## 注意事项

仅重构 `.ts` `.tsx` · 不检查 `src/api/` · 更新所有导入路径 · 一次一个文件 · 用 `pnpm exec tsc` 非 build
