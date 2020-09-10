// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { listResult, type, value } = ctx

  if (type === '=') {
    listResult.push(' := ')
    return true
  }

  if (['+', '-'].includes(type)) {
    listResult.push(` ${value} `)
    return true
  }

  if ([',', ':'].includes(type)) {
    listResult.push(`${value} `)
    return true
  }

  return false
}

// export
export default main