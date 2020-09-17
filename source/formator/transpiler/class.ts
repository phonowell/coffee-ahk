// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type, value } = ctx

  if (type === 'class') {
    cache.push('class')
    content.push('class')
    return true
  }

  if (type === 'unary' && value === 'new') {
    content.push('new')
    return true
  }

  return false
}

// export
export default main