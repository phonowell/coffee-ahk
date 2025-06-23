import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, type, value } = ctx

  if (type === '(' || type === ')') {
    content.push('bracket', value)
    return true
  }

  return false
}

export default main
