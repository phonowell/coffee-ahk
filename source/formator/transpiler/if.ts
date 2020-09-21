// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type, value } = ctx

  if (type === 'if') {
    cache.next = 'if'
    content.push('if')
    if (value === 'unless')
      content.push('logical-operator', '!')
    content.push('edge', 'expression-start')
    return true
  }

  if (type === 'else') {
    cache.next = 'else'
    content.push('if', 'else')
    return true
  }

  return false
}

// export
export default main