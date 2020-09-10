// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { listResult, type, value } = ctx

  if (type === 'identifier') {
    listResult.push(value)
    return true
  }

  if (type === 'property') {
    listResult.push(value)
    return true
  }

  return false
}

// export
export default main