// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, raw, type } = ctx

  if (type === '{') {

    if (cache.last === 'class') {
      if (content.last.type === 'new-line') content.pop()
      content
        .push(ctx, 'edge', 'block-start')
        .push(ctx, 'new-line', ctx.indent)
      return true
    }

    cache.push('object')

    if (content.last.type === 'new-line' && raw.generated)
      content.pop()

    content.push(ctx, 'bracket', '{')
    return true
  }

  if (type === '}') {
    cache.pop()
    content.push(ctx, 'bracket', '}')
    return true
  }

  return false
}

// export
export default main