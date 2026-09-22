import { ErrorType, TranspileError } from '../utils/error.js'

import type { Context } from '../types/index.js'

const main = (ctx: Context) => {
  const { content, scope, type } = ctx

  if (['loop', 'while', 'until'].includes(type)) {
    // `x++ while c` / `x++ until c` emit a mid-line keyword — AHK loops are
    // statement-only, so postfix forms would silently glue garbage output
    const prev = content.at(-1)
    if (prev && prev.type !== 'new-line' && !prev.is('edge', 'block-start')) {
      throw new TranspileError(
        ctx,
        ErrorType.UNSUPPORTED,
        `postfix '${type}' is not supported`,
        `Rewrite as a statement-level ${type} loop`,
      )
    }
  }

  if (type === 'loop') {
    scope.next = 'while'
    content.push(
      { type: 'while', value: 'while' },
      { type: 'edge', value: 'expression-start' },
      { type: 'boolean', value: 'true' },
    )
    return true
  }

  if (type === 'while') {
    scope.next = 'while'
    content.push({ type: 'while', value: 'while' }, { type: 'edge', value: 'expression-start' })
    return true
  }

  if (type === 'until') {
    scope.next = 'while'
    content.push(
      { type: 'while', value: 'while' },
      { type: 'logical-operator', value: '!' },
      { type: 'edge', value: 'expression-start' },
    )
    return true
  }

  return false
}

export default main
