// interface

import { Context } from '../entry/type'

// function

const main = (
  ctx: Context
): boolean => {

  const { content, scope, type } = ctx

  if (type === '...') {
    if (!['call', 'parameter'].includes(scope.last))
      throw new Error(`ahk/forbidden: '...' is not allowed`)
    content.push('sign', '...')
  }

  if (type === '=') {
    content.push('sign', '=')
    return true
  }

  if (type === ',') {
    content.push('sign', ',')
    return true
  }

  if (type === ':') {
    if (scope.last === 'class') {
      content.push('sign', '=')
      return true
    }
    content.push('sign', ':')
    return true
  }

  return false
}

// export
export default main