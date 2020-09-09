// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { listResult, raw, type } = ctx

  if (type === 'string') {
    listResult.push(raw[1])
    return true
  }

  // "xxx#{xxx}xxx"

  if (type === 'interpolation_start') {
    listResult.push(' . (')
    return true
  }

  if (type === 'interpolation_end') {
    listResult.push(') . ')
    return true
  }

  return false
}

// export
export default main