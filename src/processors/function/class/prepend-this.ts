import { at } from 'fire-keeper'

import { THIS } from '../../../constants.js'
import Item from '../../../models/Item.js'

import type { Context } from '../../../types'

export const prependThis = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.toArray().forEach((item, i, arr) => {
    if (!item.is('edge', 'parameter-start')) {
      listContent.push(item)
      return
    }

    const prevPrev = at(listContent, -2)
    if (prevPrev?.is('property', 'constructor')) {
      listContent.pop()
      listContent.push(item)
      return
    }

    if (
      !(
        item.scope.at(-1) === 'class' ||
        (item.scope.at(-1) === 'parameter' && item.scope.at(-2) === 'class')
      )
    ) {
      listContent.push(item)
      return
    }

    listContent.push(item)
    const scope2 = item.scope.toArray()
    // Use ℓthis as parameter name since 'this' is reserved in AHK v1
    listContent.push(
      new Item({ type: 'identifier', value: THIS, scope: scope2 }),
    )

    const it = arr.at(i + 1)
    if (it?.is('edge', 'parameter-end')) return
    listContent.push(new Item({ type: 'sign', value: ',', scope: scope2 }))
  })

  content.reload(listContent)
}
