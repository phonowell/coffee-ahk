import { ErrorType, TranspileError } from '../../utils/error.js'
import {
  getForbiddenReason,
  isVariableForbidden,
} from '../../utils/forbidden.js'

import type { Context } from '../../types'

const checkSimpleAssignment = (ctx: Context, i: number): void => {
  const { content } = ctx
  const item = content.at(i)
  const next = content.at(i + 1)

  if (!item?.is('identifier') || !next?.is('sign', '=')) return

  if (isVariableForbidden(item.value)) {
    throw new TranspileError(
      ctx,
      ErrorType.FORBIDDEN,
      `variable '${item.value}' cannot be used (${getForbiddenReason(item.value)})`,
      `Choose a different variable name`,
    )
  }
}

const checkDestructuringAssignment = (ctx: Context, i: number): void => {
  const { content } = ctx
  const item = content.at(i)
  const prev = content.at(i - 1)

  if (!item?.is('identifier')) return

  // 检查是否在数组解构中: [identifier, ...] = ...
  if (!(prev?.is('sign', ',') || prev?.is('bracket', '['))) return

  // 简单检查：向前查找是否有 ] = 模式
  for (let j = i + 1; j < Math.min(i + 10, content.length); j++) {
    const current = content.at(j)
    const nextItem = content.at(j + 1)

    if (current?.is('bracket', ']') && nextItem?.is('sign', '=')) {
      if (isVariableForbidden(item.value)) {
        throw new TranspileError(
          ctx,
          ErrorType.FORBIDDEN,
          `destructuring target '${item.value}' cannot be used (${getForbiddenReason(item.value)})`,
          `Choose a different variable name`,
        )
      }
      break
    }
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
      // 向前查找最近的 edge 标记
      for (let j = i - 2; j >= Math.max(0, i - 10); j--) {
        const edge = content.at(j)
        if (edge?.is('edge', 'parameter-start')) return true
        if (edge?.is('edge', 'parameter-end')) return false
      }
      return false
    })()

  if (isAfterParameterStart || isAfterCommaInParameters) {
    if (isVariableForbidden(item.value)) {
      throw new TranspileError(
        ctx,
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
    throw new TranspileError(
      ctx,
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
        throw new TranspileError(
          ctx,
          ErrorType.FORBIDDEN,
          `for loop variable '${current.value}' cannot be used (${getForbiddenReason(current.value)})`,
          `Choose a different loop variable name`,
        )
      }
    }
  }
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
    throw new TranspileError(
      ctx,
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
    checkDestructuringAssignment(ctx, i)
    checkFunctionParameters(ctx, i)
    checkCatchVariable(ctx, i)
    checkForLoopVariables(ctx, i)
    checkObjectKeys(ctx, i)
  })
}

export default main
