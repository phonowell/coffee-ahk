import type { Context } from '../types'

const main = (ctx: Context): boolean => {
  const { content, type, value } = ctx

  if (type === 'extends') {
    content.push({ type: 'statement', value: 'extends' })
    return true
  }

  if (type === 'return') {
    content.push({ type: 'statement', value: 'return' })
    return true
  }

  if (type === 'this') {
    content.push({ type: 'this', value: 'this' })
    return true
  }

  if (type === 'throw') {
    content.push({ type: 'statement', value: 'throw' })
    return true
  }

  if (type === 'statement') {
    if (value === 'break' || value === 'continue') {
      content.push({ type: 'statement', value })
      return true
    }
  }

  if (type === 'unary' && value === 'new') {
    content.push({ type: 'statement', value: 'new' })
    return true
  }

  return false
}

export default main
