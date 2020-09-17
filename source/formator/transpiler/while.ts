// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type, value } = ctx

  if (type === 'while') {
    cache.push('while')
    content
      .push('while')
      .push('edge', 'expression-start')
    return true
  }

  if (type === 'statement' && value === 'break') {
    content.push(value)
    return true
  }

  if (type === 'statement' && value === 'continue') {
    content.push(value)
    return true
  }

  return false
}

// export
export default main