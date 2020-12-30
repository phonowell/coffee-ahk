// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, scope, type, value } = ctx

  if (type === 'terminator') {

    if (value === '\n') {

      if (content.equal(content.last, 'bracket', '}-'))
        content.last.value = '}'

      if (['array', 'call', 'object', 'parameter'].includes(scope.last)) {
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

      if (content.equal(content.last, 'bracket', '}-'))
        content.last.value = '}'

      content.push('new-line', ctx.indent.toString())
      return true
    }
  }

  return false
}

// export
export default main
