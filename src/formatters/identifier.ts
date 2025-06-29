import type { Context } from '../types'

/** Format identifier tokens */
const identifierFormatter = (context: Context): boolean => {
  const { content, type, value } = context

  if (type === 'identifier') {
    content.push('identifier', value)
    return true
  }

  return false
}

export default identifierFormatter
