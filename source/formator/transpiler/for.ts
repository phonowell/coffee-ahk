// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type, value } = ctx

  if (type === 'for') {
    cache.push('for')
    content.push('for')
    return true
  }

  if (['forin', 'forof'].includes(type)) {

    const list: string[] = []

    const last = content.pop()
    list.push(last.value)

    const _last = content.last
    if (content.equal(_last, 'sign', ',')) {
      content.pop()
      list.unshift(content.pop().value)
    }

    if (type === 'forin')
      list.reverse()

    if (list.length === 1)
      list.unshift('__i__')

    content
      .push('identifier', list[0])
      .push('sign', ',')
      .push('identifier', list[1])
      .push('for-in', value)
    return true
  }

  return false
}

// export
export default main