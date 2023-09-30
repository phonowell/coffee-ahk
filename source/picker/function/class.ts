import { Context } from '../../types'
import Item from '../../module/Item'

// functions

const appendBind = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    listContent.push(item)
    if (!Item.is(item, 'edge', 'block-end')) return
    if (item.scope[item.scope.length - 1] !== 'function') return
    if (item.scope[item.scope.length - 2] !== 'class') return

    const index = findEdge(ctx, i, item)
    if (Item.is(content.at(index - 1), 'property', 'constructor')) return

    const scope2 = [[...item.scope]]
    scope2[1] = [...scope2[0], 'call']
    listContent.push(Item.new('.', '.', scope2[0]))
    listContent.push(Item.new('identifier', 'Bind', scope2[0]))
    listContent.push(Item.new('edge', 'call-start', scope2[1]))
    listContent.push(Item.new('this', 'this', scope2[1]))
    listContent.push(Item.new('edge', 'call-end', scope2[1]))
  })

  content.load(listContent)
}

const findEdge = (ctx: Context, i: number, item: Item): number => {
  const { content } = ctx

  const it = content.at(i)
  if (!it) return 0
  if (
    Item.is(it, 'edge', 'parameter-start') &&
    [...it.scope.slice(0, it.scope.length - 1), 'function'].join('|') ===
      item.scope.join('|')
  )
    return i
  return findEdge(ctx, i - 1, item)
}

const formatSuper = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    listContent.push(item)
    if (!Item.is(item, 'super')) return

    const next = content.at(i + 1)
    if (!Item.is(next, 'edge', 'call-start')) return

    const scope2 = [...next.scope]

    listContent.push(
      new Item('.', '.', scope2),
      new Item('property', '__New', scope2),
    )
  })

  content.load(listContent)
}

const main = (ctx: Context) => {
  prependThis(ctx)
  appendBind(ctx)
  renameConstructor(ctx)
  formatSuper(ctx)
}

const prependThis = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    listContent.push(item)
    if (!Item.is(item, 'edge', 'parameter-start')) return

    if (
      Item.is(listContent[listContent.length - 3], 'property', 'constructor')
    ) {
      listContent[listContent.length - 2].type = 'void'
      return
    }

    if (
      !(
        item.scope[item.scope.length - 1] === 'class' ||
        (item.scope[item.scope.length - 1] === 'parameter' &&
          item.scope[item.scope.length - 2] === 'class')
      )
    )
      return

    const scope2 = [...item.scope]
    listContent.push(Item.new('this', 'this', scope2))

    const it = content.at(i + 1)
    if (Item.is(it, 'edge', 'parameter-end')) return
    listContent.push(Item.new('sign', ',', scope2))
  })

  content.load(listContent)
}

const renameConstructor = (ctx: Context) => {
  const { content } = ctx
  content.list.forEach(it => {
    if (!Item.is(it, 'property', 'constructor')) return
    it.value = '__New'
  })
}

// export
export default main
