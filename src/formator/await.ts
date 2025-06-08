import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, type } = ctx

  if (type === 'await') {
    content.push('await')
    return true
  }

  return false
}

export default main
