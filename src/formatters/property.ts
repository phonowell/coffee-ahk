import type { Context } from '../types'

const main = (ctx: Context): boolean => {
  const { content, type, value } = ctx

  if (type === '.') {
    content.push({ type: '.', value: '.' })
    return true
  }

  if (type === 'index_start') {
    if (content.at(-1)?.type === '.') content.pop()
    content.push({ type: 'edge', value: 'index-start' })
    return true
  }

  if (type === 'index_end') {
    content.push({ type: 'edge', value: 'index-end' })
    return true
  }

  if (type === 'property') {
    const lastType = content.at(-1)?.type
    if (lastType && ['prototype', 'this'].includes(lastType))
      content.push({ type: '.', value: '.' })
    content.push({ type: 'property', value })
    return true
  }

  return false
}

export default main
