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

  const [indent, index] = findIndent(i, content.list)
  const scope = [
    [...content.eq(index).scope],
    [...item.scope]
  ]
  const token = `__ctx_${ctx.option.salt}__`
  let listA: Item[] = []
  let listB: Item[] = []

  for (let j = 0; j < listParam.length; j++) {

    const name = listParam[j]

    listA = [
      ...listA,
      // \n token.a = a
      content.new('new-line', indent.toString(), scope[0]),
      content.new('identifier', token, scope[0]),
      content.new('.', '.', scope[0]),
      content.new('property', name, scope[0]),
      content.new('sign', '=', scope[0]),
      content.new('identifier', name, scope[0])
    ]

    listB = [
      ...listB,
      // \n a = token.a
      content.new('new-line', (indent + 1).toString(), scope[1]),
      content.new('identifier', name, scope[1]),
      content.new('sign', '=', scope[1]),
      content.new('identifier', token, scope[1]),
      content.new('.', '.', scope[1]),
      content.new('property', name, scope[1])
    ]
  }

  listCache = [
    ...listCache,
    [index, listA],
    [i + 1, listB]
  ]
}

function findIndent(
  i: number,
  listTarget: Item[]
): [number, number] {

  const item = listTarget[i]
  if (!item) return [0, 0]
  if (item.type === 'new-line') return [
    parseInt(item.value),
    i,
  ]
  return findIndent(i - 1, listTarget)
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
  let diff = 0
  for (let i = 0; i < listCache.length; i++) {
    const [index, listItem] = listCache[i]
    listContent.splice(index + diff, 0, ...listItem)
    diff += listItem.length
  }
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
  if (itNext.type !== 'identifier') return false
  const itPrev = content.eq(i - 1)
  if (itNext.value !== itPrev.value) return false

  // pick
  listContent[listContent.length - 1].type = 'void'
  const it = listContent[listContent.length - 2]
  if (content.equal(it, 'sign', ','))
    it.type = 'void'
  listContent.push(content.new('void', '', []))

  listParam.push(itNext.value)
  flagIgnore = true
  return true
}

// export
export default main