import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, type } = ctx

  if (type === 'export') {
    content.push({ type: 'statement', value: 'export' })
    return true
  }

  return false
}

export default main
