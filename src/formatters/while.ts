import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, scope, type } = ctx

  if (type === 'loop') {
    scope.next = 'while'
    content
      .push('while')
      .push('edge', 'expression-start')
      .push('boolean', 'true')
    return true
  }

  if (type === 'while') {
    scope.next = 'while'
    content.push('while').push('edge', 'expression-start')
    return true
  }

  if (type === 'until') {
    scope.next = 'while'
    content
      .push('while')
      .push('logical-operator', '!')
      .push('edge', 'expression-start')
    return true
  }

  return false
}

export default main
