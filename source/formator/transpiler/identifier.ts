// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, type, value } = ctx

  if (type === 'identifier') {
    content.push(ctx, 'identifier', value)
    return true
  }

  return false
}

// export
export default main