import { at } from 'fire-keeper'

import Item from '../../../models/Item.js'

import type { Context } from '../../../types'

export const prependThis = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.toArray().forEach((item, i) => {
    listContent.push(item)
    if (!item.is('edge', 'parameter-start')) return

    if (at(listContent, -3)?.is('property', 'constructor')) {
      const item2 = listContent.at(listContent.length - 2)
      if (item2) item2.type = 'void'
      return
    }

    if (
      !(
        item.scope.at(-1) === 'class' ||
        (item.scope.at(-1) === 'parameter' && item.scope.at(-2) === 'class')
      )
    )
      return

    const scope2 = item.scope.toArray()
    // Use __this__ as parameter name since 'this' is reserved in AHK v1
    listContent.push(new Item('identifier', '__this__', scope2))

    const it = content.at(i + 1)
    if (it?.is('edge', 'parameter-end')) return
    listContent.push(new Item('sign', ',', scope2))
  })

  content.reload(listContent)
}
