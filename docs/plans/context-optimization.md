# 转译器上下文系统优化计划

## 1. 计划概述

**目标**：提高转译器的可维护性、可靠性、性能和开发体验
**策略**：高ROI优先，实施成本低、收益显著的优化
**受众**：AI Agent，需要明确的任务描述、技术细节和验收标准

## 2. 优化任务列表

| 任务ID | 任务名称 | 优先级 | 实施成本 | 预期收益 | 状态 |
|--------|----------|--------|----------|----------|------|
| T1 | 格式化器处理顺序稳定化 | 高 | 低 | 转译结果一致性提高 | 待处理 |
| T2 | 格式化器匹配效率优化 | 高 | 低 | 转译性能提升30%-50% | 待处理 |
| T3 | 错误处理增强 | 高 | 低 | 调试效率显著改善 | 待处理 |
| T4 | 核心逻辑测试覆盖提升 | 中 | 中 | 回归bug减少 | 待处理 |

## 3. 详细任务描述

### T1: 格式化器处理顺序稳定化

#### 问题描述
当前格式化器处理顺序依赖于`Object.keys()`的遍历结果，在不同JavaScript引擎中可能不一致，导致转译结果不稳定。

#### 技术细节
- **当前实现**：`src/formatters/index.ts`中通过`Object.keys(formattersMap)`遍历调用格式化器
- **依赖**：JavaScript引擎的`Object.keys()`实现
- **风险**：转译结果在不同环境下可能不一致

#### 解决方案
1. 使用固定顺序的数组定义格式化器处理顺序
2. 确保comment格式化器始终最后执行

#### 实施步骤
1. 打开`src/formatters/index.ts`文件
2. 定义固定顺序的格式化器数组`formatterOrder`，包含所有格式化器名称
3. 替换当前的`Object.keys()`遍历逻辑，使用`formatterOrder`数组
4. 确保comment格式化器在所有其他格式化器执行完毕后执行
5. 运行现有测试套件，验证转译结果一致

#### 代码示例
```typescript
// 原代码（需要替换）
for (const key of Object.keys(
  formattersMap,
) as (keyof typeof formattersMap)[]) {
  if (key === 'comment') continue
  if (formattersMap[key](context)) break
}

formattersMap.comment(context)

// 新代码
const formatterOrder = [
  'new-line',
  'alias',
  'array',
  'boolean',
  'bracket',
  'class',
  'do',
  'for',
  'forbidden',
  'function',
  'if',
  'indent',
  'identifier',
  'module',
  'native',
  'nil',
  'number',
  'object',
  'operator',
  'property',
  'sign',
  'statement',
  'string',
  'switch',
  'try',
  'while',
] as const

for (const key of formatterOrder) {
  if (formattersMap[key](context)) break
}

// 始终最后处理注释
formattersMap.comment(context)
```

#### 验收标准
1. 代码成功编译，无语法错误
2. 现有测试套件全部通过
3. 转译结果在不同JavaScript引擎下保持一致
4. 格式化器按预期顺序执行

### T2: 格式化器匹配效率优化

#### 问题描述
当前对每个token调用所有格式化器，直到找到匹配的，时间复杂度为O(n*m)（n为token数量，m为格式化器数量），在大型文件处理时性能较差。

#### 技术细节
- **当前实现**：对每个token遍历所有格式化器，直到找到匹配的
- **性能瓶颈**：不必要的函数调用和条件判断
- **优化空间**：基于token类型过滤格式化器，减少函数调用次数

#### 解决方案
1. 基于token类型建立格式化器映射表
2. 只调用与当前token类型相关的格式化器

#### 实施步骤
1. 打开`src/formatters/index.ts`文件
2. 定义`typeFormatterMap`对象，建立token类型到格式化器的映射关系
3. 在`processFormatters`函数中，根据当前token类型只调用相关格式化器
4. 运行现有测试套件，验证转译结果正确
5. 进行性能测试，验证性能提升

#### 代码示例
```typescript
// 新增：token类型到格式化器的映射
const typeFormatterMap = {
  'IDENTIFIER': ['identifier', 'alias', 'function'],
  'STRING': ['string'],
  'NUMBER': ['number'],
  'BOOLEAN': ['boolean'],
  'NIL': ['nil'],
  'ARRAY': ['array'],
  'OBJECT': ['object'],
  'FUNCTION': ['function'],
  'CLASS': ['class'],
  'IF': ['if'],
  'FOR': ['for'],
  'WHILE': ['while'],
  'SWITCH': ['switch'],
  'TRY': ['try'],
  'OPERATOR': ['operator'],
  'PROPERTY': ['property'],
  'BRACKET': ['bracket'],
  'STATEMENT': ['statement'],
  'DO': ['do'],
  'SIGN': ['sign'],
  'NATIVE': ['native'],
  'MODULE': ['module'],
} as const

// 替换原有的遍历逻辑
const applicableFormatters = typeFormatterMap[context.type as keyof typeof typeFormatterMap] || formatterOrder
for (const key of applicableFormatters) {
  if (formattersMap[key](context)) break
}
```

#### 验收标准
1. 代码成功编译，无语法错误
2. 现有测试套件全部通过
3. 转译性能提升30%以上
4. 转译结果与优化前保持一致

### T3: 错误处理增强

#### 问题描述
当前错误信息不够详细，仅包含行号和基本描述，调试困难。

#### 技术细节
- **当前实现**：`src/utils/error.ts`中`TranspileError`类仅包含行号和错误类型
- **缺失信息**：token类型、当前作用域、上下文等
- **影响**：开发者难以定位和修复问题

#### 解决方案
1. 扩展`TranspileError`类，添加更多上下文信息
2. 实现错误码系统，便于分类和定位问题

#### 实施步骤
1. 打开`src/utils/error.ts`文件
2. 扩展`TranspileError`类，添加token类型、作用域等上下文信息
3. 实现错误码系统，为不同类型的错误分配唯一错误码
4. 更新所有使用`TranspileError`的地方，传递完整的上下文信息
5. 运行现有测试套件，验证错误处理正常

#### 代码示例
```typescript
// 原代码
class TranspileError extends Error {
  constructor(ctx: Pick<Context, 'token'>, type: string, message: string) {
    const line = ctx.token[2].first_line + 1
    super(`Coffee-AHK/${type} (line ${line}): ${message}`)
    this.name = 'TranspileError'
  }
}

// 新代码
class EnhancedTranspileError extends Error {
  constructor(
    ctx: Context,
    type: string,
    message: string,
    public code: string
  ) {
    const tokenType = ctx.token[0]
    const scopeInfo = ctx.scope.toArray().join(', ')
    const line = ctx.token[2].first_line + 1
    // 生成更详细的错误信息
    super(`Coffee-AHK/${type}/${code} (line ${line}, token: ${tokenType}, scope: [${scopeInfo}]): ${message}`)
    this.name = 'EnhancedTranspileError'
  }
}
```

#### 验收标准
1. 代码成功编译，无语法错误
2. 现有测试套件全部通过
3. 错误信息包含token类型、作用域和错误码
4. 错误定位效率显著提高

### T4: 核心逻辑测试覆盖提升

#### 问题描述
当前单元测试主要覆盖基础模型（Item、Content、Scope），对核心转译逻辑（格式化器、处理器）的测试不足，导致回归bug风险较高。

#### 技术细节
- **当前测试**：`tasks/test/unit.ts`中仅包含基础模型测试
- **缺失测试**：格式化器测试、处理器测试、集成测试
- **风险**：核心逻辑变更可能引入回归bug

#### 解决方案
1. 为核心格式化器添加单元测试
2. 为核心处理器添加单元测试
3. 实现基本集成测试

#### 实施步骤
1. 在`tasks/test/`目录下创建`formatters.test.ts`文件
2. 为核心格式化器（identifier、function、class等）添加单元测试
3. 在`tasks/test/`目录下创建`processors.test.ts`文件
4. 为核心处理器（functionProcessor、arrayProcessor等）添加单元测试
5. 在`tasks/test/`目录下创建`integration.test.ts`文件
6. 实现基本集成测试，测试完整转译流程
7. 运行所有测试，确保测试通过

#### 代码示例
```typescript
// 格式化器单元测试示例
import identifierFormatter from '../../src/formatters/identifier.js'
import Context from '../../src/types/Context.js'

// 创建测试上下文的辅助函数
const createTestContext = (overrides: Partial<Context>): Context => {
  // 实现上下文创建逻辑
  // ...
}

describe('identifierFormatter', () => {
  it('should format simple identifier', () => {
    const context = createTestContext({
      token: ['IDENTIFIER', 'test', { first_line: 0, first_column: 0, last_line: 0, last_column: 4 }],
      type: 'identifier',
      value: 'test'
    })

    const result = identifierFormatter(context)

    expect(result).toBe(true)
    expect(context.content.toArray()).toHaveLength(1)
    expect(context.content.at(0)?.type).toBe('identifier')
    expect(context.content.at(0)?.value).toBe('test')
  })
})
```

#### 验收标准
1. 代码成功编译，无语法错误
2. 所有测试通过
3. 核心格式化器测试覆盖率达到80%以上
4. 核心处理器测试覆盖率达到60%以上
5. 集成测试覆盖主要转译场景

## 4. 实施流程

### 阶段1：快速优化（预计1周）
1. 执行T1：格式化器处理顺序稳定化
2. 执行T2：格式化器匹配效率优化
3. 执行T3：错误处理增强
4. 验证所有测试通过

### 阶段2：核心测试覆盖（预计2周）
1. 执行T4：核心逻辑测试覆盖提升
2. 验证所有测试通过
3. 进行性能测试，验证性能提升

## 5. 技术规范

### 代码规范
- 遵循项目现有的TypeScript代码规范
- 使用ES模块语法
- 确保类型安全，避免使用`any`类型
- 添加必要的注释和文档

### 测试规范
- 使用Jest或项目现有的测试框架
- 测试用例应包含正常情况和边界情况
- 测试结果应可重复、可验证
- 测试覆盖核心功能和关键路径

### 性能测试规范
- 测试样本应包含不同大小的CoffeeScript文件
- 记录优化前后的转译时间
- 性能提升应达到预期目标（30%-50%）

## 6. 验收流程

1. **代码审查**：确保代码符合项目规范和技术要求
2. **测试验证**：所有测试套件通过
3. **性能测试**：性能提升达到预期目标
4. **转译结果验证**：转译结果与优化前保持一致
5. **文档更新**：相关文档已更新

## 7. 风险评估

| 风险 | 影响 | 缓解措施 | 负责人 |
|------|------|----------|--------|
| 格式化器匹配逻辑变更导致漏处理 | 转译结果不完整 | 完善测试覆盖，特别是边界情况 | AI Agent |
| 错误处理增强导致性能下降 | 转译性能降低 | 确保错误处理逻辑高效，仅在错误发生时执行 | AI Agent |
| 测试编写工作量大 | 延迟交付 | 优先测试核心功能，逐步扩展测试覆盖 | AI Agent |

## 8. 依赖关系

| 任务 | 依赖任务 | 依赖类型 |
|------|----------|----------|
| T2 | T1 | 顺序依赖：必须先稳定格式化器顺序，才能优化匹配效率 |
| T3 | 无 | 独立任务 |
| T4 | T1, T2, T3 | 顺序依赖：必须先完成优化，才能添加测试 |

## 9. 交付物

1. 优化后的源代码
2. 新增的测试用例
3. 性能测试报告
4. 更新后的文档

## 10. 后续维护

1. 定期运行测试套件，确保优化效果持续
2. 根据需要扩展测试覆盖范围
3. 监控转译性能，及时发现并解决性能问题
4. 定期更新错误码系统，适应新的错误类型

## 11. 结论

本优化计划采用高ROI优先原则，聚焦于实施成本低、收益显著的优化点。通过实施这些优化，可以显著提高转译器的性能、可维护性和可靠性，同时改善开发体验。计划结构清晰，任务明确，技术细节详细，适合AI Agent执行。