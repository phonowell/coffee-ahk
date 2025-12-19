import { at } from 'fire-keeper'

import { TranspileError } from '../../../utils/error.js'

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

  // Detect nested array destructuring [a, [b, c]] = ...
  if (it.is('edge', 'array-end')) {
    throw new TranspileError(
      ctx,
      'unsupported',
      `nested array destructuring '[a, [b, c]] = x' is not supported. Flatten the destructuring manually.`,
    )
  }

  if (it.is('sign', ',')) listResult.push([])
  else last.unshift(it)

  listContent.pop()
  return pickPre(ctx, i - 1, listContent, listResult)
}
