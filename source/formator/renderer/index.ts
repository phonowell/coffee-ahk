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
  ',': $commaLike,
  ':': $commaLike,
  '=': ' := ',
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
  statement: $statement,
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

  const { i, it } = ctx
  const { value } = it

  if (value === 'block-start') {

    const _value = mapEdge[value]
    const _prev = ctx.content.eq(i - 1)

    if (!_prev) return _value

    if (_prev.type === 'identifier')
      return ` ${_value}`

    if (['expression-end', 'parameter-end'].includes(_prev.value))
      return ` ${_value}`

    return _value
  }

  return mapEdge[value] || value
}

function $if(
  ctx: Context
): string {

  const { value } = ctx.it
  if (value === 'if') return 'if '
  if (value === 'else') return ' else '
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

  const n = parseInt(ctx.it.value)
  return n >= 0
    ? '\n' + _.repeat(' ', n * 2)
    : ''
}

function $statement(
  ctx: Context
): string {

  const { value } = ctx.it
  if (value === 'new') return 'new '
  if (value === 'return') return $commaLike(ctx)
  return ctx.it.value
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

  const output = `${seprator}${cacheComment.join(' ; ')}${newLine}`
  cacheComment = []
  return output
}

function main(
  ctx: _Context
): string {

  return ctx.content.clone()
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