import Item from '../../../models/Item.js'
import Scope from '../../../models/Scope.js'

import type { Range } from './types.js'
import type { Context } from '../../../types'

export const processIdentifierType = (
  ctx: Context,
  range: Range,
  listUnwrap: Item[],
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
