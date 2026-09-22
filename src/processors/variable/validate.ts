import { createTranspileError, ErrorType } from '../../utils/error.js'
import { getForbiddenReason, isVariableForbidden } from '../../utils/forbidden.js'

import type { Context } from '../../types/index.js'

const checkSimpleAssignment = (ctx: Context, i: number): void => {
  const { content } = ctx
  const item = content.at(i)
  const next = content.at(i + 1)

  if (!item?.is('identifier') || !next?.is('sign', '=')) return

  if (isVariableForbidden(item.value)) {
    throw createTranspileError(
      ErrorType.FORBIDDEN,
      `variable '${item.value}' cannot be used (${getForbiddenReason(item.value)})`,
      `Choose a different variable name`,
    )
  }
}

const checkFunctionParameters = (ctx: Context, i: number): void => {
  const { content } = ctx
  const item = content.at(i)
  const prev = content.at(i - 1)

  if (!item?.is('identifier')) return

  // 检查是否在函数参数列表中
  // 参数要么在 parameter-start 后面，要么在逗号后面（在参数列表内）
  const isAfterParameterStart = prev?.is('edge', 'parameter-start')
  const isAfterCommaInParameters =
    prev?.is('sign', ',') &&
    (() => {
      // 向前查找最近的 edge 标记 —— 无窗口上限，参数列表可任意长
      for (let j = i - 2; j >= 0; j--) {
        const edge = content.at(j)
        if (edge?.is('edge', 'parameter-start')) return true
        if (edge?.is('edge', 'parameter-end')) return false
        if (edge?.type === 'new-line') return false
      }
      return false
    })()

  if (isAfterParameterStart || isAfterCommaInParameters) {
    if (isVariableForbidden(item.value)) {
      throw createTranspileError(
        ErrorType.FORBIDDEN,
        `parameter '${item.value}' cannot be used (${getForbiddenReason(item.value)})`,
        `Choose a different parameter name`,
      )
    }
  }
}

const checkCatchVariable = (ctx: Context, i: number): void => {
  const { content } = ctx
  const item = content.at(i)
  const prev = content.at(i - 1)

  if (!item?.is('identifier')) return
  if (!prev?.is('try', 'catch')) return

  if (isVariableForbidden(item.value)) {
    throw createTranspileError(
      ErrorType.FORBIDDEN,
      `catch variable '${item.value}' cannot be used (${getForbiddenReason(item.value)})`,
      `Choose a different variable name`,
    )
  }
}

const checkForLoopVariables = (ctx: Context, i: number): void => {
  const { content } = ctx
  const item = content.at(i)

  if (!item?.is('for', 'for')) return

  // 收集 'for' 和 'in'/'of' 之间的所有 identifier
  for (let j = i + 1; j < Math.min(i + 20, content.length); j++) {
    const current = content.at(j)
    if (!current) break
    if (current.type === 'for-in') break // 到达 'in' 或 'of'，停止

    if (current.type === 'identifier') {
      if (isVariableForbidden(current.value)) {
        throw createTranspileError(
          ErrorType.FORBIDDEN,
          `for loop variable '${current.value}' cannot be used (${getForbiddenReason(current.value)})`,
          `Choose a different loop variable name`,
        )
      }
    }
  }
}

const checkReservedReads = (ctx: Context, i: number): void => {
  const { content } = ctx
  const item = content.at(i)

  // `arguments`/`eval` arrive as plain identifiers — AHK v1 has neither an
  // arguments object nor eval; bare reads would compile to an empty λ.member
  if (!item?.is('identifier')) return
  if (item.value !== 'arguments' && item.value !== 'eval') return

  throw createTranspileError(
    ErrorType.UNSUPPORTED,
    `'${item.value}' is not supported — AHK v1 has no '${item.value}' equivalent`,
    item.value === 'arguments'
      ? `Use a variadic parameter instead: fn = (args...) -> args`
      : `Precompute the value — AHK cannot evaluate code at runtime`,
  )
}

const checkObjectKeys = (ctx: Context, i: number): void => {
  const { content } = ctx
  const item = content.at(i)

  if (!item?.is('property')) return

  // Only forbid A_ prefix for object keys/class properties
  // Other forbidden names are allowed as they don't pollute global namespace
  // Note: This also handles object destructuring keys like {A_Index: idx}
  // because formatters convert them to 'property' type
  if (item.value.toLowerCase().startsWith('a_')) {
    throw createTranspileError(
      ErrorType.FORBIDDEN,
      `object key or class property '${item.value}' cannot use A_ prefix - reserved for AHK built-in variables`,
      `Rename property to avoid A_ prefix`,
    )
  }
}

const main = (ctx: Context) => {
  const { content } = ctx

  content.toArray().forEach((_, i) => {
    checkSimpleAssignment(ctx, i)
    checkFunctionParameters(ctx, i)
    checkCatchVariable(ctx, i)
    checkForLoopVariables(ctx, i)
    checkReservedReads(ctx, i)
    checkObjectKeys(ctx, i)
  })
}

export default main
