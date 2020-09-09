// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { listResult, raw, type } = ctx

  if (type === 'number') {
    listResult.push(raw[1])
    return true
  }

  if (type === 'compare') {
    listResult.push(` ${raw[1]} `)
    return true
  }

  return false
}

// export
export default main