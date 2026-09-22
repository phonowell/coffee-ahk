import { INDEX_FOR, VAL_FOR } from '../constants.js'
import { ErrorType, TranspileError } from '../utils/error.js'

import type { ItemTypeMap } from '../models/ItemType.js'
import type { Context } from '../types/index.js'

const main = (ctx: Context) => {
  const { content, scope, type, value } = ctx

  // Bare `when`/`by`/`own` only appear as for-loop modifiers
  // (`for x in y when c`, `by step`, `for own k of o`) — none supported.
  // (Switch `when` arrives as 'leading_when', handled by the switch formatter.)
  if (['when', 'by', 'own'].includes(type)) {
    throw new TranspileError(
      ctx,
      ErrorType.UNSUPPORTED,
      `for-loop modifier '${type}' is not supported`,
      `Rewrite as a statement-level for loop without '${type}'`,
    )
  }

  if (type === 'for') {
    // `for` must start a statement — a mid-line `for` is a postfix loop or
    // comprehension (`x = (v*2 for v in list)`), which AHK cannot express
    const prev = content.at(-1)
    if (prev && prev.type !== 'new-line' && !prev.is('edge', 'block-start')) {
      throw new TranspileError(
        ctx,
        ErrorType.UNSUPPORTED,
        `postfix/comprehension 'for' is not supported`,
        `Rewrite as a statement-level for loop`,
      )
    }
    scope.push('for')
    content.push({ type: 'for', value: 'for' })
    return true
  }

  if (['forin', 'forof'].includes(type)) {
    const list: string[] = []

    const last = content.pop()
    // Only plain identifier targets are supported — `for [a, b] in` /
    // `for {a, b} in` destructuring and member targets would corrupt output
    if (!last || last.type !== 'identifier') {
      throw new TranspileError(
        ctx,
        ErrorType.UNSUPPORTED,
        `for loop destructuring or non-identifier target is not supported`,
        `Use 'for item in arr' then '[a, b] = item' or '{a, b} = item'`,
      )
    }
    list.push(last.value)

    const last2 = content.at(-1)
    if (last2?.is('sign', ',')) {
      content.pop()

      const last3 = content.pop()
      if (!last3 || last3.type !== 'identifier') {
        throw new TranspileError(
          ctx,
          ErrorType.UNSUPPORTED,
          `for loop destructuring or non-identifier target is not supported`,
          `Use 'for item in arr' then '[a, b] = item' or '{a, b} = item'`,
        )
      }
      list.unshift(last3.value)
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
