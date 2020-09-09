// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { listResult, raw, type } = ctx

  if (type === 'identifier') {
    listResult.push(raw[1])
    return true
  }

  if (ctx.type === '=') {
    listResult.push(' := ')
    return true
  }

  return false
}

// export
export default main