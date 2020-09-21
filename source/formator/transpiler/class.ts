// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type } = ctx

  if (type === 'class') {
    cache.push('class')
    content.push(ctx, 'class')
    return true
  }

  return false
}

// export
export default main