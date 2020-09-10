// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type, value } = ctx

  if (type === 'terminator' && value === '\n') {

    if (['array', 'object'].includes(cache.last)) {
      if (content.last.type !== ',') {
        if (content.last.type === 'new-line') content.pop()
        content
          .push(',')
          .push('new-line', ctx.indent)
      }
      return true
    }

    content.push('new-line', ctx.indent)
    return true
  }

  return false
}

// export
export default main