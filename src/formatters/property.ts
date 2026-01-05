import { ErrorType, TranspileError } from '../utils/error.js'

import type { Context } from '../types'

const main = (ctx: Context): boolean => {
  const { content, type, value, scope } = ctx

  if (type === '.') {
    content.push({ type: '.', value: '.' })
    return true
  }

  if (type === 'index_start') {
    if (content.at(-1)?.type === '.') content.pop()
    content.push({ type: 'edge', value: 'index-start' })
    return true
  }

  if (type === 'index_end') {
    content.push({ type: 'edge', value: 'index-end' })
    return true
  }

  if (type === 'property') {
    const lastType = content.at(-1)?.type

    // Invalid: `this.prop` in constructor params → AHK can't handle it
    if (
      lastType === 'this' &&
      scope.includes('class') &&
      scope.includes('parameter')
    ) {
      throw new TranspileError(
        ctx,
        ErrorType.SYNTAX_ERROR,
        `'this.${value}' in constructor parameters creates invalid AHK syntax`,
        `Use 'constructor: (name) -> @name = name' instead`,
      )
    }

    if (lastType && ['prototype', 'this'].includes(lastType))
      content.push({ type: '.', value: '.' })
    content.push({ type: 'property', value })
    return true
  }

  return false
}

export default main
