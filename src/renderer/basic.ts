import { toFullWidth } from '../utils/full-width.js'

import type { RenderContext } from '../types/index.js'

export const commaLike = (ctx: RenderContext) => {
  const { i, it } = ctx
  const next = ctx.content.at(i + 1)
  if (!next?.is('new-line')) return `${it.value} `
  return it.value
}

export const renderLogicalOperator = (ctx: RenderContext): string => {
  const { value } = ctx.it
  return ['&&', '||'].includes(value) ? ` ${value} ` : value
}

export const renderNegative = (ctx: RenderContext): string => {
  const { value } = ctx.it
  return value === '-' ? value : ''
}

export const renderNewLine = (ctx: RenderContext): string => {
  let n = parseInt(ctx.it.value, 10)
  if (n < 0) n = 0
  return `\n${' '.repeat(n * 2)}`
}

export const renderSign = (ctx: RenderContext): string => {
  const { i, it } = ctx
  const { value } = it

  // Handle ternary operator
  if (value === '?') return ' ? '

  // Distinguish ternary ':' from object literal ':'
  if (value === ':') {
    // Look backward for '?' to detect ternary context
    for (let j = i - 1; j >= 0; j--) {
      const prev = ctx.content.at(j)
      if (!prev) break
      if (prev.type === 'sign' && prev.value === '?') return ' : '
      // Stop at statement boundaries
      if (prev.type === 'new-line' || prev.type === 'edge') break
    }
    // Object literal context
    return commaLike(ctx)
  }

  if (value === ',') return commaLike(ctx)
  if (value === '=') return ' := '
  if (value === '...') return '*'
  return value
}

export const renderStatement = (ctx: RenderContext): string => {
  const { value } = ctx.it
  if (value === 'export') return 'return '
  if (value === 'extends') return ' extends '
  if (['new', 'return', 'throw'].includes(value)) return commaLike(ctx)
  return ctx.it.value
}

export const renderIdentifier = (ctx: RenderContext): string => {
  const { value } = ctx.it
  // 仅对 class 名称的大写字母做全角替换
  if (ctx.cache.classNames.has(value)) return toFullWidth(value)
  return value
}
