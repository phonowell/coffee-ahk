// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { listResult, type, value } = ctx

  if (type === 'number') {
    listResult.push(value)
    return true
  }

  if (type === 'compare') {
    listResult.push(` ${value} `)
    return true
  }

  return false
}

// export
export default main