import _ from 'lodash'

// interface

import { Context } from '../type'

type Item = Context['content']['list'][number]

// variable

const map = {
  ',': $commaLike,
  ':': $commaLike,
  '=': $spaceAround,
  'interpolation-end': $interpolation,
  'interpolation-start': $interpolation,
  'math': $spaceAround,
  'new-line': $newLine,
  '{': $blockStart,
  compare: $spaceAround,
  else: $spaceAround,
  if: $spaceBehind,
  negative: $negative,
  return: $commaLike,
  while: $spaceBehind
} as const

let cacheComment: string[] = []

// function

function $blockStart(
  ctx: Context,
  it: Item,
  i: number
): string {

  const _prev = ctx.content.eq(i - 1)
  if (_prev && _prev.value === ')')
    return ` ${it.value}`
  return it.value
}

function $commaLike(
  ctx: Context,
  it: Item,
  i: number
): string {

  const _next = ctx.content.eq(i + 1)
  if (_next && _next.type !== 'new-line')
    return `${it.value} `
  return it.value
}

function $interpolation(
  ctx: Context,
  it: Item,
  i: number
): string {
  ctx && i
  return it.type === 'interpolation-start'
    ? ` ${it.value} (`
    : `) ${it.value} `
}

function $negative(
  ctx: Context,
  it: Item,
  i: number
): string {
  ctx && i
  return it.value === '-'
    ? it.value
    : ''
}

function $newLine(
  ctx: Context,
  it: Item,
  i: number
): string {
  ctx && i
  return '\n' + _.repeat(' ', parseInt(it.value) * 2)
}

function $spaceAround(
  ctx: Context,
  it: Item,
  i: number
): string {
  ctx && i
  return ` ${it.value} `
}

function $spaceBehind(
  ctx: Context,
  it: Item,
  i: number
): string {
  ctx && i
  return `${it.value} `
}

function injectComment(
  input: string,
  ctx: Context,
  it: Item,
  i: number
): string {
  i
  if (!cacheComment.length) return input
  if (it.type !== 'new-line') return input

  const _prev = ctx.content.eq(i - 1)
  const seprator = _prev && _prev.type !== 'new-line' && _prev.value
    ? ' ; '
    : '; '

  const newLine = $newLine(ctx, it, i)

  const output = `${seprator}${cacheComment.join(' ; ')}${newLine}`
  cacheComment = []
  return output
}

function main(
  ctx: Context
): string {

  return ctx.content.clone()
    .map((it, i) => {

      if (it.comment)
        cacheComment = [
          ...cacheComment,
          ...it.comment
        ]

      for (const key of Object.keys(map)) {
        if (it.type === key)
          return injectComment(
            map[key](ctx, it, i),
            ctx, it, i
          )
      }

      return injectComment(
        it.value,
        ctx, it, i
      )
    })
    .join('')
}

// export
export default main