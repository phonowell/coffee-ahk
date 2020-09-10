// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, type, value } = ctx

  if (type === 'identifier') {
    content.push('identifier', value)
    return true
  }

  if (type === 'property') {
    content.push('property', value)
    return true
  }

  if (type === '.') {
    content.push('.')
    return true
  }

  return false
}

// export
export default main