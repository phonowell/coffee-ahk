import { Context } from '../../types'
import Item, { Scope } from '../../module/Item'

// interface

type Flag = {
  i: number
  scope: Scope[]
  isObjectWithoutBrackets: boolean
}

// functions

const findFnStart = (ctx: Context, i: number): [number, Scope[]] => {
  const { content } = ctx
  const item = content.eq(i)

  if (
    !(
      Item.is(item, 'edge', 'block-start') &&
      item.scope[item.scope.length - 1] === 'function'
    )
  )
    return findFnStart(ctx, i + 1)

  return [i, [...item.scope]]
}

// would not add `return` before items return `true` in this function
const ignore = (item: Item) => {
  if (Item.is(item, 'for')) return true
  if (Item.is(item, 'if')) return true
  if (Item.is(item, 'native') && item.value !== '__mark:do__') return true
  if (Item.is(item, 'statement') && item.value !== 'new') return true
  if (Item.is(item, 'try')) return true
  if (Item.is(item, 'while')) return true
  return false
}

const main = (ctx: Context) => {
  const { content } = ctx

  const flag: Flag = {
    i: -1,
    scope: [],
    isObjectWithoutBrackets: false,
  }

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    listContent.push(item)

    if (i === flag.i) {
      if (flag.isObjectWithoutBrackets)
        listContent.push(
          Item.new('new-line', flag.scope.length.toString(), flag.scope),
        )
      listContent.push(Item.new('statement', 'return', flag.scope))
      return
    }

    if (!Item.is(item, 'edge', 'parameter-start')) return
    if (Item.is(content.eq(i - 1), 'property', '__New')) return

    const [iStart, scpStart] = findFnStart(ctx, i)
    const list = pickItems(ctx, {
      i: iStart,
      list: [],
      scope: scpStart,
    })

    const isObjectWithoutBrackets = Item.is(list[1], 'bracket', '{')
    if (
      list.filter(
        it => Item.is(it, 'new-line') && Item.isScopeEqual(it.scope, scpStart),
      ).length > (isObjectWithoutBrackets ? 1 : 2)
    )
      return
    if (ignore(list[2])) return

    flag.i = iStart + (isObjectWithoutBrackets ? 0 : 1)
    flag.scope = scpStart
    flag.isObjectWithoutBrackets = isObjectWithoutBrackets
  })

  content.load(listContent)
}

const pickItems = (
  ctx: Context,
  options: {
    i: number
    list: Item[]
    scope: Scope[]
  },
): Item[] => {
  const { content } = ctx
  const { i, list, scope } = options

  const item = content.eq(i)
  if (!item) return list

  list.push(item)

  const isEnded =
    Item.is(item, 'edge', 'block-end') && Item.isScopeEqual(item.scope, scope)

  if (!isEnded)
    return pickItems(ctx, {
      i: i + 1,
      list,
      scope,
    })

  return list
}

// export
export default main
