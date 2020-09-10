import { insertIndent } from '../toolkit'

// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cacheBlock, listResult, type } = ctx

  if (type === 'indent') {
    ctx.indent++

    const last = cacheBlock.last
    if (last === 'else')
      listResult.push('{')
    if (last === 'function')
      listResult.push(' {')
    if (last === 'if') {
      listResult.push(')', ' {')
    }

    listResult.push('\n' + insertIndent(ctx))
    return true
  }

  if (type === 'outdent') {
    ctx.indent--
    listResult.push('\n' + insertIndent(ctx))

    if (!cacheBlock.last) return true

    if (['array', 'object'].includes(cacheBlock.last))
      return true

    cacheBlock.pop()
    listResult.push('}')
    return true
  }

  return false
}

// export
export default main