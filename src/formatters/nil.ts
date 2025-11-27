import type { Context } from '../types'

const main = (ctx: Context): boolean => {
  const { content, type } = ctx

  if (['nan', 'null', 'undefined'].includes(type)) {
    content.push({ type: 'string', value: '""' })
    return true
  }

  return false
}

export default main
