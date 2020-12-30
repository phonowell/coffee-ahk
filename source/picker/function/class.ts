import { Context } from '../../entry/type'
import Item from '../../module/Item'

// function

function appendBind(
  ctx: Context
): void {

  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {

    listContent.push(item)
    if (!Item.equal(item, 'edge', 'block-end')) return
    if (item.scope[item.scope.length - 1] !== 'function') return
    if (item.scope[item.scope.length - 2] !== 'class') return

    const index = findEdge(ctx, i)
    if (Item.equal(content.eq(index - 1), 'property', 'constructor')) return

    const _scope = [[...item.scope]]
    _scope[1] = [..._scope[0], 'call']
    listContent.push(Item.new('.', '.', _scope[0]))
    listContent.push(Item.new('identifier', 'Bind', _scope[0]))
    listContent.push(Item.new('edge', 'call-start', _scope[1]))
    listContent.push(Item.new('this', 'this', _scope[1]))
    listContent.push(Item.new('edge', 'call-end', _scope[1]))
  })

  content.load(listContent)
}

function findEdge(
  ctx: Context,
  i: number
): number {

  const { content } = ctx

  const it = content.eq(i)
  if (!it) return 0
  if (Item.equal(it, 'edge', 'parameter-start')) return i
  return findEdge(ctx, i - 1)
}

function main(
  ctx: Context
): void {

  prependThis(ctx)
  appendBind(ctx)
  renameConstructor(ctx)
}

function prependThis(
  ctx: Context
): void {

  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {

    listContent.push(item)
    if (!Item.equal(item, 'edge', 'parameter-start')) return

    if (Item.equal(
      listContent[listContent.length - 3],
      'property', 'constructor'
    )) {
      listContent[listContent.length - 2].type = 'void'
      return
    }

    if (!(
      item.scope[item.scope.length - 1] === 'class'
      || (
        item.scope[item.scope.length - 1] === 'parameter'
        && item.scope[item.scope.length - 2] === 'class'
      )
    )) return

    const _scope = [...item.scope]
    listContent.push(Item.new('this', 'this', _scope))

    const it = content.eq(i + 1)
    if (Item.equal(it, 'edge', 'parameter-end')) return
    listContent.push(Item.new('sign', ',', _scope))
  })

  content.load(listContent)
}

function renameConstructor(
  ctx: Context
): void {

  const { content } = ctx
  content.list.forEach(it => {
    if (!Item.equal(it, 'property', 'constructor')) return
    it.value = '__New'
  })
}

// export
export default main
