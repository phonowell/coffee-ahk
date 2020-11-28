// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, raw, type } = ctx

  if (type === '{') {

    if (
      cache.last === 'class'
      && !content.equal(content.last, 'sign', '=')
    ) return true

    if (content.last.type === 'new-line' && raw.generated)
      content.pop()

    cache.push('object')
    content.push('bracket', '{')
    return true
  }

  if (type === '}') {

    if (cache.last === 'class') return true

    if (raw.generated) content.push('bracket', '}-')
    else content.push('bracket', '}')
    cache.pop()
    return true
  }

  return false
}

// export
export default main