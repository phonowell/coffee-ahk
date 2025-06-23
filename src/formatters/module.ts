import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, type } = ctx

  if (type === 'export') {
    content.push('statement', 'export')
    return true
  }

  return false
}

export default main
