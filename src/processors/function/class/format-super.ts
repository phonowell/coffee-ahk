import Item from '../../../models/Item.js'

import type { Context } from '../../../types'

export const formatSuper = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.toArray().forEach((item, i) => {
    listContent.push(item)
    if (!item.is('super')) return

    const next = content.at(i + 1)
    if (!next?.is('edge', 'call-start')) return

    const scope2 = next.scope.toArray()

    listContent.push(
      new Item({ type: '.', value: '.', scope: scope2 }),
      new Item({ type: 'property', value: '__New', scope: scope2 }),
    )
  })

  content.reload(listContent)
}
