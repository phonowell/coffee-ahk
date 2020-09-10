// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cacheBlock, listResult, raw,type } = ctx

  if (type === 'if') {
    cacheBlock.push('if')
    listResult.push(
      raw[1] === 'if' // if | unless
        ? 'if ('
        : 'if !('
    )
    return true
  }

  if (type === 'else') {
    cacheBlock.push('else')
    listResult.push(' else ')
    return true
  }

  return false
}

// export
export default main