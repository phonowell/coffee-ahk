import Item from '../../../models/Item.js'

import type { Context } from '../../../types'

export const transFunc = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item) => {
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

    listContent.push(new Item('identifier', 'Func', scope2))
    listContent.push(new Item('edge', 'call-start', [...scope2, 'call']))
    listContent.push(
      new Item('string', item.value.slice(5, item.value.length - 1), [
        ...scope2,
        'call',
      ]),
    )
    listContent.push(new Item('edge', 'call-end', [...scope2, 'call']))
  })

  content.reload(listContent)
}
