import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, type } = ctx

  if (type === 'async') {
    content.push('async')
    return true
  }

  return false
}

export default main
