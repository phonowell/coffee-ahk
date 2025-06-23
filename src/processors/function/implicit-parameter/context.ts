// Context and parameter handling for implicit parameters
import type Item from '../../../models/Item'
import type { Context } from '../../../types'

const cacheContext = new Map<string, boolean>()
const cacheParameter = new Set<string>()

export const getCacheContext = () => cacheContext
export const getCacheParameter = () => cacheParameter

export const clearCaches = () => {
  cacheParameter.clear()
  cacheContext.clear()
}

export const pickContext = (ctx: Context, i: number, item: Item) => {
  const { content } = ctx
  const it = content.at(i)

  if (
    it?.is('edge', 'block-end') &&
    it.scope.isEqual([
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

export const pickParameter = (ctx: Context, i: number, item: Item) => {
  const { content } = ctx
  const it = content.at(i)

  if (it?.is('edge', 'parameter-end') && it.scope.isEqual(item.scope)) return

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
