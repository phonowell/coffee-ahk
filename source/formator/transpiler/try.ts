// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type } = ctx

  if (type === 'catch') {
    cache.next = 'catch'
    content.push('try', 'catch')
    return true
  }

  if (type === 'finally') {
    content.push('try', 'finally')
    cache.push('finally')
    content.push('edge', 'block-start')
    return true
  }

  if (type === 'try') {
    content.push('try')
    cache.push('try')
    content.push('edge', 'block-start')
    return true
  }

  return false
}

// export
export default main