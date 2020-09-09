// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { listResult, type } = ctx

  if (type === '[') {
    listResult.push('[')
    return true
  }

  if (type === ']') {
    listResult.push(']')
    return true
  }

  return false
}

// export
export default main