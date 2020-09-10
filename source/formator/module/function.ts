// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type } = ctx

  if (type === '->') {
    if (content.last.type === '=') {
      content.pop()
      content.push('(', ')')
    }
    cache.push('function')
    return true
  }

  if (type === 'param_start') {
    if (content.last.type === '=')
      content.pop()
    content.push('param-start', '(')
    return true
  }

  if (type === 'param_end') {
    content.push('param-end', ')')
    return true
  }

  if (type === 'call_start') {
    content.push('(')
    return true
  }

  if (type === 'call_end') {
    content.push(')')
    return true
  }

  if (type === 'return') {
    content.push('return', 'return ')
    return true
  }

  return false
}

// export
export default main