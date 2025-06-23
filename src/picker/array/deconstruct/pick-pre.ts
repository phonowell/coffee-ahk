import { at } from 'fire-keeper'

import type Item from '../../../models/Item.js'
import type { Context } from '../../../types'

export const pickPre = (
  ctx: Context,
  i: number,
  listContent: Item[],
  listResult: Item[][] = [[]],
): Item[][] => {
  const { content } = ctx
  const it = content.at(i)
  if (!it) return listResult

  const last = at(listResult, -1)
  if (!last) return listResult

  if (it.is('edge', 'array-start')) return listResult

  if (it.is('sign', ',')) listResult.push([])
  else last.unshift(it)

  listContent.pop()
  return pickPre(ctx, i - 1, listContent, listResult)
}
