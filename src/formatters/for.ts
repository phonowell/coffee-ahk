import { INDEX_FOR, KEY_FOR } from '../constants.js'

import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, scope, type, value } = ctx

  if (type === 'for') {
    scope.push('for')
    content.push('for')
    return true
  }

  if (['forin', 'forof'].includes(type)) {
    const list: string[] = []

    const last = content.pop()
    if (last) list.push(last.value)

    const last2 = content.at(-1)
    if (last2?.is('sign', ',')) {
      content.pop()

      const last3 = content.pop()
      if (last3) list.unshift(last3.value)
    }

    if (type === 'forin') list.reverse()

    if (list.length === 1) list.unshift(type === 'forin' ? INDEX_FOR : KEY_FOR)

    content
      .push('identifier', list[0] ?? '')
      .push('sign', ',')
      .push('identifier', list[1] ?? '')
      .push('for-in', value)
    return true
  }

  return false
}

export default main
