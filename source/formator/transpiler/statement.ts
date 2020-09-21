// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, type, value } = ctx

  if (type === 'unary' && value === 'new') {
    content.push(ctx, 'statement', 'new')
    return true
  }

  if (type === 'return') {
    content.push(ctx, 'statement', 'return')
    return true
  }

  if (type === 'statement')
    if (value === 'break' || value === 'continue') {
      content.push(ctx, 'statement', value)
      return true
    }

  return false
}

// export
export default main