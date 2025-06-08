import Item from '../../models/Item'
import at from '../../utils/at'

import type { Context } from '../../types'

const appendBind = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    listContent.push(item)
    if (!item.is('edge', 'block-end')) return
    if (item.scope.at(-1) !== 'function') return
    if (item.scope.at(-2) !== 'class') return

    const index = findEdge(ctx, i, item)
    if (content.at(index - 1)?.is('property', 'constructor')) return

    const scope2 = [item.scope.list]
    scope2[1] = [...scope2[0], 'call']
    listContent.push(new Item('.', '.', scope2[0]))
    listContent.push(new Item('identifier', 'Bind', scope2[0]))
    listContent.push(new Item('edge', 'call-start', scope2[1]))
    listContent.push(new Item('this', 'this', scope2[1]))
    listContent.push(new Item('edge', 'call-end', scope2[1]))
  })

  content.reload(listContent)
}

const findEdge = (ctx: Context, i: number, item: Item): number => {
  const { content } = ctx

  const it = content.at(i)
  if (!it) return 0
  if (
    it.is('edge', 'parameter-start') &&
    item.scope.isEquals([...it.scope.slice(0, it.scope.length - 1), 'function'])
  )
    return i
  return findEdge(ctx, i - 1, item)
}

const formatSuper = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    listContent.push(item)
    if (!item.is('super')) return

    const next = content.at(i + 1)
    if (!next?.is('edge', 'call-start')) return

    const scope2 = next.scope.list

    listContent.push(
      new Item('.', '.', scope2),
      new Item('property', '__New', scope2),
    )
  })

  content.reload(listContent)
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
    if (!item.is('edge', 'parameter-start')) return

    if (at(listContent, -3)?.is('property', 'constructor')) {
      listContent[listContent.length - 2].type = 'void'
      return
    }

    if (
      !(
        item.scope.at(-1) === 'class' ||
        (item.scope.at(-1) === 'parameter' && item.scope.at(-2) === 'class')
      )
    )
      return

    const scope2 = item.scope.list
    listContent.push(new Item('this', 'this', scope2))

    const it = content.at(i + 1)
    if (it?.is('edge', 'parameter-end')) return
    listContent.push(new Item('sign', ',', scope2))
  })

  content.reload(listContent)
}

const renameConstructor = (ctx: Context) => {
  const { content } = ctx
  content.list.forEach((it) => {
    if (!it.is('property', 'constructor')) return
    it.value = '__New'
  })
}

export default main
