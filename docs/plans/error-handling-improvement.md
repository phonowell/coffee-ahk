# Coffee-AHK 转译器报错功能改进计划

## 1. 计划概述

**目标**：增强转译器的错误处理能力，提供更清晰、更有用的错误信息
**策略**：统一错误处理入口，标准化错误格式，提供准确的行号和上下文信息
**受众**：AI Agent，需要明确的任务描述、技术细节和验收标准

## 2. 改进目标

- 所有报错均汇总并统一入口
- 报错的行号和列号准确
- 报错时提供清晰的英文信息和可行的解决方案
- 报错时显示上下共5行代码上下文

## 3. 优化任务列表

| 任务ID | 任务名称 | 优先级 | 实施成本 | 预期收益 | 状态 |
|--------|----------|--------|----------|----------|------|
| E1 | 增强错误类型枚举和错误处理类 | 高 | 低 | 统一错误类型，标准化错误格式 | 待处理 |
| E2 | 优化错误上下文显示 | 高 | 低 | 提供更清晰的代码上下文，便于调试 | 待处理 |
| E3 | 更新核心模块报错点 | 中 | 中 | 统一所有错误信息格式和解决方案 | 待处理 |

   ```typescript
   export enum ErrorType {
     FILE_ERROR = "file-error",
     SYNTAX_ERROR = "syntax-error",
     FORBIDDEN = "forbidden",
     CLASS_ERROR = "class-error",
     FUNCTION_ERROR = "function-error",
     VARIABLE_ERROR = "variable-error",
     OPERATOR_ERROR = "operator-error",
   }
   ```

2. **增强 TranspileError 类**

   ```typescript
   export class TranspileError extends Error {
     public readonly type: ErrorType;

     constructor(
       ctx: Pick<Context, "token">,
       type: ErrorType,
       message: string,
       public readonly solution?: string
     ) {
       const line = ctx.token[2].first_line + 1;
       const column = ctx.token[2].first_column + 1;

       let fullMessage = `Coffee-AHK/${type} (line ${line}, column ${column}): ${message}`;
       if (solution) fullMessage += `\nSolution: ${solution}`;

       super(fullMessage);
       this.name = "TranspileError";
     }
   }
   ```

3. **更新 createTranspileError 函数**
   ```typescript
   export const createTranspileError = (
     type: ErrorType,
     message: string,
     solution?: string
   ): Error => {
     let fullMessage = `Coffee-AHK/${type}: ${message}`;
     if (solution) fullMessage += `\nSolution: ${solution}`;
     return new Error(fullMessage);
   };
   ```

### 3.2 修改 src/index.ts

**目标**：添加统一的报错处理入口，优化错误上下文显示

**修改内容**：

1. **优化 showSourceContext 函数**
   - 增强可读性，优化显示格式
   - 确保显示上下各2行，共5行代码
   - 优化行号和代码内容的对齐方式

2. **增强错误捕获和处理**
   - 优化 `rethrowWithContext` 函数，确保错误信息完整
   - 增强错误信息的可读性，添加分隔线和视觉标识
   - 确保错误行号准确显示

### 3.3 更新所有报错点

**目标**：确保所有错误信息都包含明确的解决方案，统一使用 ErrorType 枚举

**修改范围**：

- src/formatters/ 目录下的所有文件
- src/processors/ 目录下的所有文件
- src/renderer/ 目录下的所有文件
- src/file/ 目录下的所有文件

**修改内容**：

1. **将字符串错误类型替换为 ErrorType 枚举**

   ```typescript
   // 旧代码
   throw new TranspileError(
     ctx,
     "forbidden",
     "spread operator is only allowed in function calls"
   );

   // 新代码
   throw new TranspileError(
     ctx,
     ErrorType.FORBIDDEN,
     "spread operator is only allowed in function calls",
     "Please use spread operator only in function calls or parameter lists"
   );
   ```

2. **为所有错误添加解决方案**
   - 确保每个错误都有明确的解决方案建议
   - 解决方案要具体、可行，提供直接的修复指导

3. **标准化错误信息格式**
   - 错误信息应包含：具体问题、相关上下文
   - 解决方案应包含：修复建议、最佳实践
   - 保持错误信息简洁明了，避免冗余

## 4. 预期效果

### 4.1 统一的错误格式

```
Coffee-AHK/forbidden (line 10): spread operator '...' is only allowed in function calls or parameter lists
Solution: Please use spread operator only in function calls or parameter lists
```

### 4.2 错误上下文显示

```
📍 source.coffee:10
  8 | function test() {
  9 |   const arr = [1, 2, 3]
→10 |   const newArr = [...arr, 4]
 11 |   return newArr
 12 | }
```

## 5. 测试计划

1. **核心功能测试**：
   - 测试 `TranspileError` 类的基本功能和格式化
   - 测试错误上下文显示的准确性
   - 测试解决方案的显示效果

2. **集成测试**：
   - 测试完整转译流程中的错误处理
   - 测试不同类型错误的显示效果

3. **边界测试**：
   - 测试极端情况下的错误处理（如超长行、空文件）

## 6. 实施步骤

1. **第一步**：修改 src/utils/error.ts，实现增强的错误处理类和核心 ErrorType 枚举
2. **第二步**：修改 src/index.ts，优化错误上下文显示
3. **第三步**：更新核心模块的报错点，统一使用新的错误类型和格式
4. **第四步**：测试核心功能，确保基本功能正常

## 7. 风险评估

- **风险**：修改大量文件可能导致引入新的错误
  **缓解措施**：采用分批更新策略，先处理核心模块，再处理其他模块

- **风险**：错误信息的标准化可能导致某些错误信息不够具体
  **缓解措施**：在标准化的同时，保留足够的上下文信息

- **风险**：解决方案的准确性可能不足
  **缓解措施**：参考类似转译器的最佳实践，确保解决方案的可行性

## 8. 结论

通过以上改进，Coffee-AHK 转译器的报错功能将得到显著增强，提供更清晰、更有用的错误信息，帮助开发者更快地定位和修复问题。

4. 行号和代码内容对齐方式良好
5. 支持导入/包含文件的错误上下文显示

### E3: 更新核心模块报错点

#### 问题描述
当前不同模块的报错点使用不同的错误类型和格式，缺少统一标准，且部分错误信息缺少解决方案。

#### 技术细节
- **修改范围**：`src/formatters/`、`src/processors/`、`src/renderer/`、`src/file/`目录下的所有文件
- **依赖**：`ErrorType`枚举、`TranspileError`类
- **风险**：修改大量文件可能导致引入新的错误

#### 解决方案
1. 将字符串错误类型替换为`ErrorType`枚举
2. 为所有错误添加具体的解决方案
3. 标准化错误信息格式

#### 实施步骤
1. 遍历所有需要修改的文件
2. 将字符串错误类型替换为`ErrorType`枚举
3. 为每个错误添加明确的解决方案
4. 确保错误信息格式统一
5. 运行现有测试套件，验证错误信息正确

#### 代码示例
```typescript
// 旧代码
throw new TranspileError(ctx, 'forbidden', 'spread operator is only allowed in function calls')

// 新代码
throw new TranspileError(
  ctx,
  ErrorType.FORBIDDEN,
  'spread operator is only allowed in function calls',
  'Please use spread operator only in function calls or parameter lists'
)
```

#### 验收标准
1. 所有报错点使用`ErrorType`枚举
2. 所有错误都有明确的解决方案
3. 错误信息格式统一，包含错误类型、行号、列号、错误描述和解决方案
4. 现有测试套件全部通过

### E4: 测试错误处理功能

#### 问题描述
当前缺少对错误处理功能的专门测试，无法确保错误处理功能正常工作。

#### 技术细节
- **当前测试**：现有测试套件主要测试转译功能，缺少错误处理测试
- **依赖**：测试框架（如Jest）
- **风险**：错误处理功能存在bug，影响开发体验

#### 解决方案
1. 编写`TranspileError`类的单元测试
2. 测试错误上下文显示功能
3. 测试不同类型错误的显示效果

#### 实施步骤
1. 在`tasks/test/`目录下创建`error-handling.test.ts`文件
2. 编写`TranspileError`类的单元测试
3. 编写错误上下文显示功能的测试
4. 测试不同类型错误的显示效果
5. 运行所有测试，确保测试通过

#### 代码示例
```typescript
// 错误处理单元测试示例
import { TranspileError, ErrorType } from '../../src/utils/error.js'

describe('TranspileError', () => {
  it('should format error message correctly', () => {
    const ctx = {
      token: ['IDENTIFIER', 'test', { first_line: 4, first_column: 2, last_line: 4, last_column: 6 }]
    }
    const error = new TranspileError(
      ctx,
      ErrorType.SYNTAX_ERROR,
      'Invalid syntax',
      'Check your syntax and try again'
    )

    expect(error.message).toContain('Coffee-AHK/syntax-error (line 5, column 3)')
    expect(error.message).toContain('Invalid syntax')
    expect(error.message).toContain('Solution: Check your syntax and try again')
    expect(error.name).toBe('TranspileError')
    expect(error.type).toBe(ErrorType.SYNTAX_ERROR)
  })
})
```

#### 验收标准
1. 所有错误处理测试通过
2. 测试覆盖不同类型的错误
3. 测试覆盖错误上下文显示功能
4. 测试覆盖解决方案显示功能

## 4. 实施流程

### 阶段1：核心错误处理增强（预计1周）
1. 执行E1：增强错误类型枚举和错误处理类
2. 执行E2：优化错误上下文显示
3. 验证核心功能正常

### 阶段2：错误信息标准化（预计2周）
1. 执行E3：更新核心模块报错点
2. 分批更新各个模块的报错点
3. 验证所有模块的错误信息格式统一

### 阶段3：测试和验证（预计1周）
1. 执行E4：测试错误处理功能
2. 运行所有测试套件，确保测试通过
3. 进行手动测试，验证错误信息显示效果

## 5. 技术规范

### 代码规范
- 遵循项目现有的TypeScript代码规范
- 使用ES模块语法
- 错误类型枚举使用大写蛇形命名法
- 错误信息使用清晰、简洁的英文
- 解决方案提供具体、可行的建议

### 测试规范
- 使用项目现有的测试框架
- 测试用例包含正常情况和边界情况
- 测试覆盖不同类型的错误
- 测试结果可重复、可验证

## 6. 验收流程

1. **代码审查**：确保代码符合项目规范和技术要求
2. **测试验证**：所有测试套件通过
3. **功能验证**：手动测试错误处理功能，验证错误信息显示效果
4. **转译结果验证**：确保正常转译功能不受影响

## 7. 风险评估

| 风险 | 影响 | 缓解措施 | 负责人 |
|------|------|----------|--------|
| 修改大量文件导致引入新错误 | 转译功能异常 | 采用分批更新策略，先处理核心模块，再处理其他模块 | AI Agent |
| 错误信息标准化导致某些错误信息不够具体 | 调试效率降低 | 在标准化的同时，保留足够的上下文信息 | AI Agent |
| 解决方案的准确性不足 | 误导开发者 | 参考类似转译器的最佳实践，确保解决方案的可行性 | AI Agent |

## 8. 依赖关系

| 任务 | 依赖任务 | 依赖类型 |
|------|----------|----------|
| E2 | E1 | 顺序依赖：必须先增强错误处理类，才能优化错误上下文显示 |
| E3 | E1 | 顺序依赖：必须先定义ErrorType枚举，才能更新报错点 |
| E4 | E1, E2, E3 | 顺序依赖：必须先完成所有错误处理相关修改，才能进行测试 |

## 9. 交付物

1. 优化后的`src/utils/error.ts`文件
2. 优化后的`src/index.ts`文件
3. 更新后的各个模块报错点
4. 新增的错误处理测试用例
5. 测试报告

## 10. 后续维护

1. 定期更新`ErrorType`枚举，添加新的错误类型
2. 定期审查错误信息和解决方案，确保其准确性和可行性
3. 扩展测试覆盖范围，测试更多边界情况
4. 根据用户反馈，持续优化错误信息和解决方案

## 11. 结论

通过以上改进，Coffee-AHK转译器的错误处理功能将得到显著增强，提供更清晰、更有用的错误信息，帮助开发者更快地定位和修复问题。优化计划结构清晰，任务明确，技术细节详细，适合AI Agent执行。