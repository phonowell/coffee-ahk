// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type } = ctx

  if (type === 'while') {
    cache.next = 'while'
    content
      .push(ctx, 'while')
      .push(ctx, 'edge', 'expression-start')
    return true
  }

  return false
}

// export
export default main