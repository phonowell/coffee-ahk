import Item from '../../../models/Item.js'
import Scope from '../../../models/Scope.js'

import type { Range } from './types.js'
import type { Context } from '../../../types'

/**
 * Check if the index is a single non-negative integer literal.
 * Returns the numeric value for compile-time optimization, or null if not applicable.
 */
export const isSimpleNonNegativeIndex = (listUnwrap: Item[]): number | null => {
  if (listUnwrap.length !== 1) return null

  const item = listUnwrap.at(0)
  if (item?.type !== 'number') return null

  const num = Number(item.value)
  if (!Number.isInteger(num) || num < 0) return null

  return num
}

/**
 * Process simple non-negative integer index at compile-time.
 * arr[0] → arr[1], arr[5] → arr[6]
 */
export const processSimpleIndex = (
  range: Range,
  index: number,
  scope: Scope,
  update: (range: Range, list: Item[]) => void,
) => {
  update(range, [new Item('number', String(index + 1), scope)])
}

/**
 * Process array index using __ci__ helper function.
 *
 * The __ci__ helper handles all index types uniformly at runtime:
 * - Positive numbers: 0→1 conversion (arr[0] → arr[1])
 * - Negative numbers: Python-style negative indexing (arr[-1] → arr[arr.Length()])
 * - Variables/expressions: runtime conversion based on actual value
 *
 * This unified approach ensures correct behavior for chained indices
 * like nested[0][-1] where compile-time expansion would fail.
 */
export const processIndexWithHelper = (
  ctx: Context,
  range: Range,
  listUnwrap: Item[],
  arrayItems: Item[],
  update: (range: Range, list: Item[]) => void,
) => {
  ctx.flag.isChangeIndexUsed = true

  const list = [...listUnwrap]
  const firstItem = list.at(0)
  if (!firstItem) return

  const scp = firstItem.scope
  const scpCall = new Scope([...scp.toArray(), 'call'])

  update(range, [
    new Item('identifier', `__ci_${ctx.options.salt}__`, scp),
    new Item('edge', 'call-start', scpCall),
    ...arrayItems.map((it) => it.clone()),
    new Item('sign', ',', scpCall),
    ...list,
    new Item('edge', 'call-end', scpCall),
  ])
}
