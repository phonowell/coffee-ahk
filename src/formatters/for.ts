import { INDEX_FOR, VAL_FOR } from '../constants.js'
import { ErrorType, TranspileError } from '../utils/error.js'

import type { ItemTypeMap } from '../models/ItemType.js'
import type { Context } from '../types/index.js'

const main = (ctx: Context) => {
  const { content, scope, type, value } = ctx

  if (type === 'for') {
    scope.push('for')
    content.push({ type: 'for', value: 'for' })
    return true
  }

  if (['forin', 'forof'].includes(type)) {
    const list: string[] = []

    const last = content.pop()
    if (last?.is('edge', 'array-end')) {
      throw new TranspileError(
        ctx,
        ErrorType.UNSUPPORTED,
        `for loop destructuring 'for [a, b] in arr' is not supported`,
        `Use 'for item in arr' then '[a, b] = item'`,
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

    // Single variable: 'for v in arr' iterates values (index placeholder first),
    // 'for k of obj' iterates keys (value placeholder second) — AHK key comes first
    if (list.length === 1) {
      if (type === 'forin') list.unshift(INDEX_FOR)
      else list.push(VAL_FOR)
    }

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
