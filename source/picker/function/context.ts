import sortBy from 'lodash/sortBy'

import { Context } from '../../entry/type'
import Item from '../../module/Item'

// variable

const listCache: [number, Item[]][] = []
const listContent: Item[] = []
const listParam: Item[][] = []
let countIgnore = 0

// function

const cache = (ctx: Context, item: Item, i: number): void => {
  const scope2 = [item.scope.slice(0, item.scope.length - 1)]
  scope2[1] = [...scope2[0], 'call']

  let listItem: Item[] = []
  for (const listIt of listParam) {
    for (const it of listIt) {
      it.scope = it.scope
        .join(',')
        .replace(/^.*?parameter/u, scope2[1].join(','))
        .split(',') as Item['scope']
      listItem.push(it)
    }
    listItem.push(Item.new('sign', ',', scope2[1]))
  }
  listItem.pop()

  listItem = [
    Item.new('.', '.', scope2[0]),
    Item.new('identifier', 'Bind', scope2[0]),
    Item.new('edge', 'call-start', scope2[1]),
    ...listItem,
    Item.new('edge', 'call-end', scope2[1]),
  ]

  listCache.push([findIndex(ctx, item, i) + 1, listItem])
}

const findIndex = (ctx: Context, item: Item, i: number): number => {
  const { content } = ctx

  const it = content.eq(i)
  if (!it) return 0
  if (
    Item.is(it, 'edge', 'block-end') &&
    it.scope.join('|') === item.scope.join('|')
  )
    return i
  return findIndex(ctx, item, i + 1)
}

const main = (ctx: Context): void => {
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
    if (listParam.length && Item.is(item, 'edge', 'block-start')) {
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

  content.load(listContent)
}

const pick = (ctx: Context, item: Item, i: number): boolean => {
  const { content } = ctx

  // find `fn(x = x)`
  //            ^
  if (!Item.is(item, 'sign', '=')) return false
  if (item.scope[item.scope.length - 1] !== 'parameter') return false

  const itNext = content.eq(i + 1)
  if (!['identifier', 'this'].includes(itNext.type)) return false
  const itPrev = content.eq(i - 1)
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

  const it = content.eq(i)
  if (!it) return listItem

  if (
    it.scope.join('') === item.scope.join('') &&
    (Item.is(it, 'sign', ',') || Item.is(it, 'edge', 'parameter-end'))
  )
    return listItem

  listItem.push(it)
  return pickItem(ctx, item, i + 1, listItem)
}

// export
export default main
