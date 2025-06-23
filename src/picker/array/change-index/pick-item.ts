import type Item from '../../../models/Item.js'
import type { Context } from '../../../types'

export const pickItem = (
  ctx: Context,
  item: Item,
  i: number,
  countIgnore: { value: number },
  listResult: Item[] = [],
): [number, Item[]] => {
  const { content } = ctx
  const it = content.at(i)
  if (!it) {
    countIgnore.value = 0
    return [i, listResult]
  }

  listResult.push(it)

  if (it.is('edge', 'index-start') && it.scope.isEqual(item.scope)) {
    countIgnore.value++
    return pickItem(ctx, item, i + 1, countIgnore, listResult)
  }

  if (it.is('edge', 'index-end') && it.scope.isEqual(item.scope)) {
    countIgnore.value--
    if (countIgnore.value === 0) return [i, listResult]
    return pickItem(ctx, item, i + 1, countIgnore, listResult)
  }

  return pickItem(ctx, item, i + 1, countIgnore, listResult)
}
