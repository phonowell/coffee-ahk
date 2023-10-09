import { Context } from '../types'

// function

const main = (ctx: Context): boolean => {
  const { content, scope, type, value } = ctx

  if (type === 'terminator') {
    if (value === '\n') {
      if (content.last.is('bracket', '}-')) content.last.value = '}'

      if (['array', 'call', 'object', 'parameter'].includes(scope.last)) {
        if (!content.last.is('sign', ',')) {
          if (content.last.is('new-line')) content.pop()
          content.push('sign', ',')
        }
        return true
      }

      content.push('new-line', ctx.indent.toString())
      return true
    }

    if (value === ';') {
      if (content.last.is('bracket', '}-')) content.last.value = '}'

      content.push('new-line', ctx.indent.toString())
      return true
    }
  }

  return false
}

// export
export default main
