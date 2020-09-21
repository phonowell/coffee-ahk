// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type } = ctx

  if (type === '=') {
    content.push('=', ':=')
    return true
  }

  if (type === ',') {
    content.push(',')
    return true
  }

  if (type === ':') {
    if (cache.last === 'class') {
      content.push('=')
      return true
    }
    content.push(':')
    return true
  }

  return false
}

// export
export default main