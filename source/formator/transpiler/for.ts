// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type, value } = ctx

  if (type === 'for') {
    cache.push('for')
    content.push(ctx, 'for')
    return true
  }

  if (['forin', 'forof'].includes(type)) {

    const list: string[] = []

    const last = content.pop()
    list.push(last.value)

    const _last = content.last
    if (_last.type === ',') {
      content.pop()
      list.unshift(content.pop().value)
    }

    if (list.length === 1)
      list.unshift('__i__')

    content
      .push(ctx, 'identifier', list[0])
      .push(ctx, ',')
      .push(ctx, 'identifier', list[1])
      .push(ctx, 'for-in', value)
    return true
  }

  return false
}

// export
export default main