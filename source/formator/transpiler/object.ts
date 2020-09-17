// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, raw, type } = ctx

  if (type === '{') {
    cache.push('object')

    if (content.last.type === 'new-line' && raw.generated)
      content.pop()

    content.push('{')
    return true
  }

  if (type === '}') {
    cache.pop()
    content.push('}')
    return true
  }

  return false
}

// export
export default main