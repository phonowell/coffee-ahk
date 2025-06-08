import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, type, value } = ctx

  if (type === 'bool') {
    content.push('boolean', value)
    return true
  }

  return false
}

export default main
