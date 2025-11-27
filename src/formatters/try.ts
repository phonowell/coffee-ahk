import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, scope, type } = ctx

  if (type === 'catch') {
    scope.next = 'catch'
    content.push({ type: 'try', value: 'catch' })
    return true
  }

  if (type === 'finally') {
    content.push({ type: 'try', value: 'finally' })
    scope.push('finally')
    content.push({ type: 'edge', value: 'block-start' })
    return true
  }

  if (type === 'try') {
    content.push({ type: 'try', value: 'try' })
    scope.push('try')
    content.push({ type: 'edge', value: 'block-start' })
    return true
  }

  return false
}

export default main
