import type { Context } from '../types/index.js'

const main = (ctx: Context): boolean => {
  const { content, type, value } = ctx

  if (type === 'js') {
    content.push({ type: 'native', value })
    return true
  }

  return false
}

export default main
