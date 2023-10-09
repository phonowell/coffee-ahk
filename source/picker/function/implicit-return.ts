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
  const item = content.at(i)

  if (!(item?.is('edge', 'block-start') && item.scopeAt(-1) === 'function'))
    return findFnStart(ctx, i + 1)

  return [i, [...item.scope]]
}

// would not add `return` before items return `true` in this function
const ignore = (item: Item) => {
  if (item.is('for')) return true
  if (item.is('if')) return true
  if (item.is('native') && item.value !== '__mark:do__') return true
  if (item.is('statement') && item.value !== 'new') return true
  if (item.is('try')) return true
  if (item.is('while')) return true
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

    if (!item.is('edge', 'parameter-start')) return
    if (content.last.is('property', '__New')) return

    const [iStart, scpStart] = findFnStart(ctx, i)
    const list = pickItems(ctx, {
      i: iStart,
      list: [],
      scope: scpStart,
    })

    const isObjectWithoutBrackets = list[1].is('bracket', '{')
    if (
      list.filter(it => it.is('new-line') && it.isScopeEqual(scpStart)).length >
      (isObjectWithoutBrackets ? 1 : 2)
    )
      return
    if (ignore(list[2])) return

    flag.i = iStart + (isObjectWithoutBrackets ? 0 : 1)
    flag.scope = scpStart
    flag.isObjectWithoutBrackets = isObjectWithoutBrackets
  })

  content.reload(listContent)
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

  const item = content.at(i)
  if (!item) return list

  list.push(item)

  const isEnded = item.is('edge', 'block-end') && item.isScopeEqual(scope)

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
