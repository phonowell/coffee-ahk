// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, raw, type } = ctx

  if (type === '{') {

    if (cache.last === 'class') return true

    if (content.last.type === 'new-line' && raw.generated)
      content.pop()

    cache.push('object')
    content.push(ctx, 'bracket', '{')
    return true
  }

  if (type === '}') {

    if (cache.last === 'class') return true

    content.push(ctx, 'bracket', '}')
    cache.pop()
    return true
  }

  return false
}

// export
export default main