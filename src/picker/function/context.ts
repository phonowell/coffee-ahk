import Item from '../../models/Item.js'
import sortBy from '../../utils/sortBy.js'

import type Scope from '../../models/Scope'
import type { Context } from '../../types'

const listCache: [number, Item[]][] = []
const listContent: Item[] = []
const listParam: Item[][] = []
let countIgnore = 0

const cache = (ctx: Context, item: Item, i: number) => {
  const scp = [item.scope.slice(0, item.scope.length - 1)]
  scp[1] = [...scp[0], 'call']

  let listItem: Item[] = []
  for (const listIt of listParam) {
    for (const it of listIt) {
      it.scope.reload(
        it.scope.list
          .join(',')
          .replace(/^.*?parameter/u, scp[1].join(','))
          .split(',') as Scope['list'],
      )
      listItem.push(it)
    }
    listItem.push(new Item('sign', ',', scp[1]))
  }
  listItem.pop()

  listItem = [
    new Item('.', '.', scp[0]),
    new Item('identifier', 'Bind', scp[0]),
    new Item('edge', 'call-start', scp[1]),
    ...listItem,
    new Item('edge', 'call-end', scp[1]),
  ]

  listCache.push([findIndex(ctx, item, i) + 1, listItem])
}

const findIndex = (ctx: Context, item: Item, i: number): number => {
  const { content } = ctx

  const it = content.at(i)
  if (!it) return 0
  if (it.is('edge', 'block-end') && it.scope.isEquals(item.scope)) return i
  return findIndex(ctx, item, i + 1)
}

const main = (ctx: Context) => {
  const { content } = ctx

  // reset
  countIgnore = 0
  listContent.length = 0
  listCache.length = 0
  listParam.length = 0

  // each
  content.list.forEach((item, i) => {
    // ignore
    if (countIgnore) {
      countIgnore--
      listContent.push(new Item('void', '', []))
      return
    }

    // cache
    if (listParam.length && item.is('edge', 'block-start')) {
      listContent.push(item)
      cache(ctx, item, i)
      listParam.length = 0
      return
    }

    if (!pick(ctx, item, i)) listContent.push(item)
  })

  // insert
  for (const [index, listItem] of sortBy(
    listCache,
    (item) => item[0],
  ).reverse())
    listContent.splice(index, 0, ...listItem)

  content.reload(listContent)
}

const pick = (ctx: Context, item: Item, i: number): boolean => {
  const { content } = ctx

  // find `fn(x = x)`
  //            ^
  if (!item.is('sign', '=')) return false
  if (item.scope.at(-1) !== 'parameter') return false

  const itNext = content.at(i + 1)
  if (!itNext) return false
  if (!['identifier', 'this'].includes(itNext.type)) return false

  const itPrev = content.at(i - 1)
  if (!itPrev) return false
  if (!['identifier', 'this'].includes(itPrev.type)) return false

  // pick
  listContent.push(new Item('void'))
  listParam.push(pickItem(ctx, itNext, i + 1))
  countIgnore = listParam[listParam.length - 1].length
  return true
}

const pickItem = (
  ctx: Context,
  item: Item,
  i: number,
  listItem: Item[] = [],
): Item[] => {
  const { content } = ctx

  const it = content.at(i)
  if (!it) return listItem

  if (
    it.scope.isEquals(item.scope) &&
    (it.is('sign', ',') || it.is('edge', 'parameter-end'))
  )
    return listItem

  listItem.push(it)
  return pickItem(ctx, item, i + 1, listItem)
}

export default main
