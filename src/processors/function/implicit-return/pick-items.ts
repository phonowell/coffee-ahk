import type Item from '../../../models/Item.js'
import type Scope from '../../../models/Scope.js'
import type { Context } from '../../../types'

export const pickItems = (
  ctx: Context,
  options: {
    i: number
    list: Item[]
    scope: Scope
  },
): Item[] => {
  const { content } = ctx
  const { i, list, scope } = options

  const item = content.at(i)
  if (!item) return list

  list.push(item)

  const isEnded = item.is('edge', 'block-end') && item.scope.isEqual(scope)

  if (!isEnded) {
    return pickItems(ctx, {
      i: i + 1,
      list,
      scope,
    })
  }

  return list
}
