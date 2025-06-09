import Item from '../../models/Item.js'

import type { Context } from '../../types'

const cacheContext = new Map<string, boolean>()
const cacheParameter = new Set<string>()

const findFunctionStart = (ctx: Context, i: number): number => {
  const { content } = ctx
  const it = content.at(i)

  if (it?.is('edge', 'block-start')) return i

  return findFunctionStart(ctx, i + 1)
}

const main = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    listContent.push(item)

    if (!item.is('edge', 'parameter-start')) return
    if (content.at(i - 1)?.is('property', '__New')) return

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
        ].map((args) => new Item(args[0] as Item['type'], args[1], item.scope)),
      )
    })
  })

  content.reload(listContent)

  // (a,)
  removeTrailingComma(ctx)
}

const pickContext = (ctx: Context, i: number, item: Item) => {
  const { content } = ctx
  const it = content.at(i)

  if (
    it?.is('edge', 'block-end') &&
    it.scope.isEquals([
      ...item.scope.slice(0, item.scope.length - 1),
      'function',
    ])
  )
    return

  if (it?.is('identifier') && !cacheContext.get(it.value)) {
    const prev = content.at(i - 1)
    if (!prev) return

    const next = content.at(i + 1)
    if (!next) return

    cacheContext.set(
      it.value,
      prev.is('for', 'for') ||
        next.is('sign', '=') ||
        next.is('for-in') ||
        it.scope.at(-1) === 'parameter',
    )
  }

  pickContext(ctx, i + 1, item)
}

const pickParameter = (ctx: Context, i: number, item: Item) => {
  const { content } = ctx
  const it = content.at(i)

  if (it?.is('edge', 'parameter-end') && it.scope.isEquals(item.scope)) return

  if (it?.is('identifier')) {
    const next = content.at(i + 1)
    if (!next) return
    if (
      next.is('sign', '=') ||
      next.is('sign', ',') ||
      next.is('sign', '...') ||
      next.is('edge', 'parameter-end')
    )
      cacheParameter.add(it.value)
  }

  pickParameter(ctx, i + 1, item)
}

const removeTrailingComma = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    if (item.is('sign', ',') && content.at(i + 1)?.is('edge', 'parameter-end'))
      return

    listContent.push(item)
  })

  content.reload(listContent)
}

export default main
