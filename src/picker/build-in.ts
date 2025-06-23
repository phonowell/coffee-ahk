// Main build-in picker orchestrator
import Item from '../models/Item.js'

import { changeIndex } from './build-in/change-index.js'
import { returnFunction } from './build-in/return-function.js'

import type { Context } from '../types'

const insert = (ctx: Context, flag: string, fn: Item[]) => {
  const { content } = ctx

  if (ctx.flag[flag]) {
    const listItem: Item[] = fn.map(
      (it) => new Item(it.type, it.value, it.scope),
    )
    if (!listItem.length) return

    listItem[1].value = listItem[1].value.replace(
      /_salt_/g,
      `_${ctx.options.salt}_`,
    )

    content.reload([...listItem, ...content.list])
  }
}

const main = (ctx: Context) => {
  if (!ctx.options.builtins) return
  insert(ctx, 'isChangeIndexUsed', changeIndex)
  if (ctx.options.track) insert(ctx, 'isFunctionIncluded', returnFunction)
}

export default main
