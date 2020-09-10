// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, type, value } = ctx

  if (type === 'number') {
    content.push('number', value)
    return true
  }

  if (type === 'compare') {
    content.push('compare', ` ${value} `)
    return true
  }

  return false
}

// export
export default main