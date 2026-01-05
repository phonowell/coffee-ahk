import { ErrorType, TranspileError } from '../utils/error.js'

import type { Context } from '../types'

const listForbidden = [
  '..',
  '?',
  '?.',
  'bin?',
  // 'export',
  'from',
  'func_exist',
  'import',
  // Unsigned right shift - not supported in AHK
  '>>>',
]

const main = (ctx: Context) => {
  const { type } = ctx

  if (listForbidden.includes(type)) {
    throw new TranspileError(
      ctx,
      ErrorType.FORBIDDEN,
      `token type '${type}' is not supported in CoffeeScript→AHK transpilation.`,
    )
  }

  if (type === 'post_if') {
    throw new TranspileError(
      ctx,
      ErrorType.FORBIDDEN,
      `post-if syntax is not supported`,
      `Use standard if/else blocks`,
    )
  }

  // Relation operators: only instanceof is supported, not 'in'
  if (type === 'relation') {
    const { value } = ctx
    if (value === 'in') {
      throw new TranspileError(
        ctx,
        ErrorType.FORBIDDEN,
        `'in' operator is not supported`,
        `Use 'for...in' for iteration`,
      )
    }
  }

  // async/await is not supported in AHK
  if (type === 'await') {
    throw new TranspileError(
      ctx,
      ErrorType.UNSUPPORTED,
      `'await' is not supported - AHK v1 has no async/await support`,
      `Refactor to use synchronous code or callbacks`,
    )
  }

  // Generator/yield is not supported in AHK
  if (type === 'yield') {
    throw new TranspileError(
      ctx,
      ErrorType.UNSUPPORTED,
      `'yield' is not supported - AHK v1 has no generator support`,
      `Refactor to use explicit iteration or return arrays`,
    )
  }

  return false
}

export default main
