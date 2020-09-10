import _ from 'lodash'

// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cacheBlock, listResult, type, value } = ctx

  if (type === '->') {
    if (_.last(listResult) === ' := ') {
      listResult.pop()
      listResult.push('(', ')')
    }
    cacheBlock.push('function')
    return true
  }

  if (type === 'param_start') {
    if (_.last(listResult) === ' := ')
      listResult.pop()
    listResult.push(value)
    return true
  }

  if (type === 'param_end') {
    listResult.push(value)
    return true
  }

  if (type === 'call_start' || type === 'call_end') {
    listResult.push(value)
    return true
  }

  if (type === 'return') {
    listResult.push('return ')
    return true
  }

  return false
}

// export
export default main