import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, type } = ctx

  if (type === '@') {
    content.push('this')
    return true
  }

  if (type === '::') {
    if (content.last.is('.')) content.pop()
    content.push('.').push('prototype')
    return true
  }

  return false
}

export default main
