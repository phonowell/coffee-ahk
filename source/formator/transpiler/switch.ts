// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type } = ctx

  if (type === 'switch') {
    cache.push('switch')
    content.push('if', 'switch')
    return true
  }

  if (type === 'leading_when') {
    cache.push('case')
    content.push('if', 'case')
    return true
  }

  return false
}

// export
export default main