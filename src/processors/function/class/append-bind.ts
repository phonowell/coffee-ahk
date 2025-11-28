import Item from '../../../models/Item.js'

import type { ScopeType } from '../../../models/ScopeType'
import type { Context } from '../../../types'

export const findEdge = (ctx: Context, i: number, item: Item): number => {
  const { content } = ctx

  const it = content.at(i)
  if (!it) return 0
  if (
    it.is('edge', 'parameter-start') &&
    item.scope.isEqual([...it.scope.slice(0, it.scope.length - 1), 'function'])
  )
    return i
  return findEdge(ctx, i - 1, item)
}

export const appendBind = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.toArray().forEach((item, i) => {
    listContent.push(item)
    if (!item.is('edge', 'block-end')) return
    if (item.scope.at(-1) !== 'function') return
    if (item.scope.at(-2) !== 'class') return

    const index = findEdge(ctx, i, item)
    if (content.at(index - 1)?.is('property', 'constructor')) return

    const scopeArr = item.scope.toArray()
    const scope2: [ScopeType[], ScopeType[]] = [scopeArr, [...scopeArr, 'call']]
    listContent.push(new Item({ type: '.', value: '.', scope: scope2[0] }))
    listContent.push(
      new Item({ type: 'identifier', value: 'Bind', scope: scope2[0] }),
    )
    listContent.push(
      new Item({ type: 'edge', value: 'call-start', scope: scope2[1] }),
    )
    // Bind({}, this) - {} for λ context, this for ℓthis parameter
    listContent.push(
      new Item({ type: 'edge', value: 'object-start', scope: scope2[1] }),
    )
    listContent.push(
      new Item({ type: 'edge', value: 'object-end', scope: scope2[1] }),
    )
    listContent.push(new Item({ type: 'sign', value: ',', scope: scope2[1] }))
    listContent.push(
      new Item({ type: 'this', value: 'this', scope: scope2[1] }),
    )
    listContent.push(
      new Item({ type: 'edge', value: 'call-end', scope: scope2[1] }),
    )
  })

  content.reload(listContent)
}
