import { sortBy } from 'lodash'

import { Context } from '../../types'
import Item from '../../module/Item'

// variables

const listCache: [number, Item[]][] = []
const listContent: Item[] = []
const listParam: Item[][] = []
let countIgnore = 0

// functions

const cache = (ctx: Context, item: Item, i: number) => {
  const scp = [item.scope.slice(0, item.scope.length - 1)]
  scp[1] = [...scp[0], 'call']

  let listItem: Item[] = []
  for (const listIt of listParam) {
    for (const it of listIt) {
      it.scope = it.scope
        .join(',')
        .replace(/^.*?parameter/u, scp[1].join(','))
        .split(',') as Item['scope']
      listItem.push(it)
    }
    listItem.push(Item.new('sign', ',', scp[1]))
  }
  listItem.pop()

  listItem = [
    Item.new('.', '.', scp[0]),
    Item.new('identifier', 'Bind', scp[0]),
    Item.new('edge', 'call-start', scp[1]),
    ...listItem,
    Item.new('edge', 'call-end', scp[1]),
  ]

  listCache.push([findIndex(ctx, item, i) + 1, listItem])
}

const findIndex = (ctx: Context, item: Item, i: number): number => {
  const { content } = ctx

  const it = content.at(i)
  if (!it) return 0
  if (it.is('edge', 'block-end') && it.isScopeEqual(item)) return i
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
      listContent.push(Item.new('void', '', []))
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
  for (const [index, listItem] of sortBy(listCache, item => item[0]).reverse())
    listContent.splice(index, 0, ...listItem)

  content.reload(listContent)
}

const pick = (ctx: Context, item: Item, i: number): boolean => {
  const { content } = ctx

  // find `fn(x = x)`
  //            ^
  if (!item.is('sign', '=')) return false
  if (item.scopeAt(-1) !== 'parameter') return false

  const itNext = content.at(i + 1)
  if (!itNext) return false
  if (!['identifier', 'this'].includes(itNext.type)) return false

  const itPrev = content.at(i - 1)
  if (!itPrev) return false
  if (!['identifier', 'this'].includes(itPrev.type)) return false

  // pick
  listContent.push(Item.new('void'))
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
    it.isScopeEqual(item) &&
    (it.is('sign', ',') || it.is('edge', 'parameter-end'))
  )
    return listItem

  listItem.push(it)
  return pickItem(ctx, item, i + 1, listItem)
}

// export
export default main
