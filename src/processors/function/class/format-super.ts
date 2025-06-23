import Item from '../../../models/Item.js'

import type { Context } from '../../../types'

export const formatSuper = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    listContent.push(item)
    if (!item.is('super')) return

    const next = content.at(i + 1)
    if (!next?.is('edge', 'call-start')) return

    const scope2 = next.scope.list

    listContent.push(
      new Item('.', '.', scope2),
      new Item('property', '__New', scope2),
    )
  })

  content.reload(listContent)
}
