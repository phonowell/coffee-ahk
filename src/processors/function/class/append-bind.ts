import Item from '../../../models/Item.js'

import type { Context } from '../../../types'

export const findEdge = (ctx: Context, i: number, item: Item): number => {
  const { content } = ctx

  const it = content.at(i)
  if (!it) return 0
  if (
    it.is('edge', 'parameter-start') &&
    item.scope.isEqual([...it.scope.slice(0, it.scope.length - 1), 'function'])
  )
    return i
  return findEdge(ctx, i - 1, item)
}

export const appendBind = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    listContent.push(item)
    if (!item.is('edge', 'block-end')) return
    if (item.scope.at(-1) !== 'function') return
    if (item.scope.at(-2) !== 'class') return

    const index = findEdge(ctx, i, item)
    if (content.at(index - 1)?.is('property', 'constructor')) return

    const scope2: [typeof item.scope.list, typeof item.scope.list] = [
      item.scope.list,
      [...item.scope.list, 'call'],
    ]
    listContent.push(new Item('.', '.', scope2[0]))
    listContent.push(new Item('identifier', 'Bind', scope2[0]))
    listContent.push(new Item('edge', 'call-start', scope2[1]))
    listContent.push(new Item('this', 'this', scope2[1]))
    listContent.push(new Item('edge', 'call-end', scope2[1]))
  })

  content.reload(listContent)
}
