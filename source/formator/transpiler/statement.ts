// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, type, value } = ctx

  if (type === 'unary' && value === 'new') {
    content.push('statement', 'new')
    return true
  }

  if (type === 'return') {
    content.push('statement', 'return')
    return true
  }

  if (type === 'statement')
    if (value === 'break' || value === 'continue') {
      content.push('statement', value)
      return true
    }

  return false
}

// export
export default main