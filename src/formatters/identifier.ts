import type { Context } from '../types'

/** Format identifier tokens */
const identifierFormatter = (context: Context): boolean => {
  const { content, type, value } = context

  if (type === 'identifier') {
    if (value === 'Promise') context.flag.isPromiseUsed = true

    content.push('identifier', value)
    return true
  }

  return false
}

export default identifierFormatter
