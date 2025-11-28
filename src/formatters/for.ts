import { INDEX_FOR, KEY_FOR } from '../constants.js'

import type { ItemTypeMap } from '../models/ItemType'
import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, scope, type, value, token } = ctx

  if (type === 'for') {
    scope.push('for')
    content.push({ type: 'for', value: 'for' })
    return true
  }

  if (['forin', 'forof'].includes(type)) {
    const list: string[] = []

    const last = content.pop()
    if (last?.is('edge', 'array-end')) {
      const line = token[2].first_line + 1
      throw new Error(
        `Coffee-AHK/unsupported (line ${line}): for loop destructuring 'for [a, b] in arr' is not supported. Use 'for item in arr' then '[a, b] = item'.`,
      )
    }
    if (last) list.push(last.value)

    const last2 = content.at(-1)
    if (last2?.is('sign', ',')) {
      content.pop()

      const last3 = content.pop()
      if (last3) list.unshift(last3.value)
    }

    if (type === 'forin') list.reverse()

    if (list.length === 1) list.unshift(type === 'forin' ? INDEX_FOR : KEY_FOR)

    content.push(
      { type: 'identifier', value: list[0] ?? '' },
      { type: 'sign', value: ',' },
      { type: 'identifier', value: list[1] ?? '' },
      { type: 'for-in', value: value as ItemTypeMap['for-in'] },
    )
    return true
  }

  return false
}

export default main
