import { Context } from '../../entry/type'
import Item, { Scope } from '../../module/Item'

// function

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

const ignore = (item: Item) => {
  if (Item.is(item, 'for')) return true
  if (Item.is(item, 'if')) return true
  if (Item.is(item, 'native')) return true
  if (Item.is(item, 'statement') && item.value !== 'new') return true
  if (Item.is(item, 'switch')) return true
  if (Item.is(item, 'throw')) return true
  if (Item.is(item, 'try')) return true
  if (Item.is(item, 'while')) return true
  return false
}

const main = (ctx: Context) => {
  const { content } = ctx

  const flag: [number, Scope[], boolean] = [-1, [], false]

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    listContent.push(item)

    if (i === flag[0]) {
      if (flag[2])
        listContent.push(
          Item.new('new-line', flag[1].length.toString(), flag[1]),
        )
      listContent.push(Item.new('statement', 'return', flag[1]))
      return
    }

    if (!Item.is(item, 'edge', 'parameter-start')) return
    if (Item.is(content.eq(i - 1), 'property', '__New')) return

    const [iStart, sStart] = findFnStart(ctx, i)
    const list = pickItems(ctx, {
      i: iStart,
      list: [],
      scope: sStart,
    })

    const isObjectWithoutBrackets = Item.is(list[1], 'bracket', '{')
    if (
      list.filter(
        it => Item.is(it, 'new-line') && Item.isScopeEqual(it.scope, sStart),
      ).length > (isObjectWithoutBrackets ? 1 : 2)
    )
      return
    if (ignore(list[2])) return
    flag[0] = iStart + (isObjectWithoutBrackets ? 0 : 1)
    flag[1] = sStart
    flag[2] = isObjectWithoutBrackets
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

  list.push(item)

  if (
    !(
      Item.is(item, 'edge', 'block-end') && Item.isScopeEqual(item.scope, scope)
    )
  )
    return pickItems(ctx, {
      i: i + 1,
      list,
      scope,
    })

  return list
}

// export
export default main
