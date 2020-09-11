// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, type } = ctx

  if (type === '(' || type === ')') {
    content.push(type)
    return true
  }

  return false
}

// export
export default main