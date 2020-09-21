// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, type, value } = ctx

  if (type === 'string') {
    content.push(ctx, 'string', value)
    return true
  }

  // "xxx#{xxx}xxx"

  if (type === 'interpolation_start') {
    content.push(ctx, 'edge', 'interpolation-start')
    return true
  }

  if (type === 'interpolation_end') {
    content.push(ctx, 'edge', 'interpolation-end')
    return true
  }

  return false
}

// export
export default main