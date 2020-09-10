// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type } = ctx

  if (type === '[') {
    cache.push('array')
    content.push('[')
    return true
  }

  if (type === ']') {
    cache.pop()
    if (content.last.type === 'new-line' && content.eq(-2).type === '}') content.pop()
    content.push(']')
    return true
  }

  return false
}

// export
export default main