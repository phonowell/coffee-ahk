import Item from '../../../models/Item.js'
import Scope from '../../../models/Scope.js'

import type { Range } from './types.js'
import type { Context } from '../../../types'

export const processIdentifierType = (
  ctx: Context,
  range: Range,
  listUnwrap: Item[],
  arrayItems: Item[],
  update: (range: Range, list: Item[]) => void,
) => {
  ctx.flag.isChangeIndexUsed = true // set flag

  const list = [...listUnwrap]
  const firstItem = list.at(0)
  if (!firstItem) return
  const scp = firstItem.scope
  const scpCall = new Scope([...scp.list, 'call'])

  update(range, [
    new Item('identifier', `__ci_${ctx.options.salt}__`, scp),
    new Item('edge', 'call-start', scpCall),
    ...arrayItems.map((it) => it.clone()),
    new Item('sign', ',', scpCall),
    ...list,
    new Item('edge', 'call-end', scpCall),
  ])
}

export const processNumberType = (
  range: Range,
  listUnwrap: Item[],
  update: (range: Range, list: Item[]) => void,
) => {
  const first = listUnwrap.at(0)
  if (!first) return

  const list =
    listUnwrap.length === 1
      ? [
          new Item(
            first.type,
            (parseFloat(first.value) + 1).toString(),
            first.scope,
          ),
        ]
      : [
          ...listUnwrap,
          new Item('math', '+', first.scope),
          new Item('number', '1', first.scope),
        ]

  update(range, list)
}

// Handle negative index: arr[-1] → arr[arr.Length()]
export const processNegativeIndex = (
  range: Range,
  listUnwrap: Item[],
  arrayItems: Item[],
  update: (range: Range, list: Item[]) => void,
) => {
  const first = listUnwrap.at(0)
  const second = listUnwrap.at(1)
  if (!first || !second || arrayItems.length === 0) return

  const scp = first.scope
  const scpCall = new Scope([...scp.list, 'call'])
  const negNum = parseFloat(second.value)

  // arr[-1] → arr[arr.Length()]
  // arr[-2] → arr[arr.Length() - 1]
  const offset = 1 - negNum // -1 → 0, -2 → -1

  const list: Item[] = [
    ...arrayItems.map((it) => it.clone()),
    new Item('.', '.', scp),
    new Item('property', 'Length', scp),
    new Item('edge', 'call-start', scpCall),
    new Item('edge', 'call-end', scpCall),
  ]

  if (offset !== 0) {
    list.push(new Item('math', offset > 0 ? '+' : '-', scp))
    list.push(new Item('number', Math.abs(offset).toString(), scp))
  }

  update(range, list)
}
