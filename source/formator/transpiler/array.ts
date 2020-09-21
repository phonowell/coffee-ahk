// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type } = ctx

  if (type === '[') {
    cache.push('array')
    content.push(ctx, 'edge', 'array-start')
    return true
  }

  if (type === ']') {
    cache.pop()
    content.push(ctx, 'edge', 'array-end')
    return true
  }

  return false
}

// export
export default main