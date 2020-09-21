// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, type, value } = ctx

  if (type === '.') {
    content.push(ctx, '.')
    return true
  }

  if (type === 'index_start') {
    if (content.last.type === '.') content.pop()
    content.push(ctx, 'edge', 'index-start')
    return true
  }

  if (type === 'index_end') {
    content.push(ctx, 'edge', 'index-end')
    return true
  }

  if (type === 'property') {
    if (['prototype', 'this'].includes(content.last.type))
      content.push(ctx, '.')
    content.push(ctx, 'property', value)
    return true
  }

  return false
}

// export
export default main