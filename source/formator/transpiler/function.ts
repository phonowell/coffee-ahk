// interface

import { Context } from '../type'

// function

function $arrow(
  ctx: Context
): boolean {

  const { cache, content } = ctx

  if (content.last.type === 'edge') null
  else if (content.last.type === '=') {
    content.pop()
    content
      .push(ctx, 'edge', 'parameter-start')
      .push(ctx, 'edge', 'parameter-end')
  } else {
    if (cache.last === 'class') {
      content.pop()
      content
        .push(ctx, 'edge', 'parameter-start')
        .push(ctx, 'edge', 'parameter-end')
    } else
      throw new Error("ahk/forbidden: 'anonymous function' is not allowed")
  }

  cache.push('function')
  return true
}

function $start(
  ctx: Context
): boolean {

  const { cache, content } = ctx

  if (content.last.type === '=')
    content.pop()
  else
    if (cache.last === 'class') {
      content.pop()
    } else
      throw new Error("ahk/forbidden: 'anonymous function' is not allowed")

  content.push(ctx, 'edge', 'parameter-start')
  return true
}

function main(
  ctx: Context
): boolean {

  const { content, type } = ctx

  if (type === '->') return $arrow(ctx)

  if (type === 'call_start') {
    content.push(ctx, 'edge', 'call-start')
    return true
  }

  if (type === 'call_end') {
    content.push(ctx, 'edge', 'call-end')
    return true
  }

  if (type === 'param_start') return $start(ctx)

  if (type === 'param_end') {
    content.push(ctx, 'edge', 'parameter-end')
    return true
  }

  return false
}

// export
export default main