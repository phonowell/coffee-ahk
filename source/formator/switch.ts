// interface

import { Context } from '../types'

// function

const main = (ctx: Context) => {
  const { content, scope, type } = ctx

  if (type === 'switch') {
    scope.push('switch')
    content.push('if', 'switch')
    return true
  }

  if (type === 'leading_when') {
    scope.push('case')
    content.push('if', 'case')
    return true
  }

  return false
}

// export
export default main
