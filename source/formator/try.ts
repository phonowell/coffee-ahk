// interface

import { Context } from '../entry/type'

// function

const main = (
  ctx: Context,
): boolean => {

  const { content, scope, type } = ctx

  if (type === 'catch') {
    scope.next = 'catch'
    content.push('try', 'catch')
    return true
  }

  if (type === 'finally') {
    content.push('try', 'finally')
    scope.push('finally')
    content.push('edge', 'block-start')
    return true
  }

  if (type === 'try') {
    content.push('try')
    scope.push('try')
    content.push('edge', 'block-start')
    return true
  }

  return false
}

// export
export default main