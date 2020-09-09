import _ from 'lodash'

// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cacheBlock, listResult, raw, type } = ctx

  if (type === '->') {
    if (_.last(listResult) === ' := ') {
      listResult.pop()
      listResult.push('(')
      listResult.push(')')
    }
    cacheBlock.push('function')
    return true
  }

  if (type === 'param_start') {
    if (_.last(listResult) === ' := ')
      listResult.pop()
    listResult.push(raw[1])
    return true
  }

  if (type === 'param_end') {
    listResult.push(raw[1])
    return true
  }

  if (type === 'call_start' || type === 'call_end') {
    listResult.push(raw[1])
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