import { TranspileError } from '../utils/error.js'

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
      'forbidden',
      `token type '${type}' is not supported in CoffeeScript→AHK transpilation.`,
    )
  }

  if (type === 'post_if') {
    throw new TranspileError(
      ctx,
      'forbidden',
      `post-if syntax is not supported. Use standard if/else.`,
    )
  }

  // Relation operators: only instanceof is supported, not 'in'
  if (type === 'relation') {
    const { value } = ctx
    if (value === 'in') {
      throw new TranspileError(
        ctx,
        'forbidden',
        `'in' operator is not supported. Use 'for...in' for iteration.`,
      )
    }
  }

  // async/await is not supported in AHK
  if (type === 'await') {
    throw new TranspileError(
      ctx,
      'unsupported',
      `'await' is not supported. AHK v1 has no async/await support.`,
    )
  }

  // Generator/yield is not supported in AHK
  if (type === 'yield') {
    throw new TranspileError(
      ctx,
      'unsupported',
      `'yield' is not supported. AHK v1 has no generator support.`,
    )
  }

  return false
}

export default main
