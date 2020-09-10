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

      const { last } = content
      if (last.type === 'identifier')
        last.type = 'function'

      content
        .push('param-start', '(')
        .push('param-end', ')')
    }
    cache.push('function')
    return true
  }

  if (type === 'param_start') {

    if (content.last.type === '=')
      content.pop()

    if (content.last.type === 'identifier')
      content.last.type = 'function'

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