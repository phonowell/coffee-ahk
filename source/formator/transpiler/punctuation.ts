// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type } = ctx

  if (type === '=') {
    content.push(ctx, '=', ':=')
    return true
  }

  if (type === ',') {
    content.push(ctx, ',')
    return true
  }

  if (type === ':') {
    if (cache.last === 'class') {
      content.push(ctx, '=')
      return true
    }
    content.push(ctx, ':')
    return true
  }

  return false
}

// export
export default main