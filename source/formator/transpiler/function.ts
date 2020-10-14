// interface

import cache from '../module/cache'
import { Context } from '../type'

// function

function $arrow(
  ctx: Context
): boolean {

  const { cache, content } = ctx

  if (content.last.type === 'edge') null
  else if (content.equal(content.last, 'sign', '=')) {
    content.pop()
    cache.push('parameter')
    content
      .push('edge', 'parameter-start')
      .push('edge', 'parameter-end')
    cache.pop()
  } else {
    if (cache.last === 'class') {
      content.pop()
      content
        .push('edge', 'parameter-start')
        .push('edge', 'parameter-end')
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

  if (content.equal(content.last, 'sign', '='))
    content.pop()
  else
    if (cache.last === 'class') content.pop()
    else
      throw new Error("ahk/forbidden: 'anonymous function' is not allowed")

  cache.push('parameter')
  content.push('edge', 'parameter-start')
  return true
}

function main(
  ctx: Context
): boolean {

  const { content, type } = ctx

  if (type === '->') return $arrow(ctx)

  if (type === 'call_start') {
    const _next = cache.next
    cache.next = ''
    cache.push('call')
    cache.next = _next
    content.push('edge', 'call-start')
    return true
  }

  if (type === 'call_end') {
    content.push('edge', 'call-end')
    cache.pop()
    return true
  }

  if (type === 'param_start') return $start(ctx)

  if (type === 'param_end') {
    content.push('edge', 'parameter-end')
    cache.pop()
    return true
  }

  return false
}

// export
export default main