import Item from '../../../models/Item.js'
import { findIndex } from '../../../utils/arrayHelpers.js'

import type Scope from '../../../models/Scope'
import type { Context } from '../../../types'

export const pickItem = (
  ctx: Context,
  count: number,
  i: number,
  scope: Scope['list'],
  listResult: Item[] = [],
): Item[] => {
  const { content } = ctx

  const item = content.at(i)
  if (!item) return listResult

  const it = item.clone()

  // reset scope
  for (let j = 0; j < scope.length - 1; j++) it.scope.shift()

  listResult.push(it)

  if (!item.is('edge', 'block-end') || !item.scope.isEqual(scope)) {
    item.type = 'void'
    return pickItem(ctx, count, i + 1, scope, listResult)
  }

  // last one
  item.type = 'native'
  item.value = `Func("${ctx.options.salt}_${count}")`
  listResult.push(new Item('new-line', '0', scope))

  // reset indent
  const diff: number =
    parseInt(
      listResult[
        findIndex(listResult, {
          type: 'new-line',
        })
      ].value,
      10,
    ) - 1
  if (diff > 0) {
    listResult.forEach((it2) => {
      if (it2.type !== 'new-line') return
      let value = parseInt(it2.value, 10) - diff
      if (value < 0) value = 0
      it2.value = value.toString()
    })
  }

  return listResult
}
