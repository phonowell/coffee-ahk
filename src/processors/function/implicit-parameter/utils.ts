// Utility functions for implicit parameters
import type Item from '../../../models/Item.js'
import type { Context } from '../../../types'

export const findFunctionStart = (ctx: Context, i: number): number => {
  const { content } = ctx
  const it = content.at(i)

  if (it?.is('edge', 'block-start')) return i

  return findFunctionStart(ctx, i + 1)
}

export const removeTrailingComma = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    if (item.is('sign', ',') && content.at(i + 1)?.is('edge', 'parameter-end'))
      return

    listContent.push(item)
  })

  content.reload(listContent)
}
