// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, scope, type } = ctx

  if (type === 'class') {
    scope.next = 'class'
    content.push('class')
    return true
  }

  return false
}

// export
export default main