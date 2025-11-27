import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, scope, type, value } = ctx

  if (type === 'if') {
    scope.next = 'if'
    content.push({ type: 'if', value: 'if' })
    if (value === 'unless')
      content.push({ type: 'logical-operator', value: '!' })
    content.push({ type: 'edge', value: 'expression-start' })
    return true
  }

  if (type === 'else') {
    if (scope.last === 'switch') {
      scope.push('case')
      content.push(
        { type: 'new-line', value: ctx.indent.toString() },
        { type: 'if', value: 'default' },
      )
      return true
    }
    scope.next = 'else'
    content.push({ type: 'if', value: 'else' })
    return true
  }

  return false
}

export default main
