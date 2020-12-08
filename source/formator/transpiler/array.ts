// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, scope, type } = ctx

  if (type === '[') {
    scope.push('array')
    content.push('edge', 'array-start')
    return true
  }

  if (type === ']') {
    scope.pop()
    content.push('edge', 'array-end')
    return true
  }

  return false
}

// export
export default main