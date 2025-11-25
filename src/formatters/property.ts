import type { Context } from '../types'

const main = (ctx: Context): boolean => {
  const { content, type, value } = ctx

  if (type === '.') {
    content.push('.')
    return true
  }

  if (type === 'index_start') {
    if (content.at(-1)?.type === '.') content.pop()
    content.push('edge', 'index-start')
    return true
  }

  if (type === 'index_end') {
    content.push('edge', 'index-end')
    return true
  }

  if (type === 'property') {
    const lastType = content.at(-1)?.type
    if (lastType && ['prototype', 'this'].includes(lastType)) content.push('.')
    content.push('property', value)
    return true
  }

  return false
}

export default main
