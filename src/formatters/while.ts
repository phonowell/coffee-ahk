import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, scope, type } = ctx

  if (type === 'loop') {
    scope.next = 'while'
    content.push(
      { type: 'while', value: 'while' },
      { type: 'edge', value: 'expression-start' },
      { type: 'boolean', value: 'true' },
    )
    return true
  }

  if (type === 'while') {
    scope.next = 'while'
    content.push(
      { type: 'while', value: 'while' },
      { type: 'edge', value: 'expression-start' },
    )
    return true
  }

  if (type === 'until') {
    scope.next = 'while'
    content.push(
      { type: 'while', value: 'while' },
      { type: 'logical-operator', value: '!' },
      { type: 'edge', value: 'expression-start' },
    )
    return true
  }

  return false
}

export default main
