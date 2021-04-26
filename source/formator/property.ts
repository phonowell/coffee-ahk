// interface

import { Context } from '../entry/type'

// function

const main = (
  ctx: Context,
): boolean => {

  const { content, type, value } = ctx

  if (type === '.') {
    content.push('.')
    return true
  }

  if (type === 'index_start') {
    if (content.last.type === '.') content.pop()
    content.push('edge', 'index-start')
    return true
  }

  if (type === 'index_end') {
    content.push('edge', 'index-end')
    return true
  }

  if (type === 'property') {
    if (['prototype', 'this'].includes(content.last.type))
      content.push('.')
    content.push('property', value)
    return true
  }

  return false
}

// export
export default main