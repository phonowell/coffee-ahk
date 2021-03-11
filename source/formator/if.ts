// interface

import { Context } from '../entry/type'

// function

const main = (
  ctx: Context
): boolean => {

  const { content, scope, type, value } = ctx

  if (type === 'if') {
    scope.next = 'if'
    content.push('if')
    if (value === 'unless')
      content.push('logical-operator', '!')
    content.push('edge', 'expression-start')
    return true
  }

  if (type === 'else') {
    if (scope.last === 'switch') {
      scope.push('case')
      content
        .push('new-line', ctx.indent.toString())
        .push('if', 'default')
      return true
    }
    scope.next = 'else'
    content.push('if', 'else')
    return true
  }

  return false
}

// export
export default main