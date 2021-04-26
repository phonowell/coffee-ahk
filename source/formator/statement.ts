// interface

import { Context } from '../entry/type'

// function

const main = (
  ctx: Context,
): boolean => {

  const { content, type, value } = ctx

  if (type === 'extends') {
    content.push('statement', 'extends')
    return true
  }


  if (type === 'return') {
    content.push('statement', 'return')
    return true
  }

  if (type === 'throw') {
    content.push('statement', 'throw')
    return true
  }

  if (type === 'statement')
    if (value === 'break' || value === 'continue') {
      content.push('statement', value)
      return true
    }

  if (type === 'unary' && value === 'new') {
    content.push('statement', 'new')
    return true
  }

  return false
}

// export
export default main