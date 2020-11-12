// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type, value } = ctx

  if (type === 'terminator') {

    if (value === '\n') {
      if (['array', 'call', 'object', 'parameter'].includes(cache.last)) {
        if (!content.equal(content.last, 'sign', ',')) {
          if (content.last.type === 'new-line') content.pop()
          content.push('sign', ',')
        }
        return true
      }

      content.push('new-line', ctx.indent.toString())
      return true
    }

    if (value === ';') {
      content.push('new-line', ctx.indent.toString())
      return true
    }
  }

  return false
}

// export
export default main