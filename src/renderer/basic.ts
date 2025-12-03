// Basic rendering utilities
import type Item from '../models/Item.js'
import type { Context as Context2 } from '../types'

type Context = Context2 & {
  i: number
  it: Item
}

export const commaLike2 = (ctx: Context) => {
  const { i, it } = ctx
  const next = ctx.content.at(i + 1)
  if (!next?.is('new-line')) return `${it.value} `
  return it.value
}

export const logicalOperator2 = (ctx: Context): string => {
  const { value } = ctx.it
  return ['&&', '||'].includes(value) ? ` ${value} ` : value
}

export const negative2 = (ctx: Context): string => {
  const { value } = ctx.it
  return value === '-' ? value : ''
}

export const newLine2 = (ctx: Context): string => {
  let n = parseInt(ctx.it.value, 10)
  if (n < 0) n = 0
  return `\n${' '.repeat(n * 2)}`
}

export const sign2 = (ctx: Context): string => {
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
    return commaLike2(ctx)
  }

  if (value === ',') return commaLike2(ctx)
  if (value === '=') return ' := '
  if (value === '...') return '*'
  return value
}

export const statement2 = (ctx: Context): string => {
  const { value } = ctx.it
  if (value === 'export') return 'return '
  if (value === 'extends') return ' extends '
  if (['new', 'return', 'throw'].includes(value)) return commaLike2(ctx)
  return ctx.it.value
}
export const identifier2 = (ctx: Context): string => {
  const { value } = ctx.it
  // 仅对 class 名称的大写字母做全角替换
  if (ctx.cache.classNames.has(value)) {
    return value.replace(/[A-Z]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) + 0xfee0),
    )
  }
  return value
}
