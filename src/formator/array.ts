import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, scope, type } = ctx

  if (type === '[') {
    scope.push('array')
    content.push('edge', 'array-start')
    return true
  }

  if (type === ']') {
    scope.pop()
    content.push('edge', 'array-end')
    return true
  }

  return false
}

export default main
