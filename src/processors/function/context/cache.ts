// Cache handling for function context
import Item from '../../../models/Item.js'
import { sortBy } from '../../../utils/dataHelpers.js'

import type Scope from '../../../models/Scope'
import type { Context } from '../../../types'

const listCache: [number, Item[]][] = []
const listContent: Item[] = []
const listParam: Item[][] = []
let countIgnore = 0

export const getListCache = () => listCache
export const getListContent = () => listContent
export const getListParam = () => listParam
export const getCountIgnore = () => countIgnore
export const setCountIgnore = (value: number) => {
  countIgnore = value
}

export const resetCache = () => {
  countIgnore = 0
  listContent.length = 0
  listCache.length = 0
  listParam.length = 0
}

export const insertCache = () => {
  for (const [index, listItem] of sortBy(
    listCache,
    (item) => item[0],
  ).reverse())
    listContent.splice(index, 0, ...listItem)
}

const findIndex = (ctx: Context, item: Item, i: number): number => {
  const { content } = ctx

  const it = content.at(i)
  if (!it) return 0
  if (it.is('edge', 'block-end') && it.scope.isEqual(item.scope)) return i
  return findIndex(ctx, item, i + 1)
}

export const cache = (ctx: Context, item: Item, i: number) => {
  const scp0 = item.scope.slice(0, item.scope.length - 1)
  const scp: [typeof scp0, typeof scp0] = [scp0, [...scp0, 'call']]

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
