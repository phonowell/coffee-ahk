import _ from 'lodash'
import { insertIndent, isBreak } from '../toolkit'

// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cacheBlock, listResult, type, value } = ctx

  if (type === 'terminator' && value === '\n') {

    if (['array', 'object'].includes(cacheBlock.last)) {
      const last = _.last(listResult)
      if (typeof last !== 'string' || last.trim() !== ',') {
        if (isBreak(last)) listResult.pop()
        listResult.push(
          ',',
          '\n' + insertIndent(ctx)
        )
      }
      return true
    }

    listResult.push(value)
    return true
  }

  return false
}

// export
export default main