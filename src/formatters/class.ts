import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, scope, type, value } = ctx

  if (type === 'class') {
    scope.next = 'class'
    content.push({ type: 'class', value })
    return true
  }

  if (type === 'super') {
    content.push({ type: 'super', value: 'super' })
    return true
  }

  return false
}

export default main
