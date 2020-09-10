// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cacheBlock, listResult, type, value } = ctx

  if (type === '[') {
    cacheBlock.push('array')
    listResult.push(value)
    return true
  }

  if (type === ']') {
    cacheBlock.pop()
    listResult.push(value)
    return true
  }

  return false
}

// export
export default main