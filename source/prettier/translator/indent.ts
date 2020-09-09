import { insertIndent } from '../fn'

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
      listResult.push(')')
      listResult.push(' {')
    }

    listResult.push(`\n${insertIndent(ctx)}`)
    return true
  }

  if (type === 'outdent') {
    ctx.indent--
    if (cacheBlock.validate(cacheBlock.pop()))
      listResult.push(`\n${insertIndent(ctx)}}`)
    return true
  }

  return false
}

// export
export default main