import type { Range } from './types.js'
import type Item from '../../../models/Item.js'
import type { Context } from '../../../types'

export const updateContent = (ctx: Context, range: Range, list: Item[]) => {
  const { content } = ctx
  const listContent: Item[] = content.list
  listContent.splice(range[0], range[1] - range[0] + 1, ...list)
  content.reload(listContent)
}
