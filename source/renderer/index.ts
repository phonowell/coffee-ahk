import $repeat from 'lodash/repeat'
import $trim from 'lodash/trim'
import Item from '../module/Item'
import { Context as _Context } from '../entry/type'

// interface

type Context = _Context & {
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

const $commaLike = (
  ctx: Context
): string => {

  const { i, it } = ctx
  const _next = ctx.content.eq(i + 1)
  if (_next && _next.type !== 'new-line') return `${it.value} `
  return it.value
}

const $edge = (
  ctx: Context
): string => {

  const { content, i, it } = ctx
  const { value } = it

  if (value === 'block-start') {

    const _value = mapEdge[value]
    const _prev = content.eq(i - 1)

    if (!_prev) return _value
    if (Item.equal(_prev, 'sign', ':')) return _value

    return ` ${_value}`
  }

  if (value === 'call-start') {

    const _value = $trim(content.eq(i - 1).value, '_')
    return _value[0] === _value[0].toLowerCase()
      ? '.Call('
      : '('
  }

  return mapEdge[value] || value
}

const $if = (
  ctx: Context
): string => {

  const { content, i, it } = ctx
  const { value } = it

  if (value === 'case') return 'case '
  if (value === 'default') return 'default'
  if (value === 'else') return ' else'

  if (value === 'if') {
    const _prev = content.eq(i - 1)
    if (Item.equal(_prev, 'if', 'else')) return ' if '
    return 'if '
  }

  if (value === 'switch') return 'switch '
  return ''
}

const $logicalOperator = (
  ctx: Context
): string => {

  const { value } = ctx.it
  return ['&&', '||'].includes(value)
    ? ` ${value} `
    : value
}

const $negative = (
  ctx: Context
): string => {

  const { value } = ctx.it
  return value === '-'
    ? value
    : ''
}

const $newLine = (
  ctx: Context
): string => {

  let n = parseInt(ctx.it.value, 10)
  if (!(n >= 0)) n = 0
  return `\n${$repeat(' ', n * 2)}`
}

const $sign = (
  ctx: Context
): string => {

  const { value } = ctx.it
  if ([',', ':'].includes(value)) return $commaLike(ctx)
  if (value === '=') return ' := '
  if (value === '...') return '*'
  return value
}

const $statement = (
  ctx: Context
): string => {

  const { value } = ctx.it
  if (value === 'export') return 'return '
  if (value === 'extends') return ' extends '
  if (['new', 'return', 'throw'].includes(value)) return $commaLike(ctx)
  return ctx.it.value
}

const $try = (
  ctx: Context
): string => {

  const { content, i, it } = ctx
  const { value } = it

  if (value === 'catch') {
    const _next = content.eq(i + 1)
    if (Item.equal(_next, 'edge', 'block-start')) return ' catch'
    return ' catch '
  }

  if (value === 'finally') return ' finally'
  if (value === 'try') return 'try'
  return ''
}

const injectComment = (
  input: string,
  ctx: Context
): string => {

  if (ctx.option.ignoreComment) return input

  const { i, it } = ctx
  if (!cacheComment.length) return input
  if (it.type !== 'new-line') return input

  const _prev = ctx.content.eq(i - 1)
  const seprator = _prev && _prev.type !== 'new-line' && _prev.value
    ? ' ; '
    : '; '

  const newLine = $newLine(ctx)

  const output = `${seprator}${cacheComment.join(' ')}${newLine}`
  cacheComment = []
  return output
}

const main = (
  ctx: _Context
): string => {

  let content = ctx.content.list
    .map((it, i) => {

      const context: Context = { ...ctx, i, it }

      if (it.comment) cacheComment = [
        ...cacheComment,
        ...it.comment,
      ]

      for (const key of Object.keys(mapMethod)) {

        if (it.type === key) {

          const method = mapMethod[key]
          const value = typeof method === 'string'
            ? method.replace(/~/g, it.value)
            : method(context)

          return injectComment(value, context)
        }
      }
      return injectComment(it.value, context)
    })
    .join('')

  if (ctx.option.insertTranspilerInformation) content = [
    '; Generated by Coffee-AHK/0.0.40',
    content,
  ].join('\n')

  return content
}

const mapMethod = {
  class: 'class ',
  compare: ' ~ ',
  'edge': $edge,
  for: 'for ',
  'for-in': ' in ',
  if: $if,
  'logical-operator': $logicalOperator,
  'math': ' ~ ',
  negative: $negative,
  'new-line': $newLine,
  sign: $sign,
  statement: $statement,
  super: 'base',
  try: $try,
  void: '',
  while: 'while ',
} as const

// export
export default main