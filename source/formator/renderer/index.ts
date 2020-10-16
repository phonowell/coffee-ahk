import _ from 'lodash'

// interface

import { Context as _Context } from '../type'

type Context = _Context & {
  i: number
  it: Item
}

type Item = Context['content']['list'][number]

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


const mapMethod = {
  'edge': $edge,
  'for-in': ' in ',
  'logical-operator': $logicalOperator,
  'math': ' ~ ',
  'new-line': $newLine,
  class: 'class ',
  compare: ' ~ ',
  for: 'for ',
  if: $if,
  negative: $negative,
  sign: $sign,
  statement: $statement,
  try: $try,
  void: '',
  while: 'while '
} as const

let cacheComment: string[] = []

// function

function $commaLike(
  ctx: Context
): string {

  const { i, it } = ctx
  const _next = ctx.content.eq(i + 1)
  if (_next && _next.type !== 'new-line')
    return `${it.value} `
  return it.value
}

function $edge(
  ctx: Context
): string {

  const { content, i, it } = ctx
  const { value } = it

  if (value === 'block-start') {

    const _value = mapEdge[value]
    const _prev = content.eq(i - 1)

    if (!_prev) return _value
    if (content.equal(_prev, 'sign', ':')) return _value

    return ` ${_value}`
  }

  if (value === 'call-start') {

    const { value } = content.eq(i - 1)
    return value[0] === value[0].toLowerCase()
      ? '.Call('
      : '('
  }

  return mapEdge[value] || value
}

function $if(
  ctx: Context
): string {

  const { content, i, it } = ctx
  const { value } = it

  if (value === 'case') return 'case '
  if (value === 'default') return 'default'
  if (value === 'else') return ' else'

  if (value === 'if') {
    const _prev = content.eq(i - 1)
    if (content.equal(_prev, 'if', 'else'))
      return ' if '
    else return 'if '
  }

  if (value === 'switch') return 'switch '
  return ''
}

function $logicalOperator(
  ctx: Context
): string {

  const { value } = ctx.it
  return ['&&', '||'].includes(value)
    ? ` ${value} `
    : value
}

function $negative(
  ctx: Context
): string {

  const { value } = ctx.it
  return value === '-'
    ? value
    : ''
}

function $newLine(
  ctx: Context
): string {

  let n = parseInt(ctx.it.value)
  if (!(n >= 0)) n = 0
  return '\n' + _.repeat(' ', n * 2)
}

function $sign(
  ctx: Context
): string {

  const { value } = ctx.it
  if ([',', ':'].includes(value)) return $commaLike(ctx)
  if (value === '=') return ' := '
  if (value === '...') return '*'
  return value
}

function $statement(
  ctx: Context
): string {

  const { value } = ctx.it
  if (value === 'extends') return ' extends '
  if (['new', 'return', 'throw'].includes(value)) return $commaLike(ctx)
  return ctx.it.value
}

function $try(
  ctx: Context
): string {

  const { content, i, it } = ctx
  const { value } = it

  if (value === 'catch') {
    const _next = content.eq(i + 1)
    if (content.equal(_next, 'edge', 'block-start'))
      return ' catch'
    return ' catch '
  }

  if (value === 'finally') return ' finally'
  if (value === 'try') return 'try'
  return ''
}

function injectComment(
  input: string,
  ctx: Context
): string {

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

function main(
  ctx: _Context
): string {

  return ctx.content.list
    .map((it, i) => {

      const context: Context = { ...ctx, i, it }

      if (it.comment)
        cacheComment = [
          ...cacheComment,
          ...it.comment
        ]

      for (const key of Object.keys(mapMethod)) {

        if (it.type === key) {

          const method = mapMethod[key]
          let value: string = ''

          if (typeof method === 'string')
            value = method.replace(/~/g, it.value)
          else
            value = method(context)

          return injectComment(value, context)
        }
      }
      return injectComment(it.value, context)
    })
    .join('')
}

// export
export default main