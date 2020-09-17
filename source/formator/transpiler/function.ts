// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type } = ctx

  if (type === '->') {

    if (content.last.type === 'edge') null
    else if (content.last.type === '=') {
      content.pop()
      content
        .push('edge', 'parameter-start')
        .push('edge', 'parameter-end')
    } else
      throw new Error("ahk/forbidden: 'anonymous function' is not allowed")

    cache.push('function')
    return true
  }

  if (type === 'param_start') {

    if (content.last.type === '=')
      content.pop()

    content.push('edge', 'parameter-start')
    return true
  }

  if (type === 'param_end') {
    content.push('edge', 'parameter-end')
    return true
  }

  if (type === 'call_start') {
    content.push('edge', 'call-start')
    return true
  }

  if (type === 'call_end') {
    content.push('edge', 'call-end')
    return true
  }

  if (type === 'return') {
    content.push('return')
    return true
  }

  return false
}

// export
export default main