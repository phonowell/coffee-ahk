import Item from '../../models/Item.js'

import type Scope from '../../models/Scope'
import type { Context } from '../../types'

const main = (ctx: Context) => {
  const { content } = ctx

  let flag = false

  const listContent: Item[] = []
  content.list.forEach((item) => {
    if (
      flag &&
      (item.is('new-line') ||
        item.is('bracket', '}') ||
        item.is('bracket', ')'))
    ) {
      flag = false
      const scope2: Scope['list'] = [...item.scope.list, 'call']
      listContent.push(
        // add `()` for type-checking
        new Item('bracket', ')', item.scope),
        new Item('edge', 'call-start', scope2),
        new Item('edge', 'call-end', scope2),
        item,
      )
      return
    }

    if (!item.is('native', '__mark:do__')) {
      listContent.push(item)
      return
    }

    flag = true

    // add `()` for type-checking
    listContent.push(new Item('bracket', '(', item.scope))
  })

  content.reload(listContent)
}

export default main
