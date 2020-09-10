import _ from 'lodash'
import { insertIndent } from '../toolkit'

// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cacheBlock, listResult, raw, type, value } = ctx

  if (type === '{') {
    cacheBlock.push('object')

    if (raw.generated) {
      if ((_.last(listResult) as string).startsWith('\n')) {
        listResult.pop()
        listResult.push(
          value,
          '\n' + insertIndent(ctx)
        )
        return true
      }
    }

    listResult.push(value)
    return true
  }

  if (type === '}') {
    cacheBlock.pop()

    if (raw.generated)
      if (raw.origin && raw.origin[0].toLowerCase() === 'outdent') {
        // ctx.indent--
        listResult.push(
          '\n' + insertIndent(ctx, -1),
          value
        )
        return true
      }

    listResult.push(value)
    return true
  }

  return false
}

// export
export default main