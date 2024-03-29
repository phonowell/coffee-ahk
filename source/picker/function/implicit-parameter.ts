import { Context } from '../../types'
import Item from '../../module/Item'

// variable

const cacheContext = new Map<string, boolean>()
const cacheParameter = new Set<string>()

// function

const findFunctionStart = (ctx: Context, i: number): number => {
  const { content } = ctx
  const it = content.at(i)

  if (Item.is(it, 'edge', 'block-start')) return i

  return findFunctionStart(ctx, i + 1)
}

const main = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    listContent.push(item)

    if (!Item.is(item, 'edge', 'parameter-start')) return
    if (Item.is(content.at(i - 1), 'property', '__New')) return

    const iStart = findFunctionStart(ctx, i)

    cacheParameter.clear()
    cacheContext.clear()
    pickParameter(ctx, i, item)
    pickContext(ctx, iStart, item)

    cacheContext.forEach((isDefined, name) => {
      if (isDefined) return
      if (cacheParameter.has(name)) return
      if (ctx.cache.global.has(name)) return
      if (name.startsWith('__') && name.endsWith('__')) return // like `__xxx__`
      if (name[0].toLowerCase() !== name[0]) return // like `Xxx`

      listContent.push(
        ...[
          ['identifier', name],
          ['sign', '='],
          ['identifier', name],
          ['sign', ','],
        ].map(args => Item.new(args[0] as Item['type'], args[1], item.scope)),
      )
    })
  })

  content.load(listContent)

  // (a,)
  removeTrailingComma(ctx)
}

const pickContext = (ctx: Context, i: number, item: Item) => {
  const { content } = ctx
  const it = content.at(i)

  if (
    Item.is(it, 'edge', 'block-end') &&
    it.scope.join('|') ===
      [...item.scope.slice(0, item.scope.length - 1), 'function'].join('|')
  )
    return

  if (Item.is(it, 'identifier') && !cacheContext.get(it.value)) {
    const prev = content.at(i - 1)
    const next = content.at(i + 1)
    cacheContext.set(
      it.value,
      Item.is(prev, 'for', 'for') ||
        Item.is(next, 'sign', '=') ||
        Item.is(next, 'for-in') ||
        it.scope[it.scope.length - 1] === 'parameter',
    )
  }

  pickContext(ctx, i + 1, item)
}

const pickParameter = (ctx: Context, i: number, item: Item) => {
  const { content } = ctx
  const it = content.at(i)

  if (
    Item.is(it, 'edge', 'parameter-end') &&
    it.scope.join('|') === item.scope.join('|')
  )
    return

  if (Item.is(it, 'identifier')) {
    const next = content.at(i + 1)
    if (
      Item.is(next, 'sign', '=') ||
      Item.is(next, 'sign', ',') ||
      Item.is(next, 'sign', '...') ||
      Item.is(next, 'edge', 'parameter-end')
    )
      cacheParameter.add(it.value)
  }

  pickParameter(ctx, i + 1, item)
}

const removeTrailingComma = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    if (
      Item.is(item, 'sign', ',') &&
      Item.is(content.at(i + 1), 'edge', 'parameter-end')
    )
      return

    listContent.push(item)
  })

  content.load(listContent)
}

// export
export default main
