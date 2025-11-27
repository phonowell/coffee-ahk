import type { Context } from '../types'

const main = (ctx: Context): boolean => {
  const { content, type } = ctx

  if (type === 'do' || type === 'do_iife') {
    content.push({ type: 'native', value: '__mark:do__' })
    return true
  }

  return false
}

export default main
