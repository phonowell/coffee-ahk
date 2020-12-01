import sortBy from 'lodash/sortBy'

// interface

import { Context } from '../../type'
type Item = Context['content']['list'][number]

// variable

const listParam: string[] = []
let flagIgnore = false
let listCache: [number, Item[]][] = []
let listContent: Item[] = []

// function

function cache(
  ctx: Context,
  item: Item,
  i: number
): void {

  const { content } = ctx

  const scope = [item.scope.slice(0, item.scope.length - 1)]
  scope[1] = [...scope[0], 'call']

  let listItem: Item[] = listParam.map(
    name => content.new('identifier', name, scope[1])
  )

  const limit = listItem.length - 1
  for (let j = 0; j < limit; j++)
    listItem.splice(limit - j, 0, content.new('sign', ',', scope[1]))

  listItem = [
    content.new('.', '.', scope[0]),
    content.new('identifier', 'Bind', scope[0]),
    content.new('edge', 'call-start', scope[1]),
    ...listItem,
    content.new('edge', 'call-end', scope[1])
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
  flagIgnore = false
  listContent.length = 0
  listCache.length = 0
  listParam.length = 0

  // each
  content.list.forEach((item, i) => {

    // ignore
    if (flagIgnore) {
      flagIgnore = false
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
  if (itNext.value !== itPrev.value) return false

  // pick
  listContent.push(content.new('void'))
  listParam.push(itNext.value)
  flagIgnore = true
  return true
}

// export
export default main