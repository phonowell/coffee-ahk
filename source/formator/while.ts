// interface

import { Context } from '../entry/type'

// function

function main(
  ctx: Context
): boolean {

  const { content, scope, type } = ctx

  if (type === 'while') {
    scope.next = 'while'
    content
      .push('while')
      .push('edge', 'expression-start')
    return true
  }

  if (type === 'until') {
    scope.next = 'while'
    content
      .push('while', 'until')
      .push('edge', 'expression-start')
    return true
  }

  return false
}

// export
export default main
