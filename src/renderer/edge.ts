// Edge handling for rendering
import { trim } from 'radash'

import { TranspileError } from '../utils/error.js'

import type Item from '../models/Item.js'
import type { Context as Context2 } from '../types'

type Context = Context2 & {
  i: number
  it: Item
}

const mapEdge: Record<string, string> = {
  'array-end': ']',
  'array-start': '[',
  'block-end': '}',
  'block-start': '{',
  'call-end': ')',
  'call-start': '(',
  'expression-end': ')',
  'expression-start': '(',
  'index-end': ']',
  'index-start': '[',
  'interpolation-end': ') . ',
  'interpolation-start': ' . (',
  'object-end': '}',
  'object-start': '{',
  'parameter-end': ')',
  'parameter-start': '(',
} as const

export const edge2 = (ctx: Context): string => {
  const { content, i, it } = ctx
  const { value } = it

  if (value === 'block-start') {
    const value2 = mapEdge[value] ?? '{'
    const prev = content.at(i - 1)

    if (!prev) return value2
    if (prev.is('sign', ':')) return value2

    return ` ${value2}`
  }

  if (value === 'call-start') {
    const prev = content.at(i - 1)
    if (!prev) {
      throw new TranspileError(
        ctx,
        'internal',
        `edge2: missing function name before call-start (token index: ${i})`,
      )
    }

    const name = trim(prev.value, '_')
    // if name starts with lower case, it is a user defined function
    // use [name].Call() to call it
    // otherwise it is a built-in function
    // use [name]() to call it
    const firstChar = name[0]
    return firstChar && name.startsWith(firstChar.toLowerCase())
      ? '.Call('
      : '('
  }

  return mapEdge[value] ?? value
}
