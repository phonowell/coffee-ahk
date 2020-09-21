// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, type, value } = ctx

  if (type === 'bool') {
    content.push(ctx, 'boolean', value)
    return true
  }

  return false
}

// export
export default main