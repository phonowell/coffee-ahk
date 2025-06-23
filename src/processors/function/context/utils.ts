// Utility functions for function context
import type Item from '../../../models/Item'
import type { Context } from '../../../types'

export const pickItem = (
  ctx: Context,
  item: Item,
  i: number,
  listItem: Item[] = [],
): Item[] => {
  const { content } = ctx

  const it = content.at(i)
  if (!it) return listItem

  if (
    it.scope.isEqual(item.scope) &&
    (it.is('sign', ',') || it.is('edge', 'parameter-end'))
  )
    return listItem

  listItem.push(it)
  return pickItem(ctx, item, i + 1, listItem)
}
