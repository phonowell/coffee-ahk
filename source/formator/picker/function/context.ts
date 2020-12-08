import sortBy from 'lodash/sortBy'

// interface

import { Context } from '../../type'
type Item = Context['content']['list'][number]

// variable

const listParam: Item[][] = []
let countIgnore = 0
let listCache: [number, Item[]][] = []
let listContent: Item[] = []

// function

function cache(
  ctx: Context,
  item: Item,
  i: number
): void {

  const { content } = ctx

  const _scope = [item.scope.slice(0, item.scope.length - 1)]
  _scope[1] = [..._scope[0], 'call']

  let listItem: Item[] = []
  for (const listIt of listParam) {
    for (const item of listIt) {
      item.scope = item.scope.join(',')
        .replace(/^.*?parameter/, _scope[1].join(','))
        .split(',') as Item['scope']
      listItem.push(item)
    }
    listItem.push(content.new('sign', ',', _scope[1]))
  }
  listItem.pop()

  listItem = [
    content.new('.', '.', _scope[0]),
    content.new('identifier', 'Bind', _scope[0]),
    content.new('edge', 'call-start', _scope[1]),
    ...listItem,
    content.new('edge', 'call-end', _scope[1])
  ]

  listCache.push([
    findIndex(ctx, item, i) + 1,
    listItem
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
    content.equal(it, 'edge', 'block-end')
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
      listContent.push(content.new('void', '', []))
      return
    }

    // cache
    if (listParam.length && content.equal(item, 'edge', 'block-start')) {
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

  if (!content.equal(item, 'sign', '=')) return false
  if (item.scope[item.scope.length - 1] !== 'parameter') return false

  const itNext = content.eq(i + 1)
  if (!['identifier', 'this'].includes(itNext.type)) return false
  const itPrev = content.eq(i - 1)
  if (!['identifier', 'this'].includes(itPrev.type)) return false

  // pick
  listContent.push(content.new('void'))
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
    && (content.equal(it, 'sign', ',') || content.equal(it, 'edge', 'parameter-end'))
  ) return listItem

  listItem.push(it)
  return pickItem(ctx, item, i + 1, listItem)
}

// export
export default main