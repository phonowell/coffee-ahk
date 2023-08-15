import repeat from 'lodash/repeat'
import trim from 'lodash/trim'

import { Context as Context2 } from '../types'
import Item from '../module/Item'

// interface

type Context = Context2 & {
  i: number
  it: Item
}

// variable

const mapEdge = {
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
  'parameter-end': ')',
  'parameter-start': '(',
} as const

let cacheComment: string[] = []

// function

const commaLike2 = (ctx: Context): string => {
  const { i, it } = ctx
  const next = ctx.content.eq(i + 1)
  if (next && next.type !== 'new-line') return `${it.value} `
  return it.value
}

const edge2 = (ctx: Context): string => {
  const { content, i, it } = ctx
  const { value } = it

  if (value === 'block-start') {
    const value2 = mapEdge[value]
    const prev = content.eq(i - 1)

    if (!prev) return value2
    if (Item.is(prev, 'sign', ':')) return value2

    return ` ${value2}`
  }

  if (value === 'call-start') {
    const value2 = trim(content.eq(i - 1).value, '_')
    return value2[0] === value2[0].toLowerCase() ? '.Call(' : '('
  }

  return mapEdge[value] || value
}

const if2 = (ctx: Context): string => {
  const { content, i, it } = ctx
  const { value } = it

  if (value === 'case') return 'case '
  if (value === 'default') return 'default'
  if (value === 'else') return ' else'

  if (value === 'if') {
    const _prev = content.eq(i - 1)
    if (Item.is(_prev, 'if', 'else')) return ' if '
    return 'if '
  }

  if (value === 'switch') return 'switch '
  return ''
}

const logicalOperator2 = (ctx: Context): string => {
  const { value } = ctx.it
  return ['&&', '||'].includes(value) ? ` ${value} ` : value
}

const negative2 = (ctx: Context): string => {
  const { value } = ctx.it
  return value === '-' ? value : ''
}

const newLine2 = (ctx: Context): string => {
  let n = parseInt(ctx.it.value, 10)
  if (!(n >= 0)) n = 0
  return `\n${repeat(' ', n * 2)}`
}

const sign2 = (ctx: Context): string => {
  const { value } = ctx.it
  if ([',', ':'].includes(value)) return commaLike2(ctx)
  if (value === '=') return ' := '
  if (value === '...') return '*'
  return value
}

const statement2 = (ctx: Context): string => {
  const { value } = ctx.it
  if (value === 'export') return 'return '
  if (value === 'extends') return ' extends '
  if (['new', 'return', 'throw'].includes(value)) return commaLike2(ctx)
  return ctx.it.value
}

const try2 = (ctx: Context): string => {
  const { content, i, it } = ctx
  const { value } = it

  if (value === 'catch') {
    const next = content.eq(i + 1)
    if (Item.is(next, 'edge', 'block-start')) return ' catch'
    return ' catch '
  }

  if (value === 'finally') return ' finally'
  if (value === 'try') return 'try'
  return ''
}

const injectComment = (input: string, ctx: Context): string => {
  if (ctx.option.ignoreComment) return input

  const { i, it } = ctx
  if (!cacheComment.length) return input
  if (it.type !== 'new-line') return input

  const _prev = ctx.content.eq(i - 1)
  const seprator =
    _prev && _prev.type !== 'new-line' && _prev.value ? ' ; ' : '; '

  const newLine = newLine2(ctx)

  const output = `${seprator}${cacheComment.join(' ')}${newLine}`
  cacheComment = []
  return output
}

const main = (ctx: Context2): string => {
  let content = ctx.content.list
    .map((it, i) => {
      const context: Context = { ...ctx, i, it }

      if (it.comment) cacheComment = [...cacheComment, ...it.comment]

      for (const key of Object.keys(mapMethod)) {
        if (it.type === key) {
          const method = mapMethod[key]
          const value =
            typeof method === 'string'
              ? method.replace(/~/g, it.value)
              : method(context)

          return injectComment(value, context)
        }
      }
      return injectComment(it.value, context)
    })
    .join('')

  if (ctx.option.insertTranspilerInformation)
    content = ['; Generated by Coffee-AHK/0.0.53', content].join('\n')

  return content
}

const mapMethod = {
  'for-in': ' in ',
  'logical-operator': logicalOperator2,
  'new-line': newLine2,
  await: 'await ',
  class: 'class ',
  compare: ' ~ ',
  edge: edge2,
  for: 'for ',
  if: if2,
  math: ' ~ ',
  negative: negative2,
  sign: sign2,
  statement: statement2,
  super: 'base',
  try: try2,
  void: '',
  while: 'while ',
} as const

// export
export default main
