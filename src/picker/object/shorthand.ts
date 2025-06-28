// Object shorthand property processing
import Item from '../../models/Item.js'

import type { Context } from '../../types'

export const deconstruct2 = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []

  // each
  content.list.forEach((item, i) => {
    listContent.push(item)

    if (!item.is('identifier')) return
    if (item.scope.at(-1) !== 'object') return

    const prev = content.at(i - 1)
    if (!prev) return
    if (!(prev.is('bracket', '{') || prev.is('sign', ','))) return

    const next = content.at(i + 1)
    if (!next) return
    if (!(next.is('bracket', '}') || next.is('sign', ','))) return

    listContent.push(
      new Item('sign', ':', item.scope.list),
      new Item('identifier', item.value, item.scope.list),
    )
  })

  // reload
  content.reload(listContent)
}
