// Control flow rendering (if, switch, try)
import type Item from '../models/Item.js'
import type { Context as Context2 } from '../types'

type Context = Context2 & {
  i: number
  it: Item
}

export const if2 = (ctx: Context): string => {
  const { content, i, it } = ctx
  const { value } = it

  if (value === 'case') return 'case '
  if (value === 'default') return 'default'
  if (value === 'else') return ' else'

  if (value === 'if') {
    const prev = content.at(i - 1)
    if (prev?.is('if', 'else')) return ' if '
    return 'if '
  }

  if (value === 'switch') return 'switch '
  return ''
}

export const try2 = (ctx: Context): string => {
  const { content, i, it } = ctx
  const { value } = it

  if (value === 'catch') {
    const next = content.at(i + 1)
    if (next?.is('edge', 'block-start')) return ' catch'
    return ' catch '
  }

  if (value === 'finally') return ' finally'
  if (value === 'try') return 'try'
  return ''
}
