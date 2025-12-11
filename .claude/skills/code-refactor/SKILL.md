---
name: code-refactor
description: Enforce 200-line file limit and project-specific code patterns for .ts/.tsx files, use when refactoring or reviewing code.
allowed-tools: Read, Grep, Glob, Edit
---

# Code Refactor

帮助自动检查和重构代码,确保符合项目规范。

## 何时使用

- 用户说"重构代码"、"优化代码"、"检查代码规范"
- 用户需要拆分超过 200 行的文件
- 用户需要检查项目中哪些文件超过行数限制
- 代码审查时需要检查是否符合项目约定

## 核心原则

代码必须满足以下四大原则：

1. **真实 (Truthful)**: 代码忠实反映业务逻辑，不过度抽象或过早优化
2. **正确 (Correct)**: 类型安全、无副作用风险、符合预期行为
3. **优雅 (Elegant)**: 清晰易读、结构合理、命名准确
4. **最小化 (Minimal)**: 仅实现必需功能，避免过度设计和冗余代码

## 核心规范

### 1. 文件长度限制

**硬性要求**: 所有源文件不超过 200 行

- **检查命令**: `find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sh -c 'wc -l "$1" | awk "{if (\$1 > 200) print \$1, \"$1\"}"' _ {} \; | grep -v "src/api/"`
- **例外**: `src/api/` 目录下的自动生成代码跳过检查

### 2. Hook 依赖数组规范

依赖项必须与闭包内使用一致 (react-hooks/exhaustive-deps: error):

```tsx
// ✅ 正确 - 依赖项直接使用
useEffect(() => {
  console.log(data)
}, [data])

// ✅ 正确 - 未使用的依赖需用 void 声明
useEffect(() => {
  void unusedDep // 明确标记为语义依赖
  console.log(data)
}, [data, unusedDep])

// ❌ 错误 - 依赖项未使用也未声明
useEffect(() => {
  console.log(data)
}, [data, extraDep])
```

### 3. 代码风格规范

- **条件语句**: 总是优先使用 if-return 风格 (early return)
- **格式化工具**: 使用 `npx eslint --fix` 处理代码样式和格式化
- **函数风格**: 使用箭头函数表达式而非 function 声明
- **花括号**: 单行语句不使用花括号 (`if (foo) return`)

### 4. 项目特定工具

- **样式**: Stylus mixins - `$bgi`, `$size`, `$ellipsis` (见 `src/includes/basic.styl`)
- **状态管理**: `useAtom` (全局) + `useApi` (数据缓存)
- **埋点**: `sendStat` 追踪用户行为
- **外部依赖**: React/ReactDOM 由平台提供,不打包

## 检查流程

### 1. 识别超限文件

使用 Glob 或 Bash 找出所有超过 200 行的文件(排除 `src/api/`):

```bash
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sh -c 'wc -l "$1" | awk "{if (\$1 > 200) print \$1, \"$1\"}"' _ {} \; | grep -v "src/api/"
```

**容忍度**: 200-220 行(+10%)视为可容忍区间,但需评估 ROI

### 2. 轻量化规划

**不需要详细规划**,直接执行:

1. **妥善复用上下文**: 优先使用对话中已读取的文件内容
2. **快速评估**: 仅对 220+ 行文件做详细分析
3. **ROI 判断** (200-220 行):
   - 若有明显的职责分离点 → 直接拆分
   - 若代码高度内聚 → 保持不变
   - 拆分成本 > 维护收益 → 跳过

### 3. 执行拆分

1. 识别职责边界(子组件/Hook/常量/类型)
2. 按职责拆分到独立文件或子目录
3. 更新导入路径
4. 运行 `npx eslint --fix` + `npx tsc --noEmit`

### 4. 验证清单

- [ ] 超过 220 行的文件已拆分
- [ ] TypeScript 检查通过
- [ ] 功能行为保持不变

## 项目特定示例

### if-return 风格示例

总是优先使用 early return (no-else-return: error):

```tsx
// ✅ 正确 - if-return 风格
const processData = (data: Data | null) => {
  if (!data) return null
  if (data.invalid) return null

  return data.value * 2
}

// ❌ 错误 - 嵌套 else
const processData = (data: Data | null) => {
  if (data) {
    if (!data.invalid) {
      return data.value * 2
    } else {
      return null
    }
  } else {
    return null
  }
}
```

### void 依赖声明示例

未在闭包中使用的依赖需用 `void` 声明语义:

```tsx
// token 变化时触发,但闭包中未直接使用 token
useEffect(() => {
  void token // 明确标记为语义依赖
  fetchData() // fetchData 内部使用 token
}, [token, fetchData])
```

## 快速命令

```bash
# 检查所有超限文件
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sh -c 'wc -l "$1" | awk "{if (\$1 > 200) print \$1, \"$1\"}"' _ {} \; | grep -v "src/api/"

# 统计单个文件行数
wc -l src/components/part/Buttons.tsx

# 修复代码风格和格式
npx eslint --fix src/

# TypeScript 语法检查
npx tsc --noEmit
```

## 注意事项

- **文件范围**: 仅重构 `.ts` 和 `.tsx` 文件
- **不检查 `src/api/`**: 自动生成代码跳过重构
- **保持向后兼容**: 更新所有导入路径
- **渐进式重构**: 一次处理一个文件
- **验证工具**: 使用 `npx tsc --noEmit` 而非完整构建
