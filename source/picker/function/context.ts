import { Context } from '../../entry/type'
import Item from '../../module/Item'
import sortBy from 'lodash/sortBy'

// variable

const listCache: [number, Item[]][] = []
const listContent: Item[] = []
const listParam: Item[][] = []
let countIgnore = 0

// function

function cache(
  ctx: Context,
  item: Item,
  i: number
): void {

  const _scope = [item.scope.slice(0, item.scope.length - 1)]
  _scope[1] = [..._scope[0], 'call']

  let listItem: Item[] = []
  for (const listIt of listParam) {
    for (const it of listIt) {
      it.scope = it.scope.join(',')
        .replace(/^.*?parameter/u, _scope[1].join(','))
        .split(',') as Item['scope']
      listItem.push(it)
    }
    listItem.push(Item.new('sign', ',', _scope[1]))
  }
  listItem.pop()

  listItem = [
    Item.new('.', '.', _scope[0]),
    Item.new('identifier', 'Bind', _scope[0]),
    Item.new('edge', 'call-start', _scope[1]),
    ...listItem,
    Item.new('edge', 'call-end', _scope[1]),
  ]

  listCache.push([
    findIndex(ctx, item, i) + 1,
    listItem,
  ])
}

function findIndex(
  ctx: Context,
  item: Item,
  i: number
): number {

  const { content } = ctx

  const it = content.eq(i)
  if (!it) return 0
  if (
    Item.equal(it, 'edge', 'block-end')
    && it.scope.join('|') === item.scope.join('|')
  ) return i
  return findIndex(ctx, item, i + 1)
}

function main(
  ctx: Context
): void {

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
    if (listParam.length && Item.equal(item, 'edge', 'block-start')) {
      listContent.push(item)
      cache(ctx, item, i)
      listParam.length = 0
      return
    }

    // find `fn(x = x)`
    //            ^
    if (!pick(ctx, item, i))
      listContent.push(item)
  })

  // insert
  for (const [index, listItem] of sortBy(listCache, item => item[0]).reverse())
    listContent.splice(index, 0, ...listItem)

  content.load(listContent)
}

function pick(
  ctx: Context,
  item: Item,
  i: number
): boolean {

  const { content } = ctx

  if (!Item.equal(item, 'sign', '=')) return false
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

function pickItem(
  ctx: Context,
  item: Item,
  i: number,
  listItem: Item[] = []
): Item[] {

  const { content } = ctx

  const it = content.eq(i)
  if (!it) return listItem

  if (
    it.scope.join('') === item.scope.join('')
    && (Item.equal(it, 'sign', ',') || Item.equal(it, 'edge', 'parameter-end'))
  ) return listItem

  listItem.push(it)
  return pickItem(ctx, item, i + 1, listItem)
}

// export
export default main
