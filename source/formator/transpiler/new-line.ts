// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type, value } = ctx

  if (type === 'terminator' && value === '\n') {

    if (['array', 'call', 'object', 'parameter'].includes(cache.last)) {
      if (!content.equal(content.last, 'sign', ',')) {
        if (content.last.type === 'new-line') content.pop()
        content.push('sign', ',')
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