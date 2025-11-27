import Item from '../../../models/Item.js'

import type { Context } from '../../../types'

export const transFunc = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.toArray().forEach((item) => {
    if (
      !(
        item.type === 'native' &&
        item.value.startsWith('Func(') &&
        item.value.endsWith(')')
      )
    ) {
      listContent.push(item)
      return
    }

    const scope2 = item.scope.slice(0, -1)

    listContent.push(
      new Item({ type: 'identifier', value: 'Func', scope: scope2 }),
    )
    listContent.push(
      new Item({
        type: 'edge',
        value: 'call-start',
        scope: [...scope2, 'call'],
      }),
    )
    listContent.push(
      new Item({
        type: 'string',
        value: item.value.slice(5, item.value.length - 1),
        scope: [...scope2, 'call'],
      }),
    )
    listContent.push(
      new Item({ type: 'edge', value: 'call-end', scope: [...scope2, 'call'] }),
    )
  })

  content.reload(listContent)
}
