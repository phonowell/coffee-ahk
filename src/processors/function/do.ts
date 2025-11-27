import Item from '../../models/Item.js'

import type { ScopeType } from '../../models/ScopeType'
import type { Context } from '../../types'

const main = (ctx: Context) => {
  const { content } = ctx

  let flag = false
  let isFatArrow = false

  const listContent: Item[] = []
  content.toArray().forEach((item) => {
    if (
      flag &&
      (item.is('new-line') ||
        item.is('bracket', '}') ||
        item.is('bracket', ')'))
    ) {
      flag = false
      const scope2: ScopeType[] = [...item.scope.toArray(), 'call']
      listContent.push(
        // add `()` for type-checking
        new Item({ type: 'bracket', value: ')', scope: item.scope }),
        new Item({ type: 'edge', value: 'call-start', scope: scope2 }),
      )
      // Pass this if fat arrow (=>) function
      if (isFatArrow) {
        listContent.push(
          new Item({ type: 'this', value: 'this', scope: scope2 }),
        )
      }

      listContent.push(
        new Item({ type: 'edge', value: 'call-end', scope: scope2 }),
        item,
      )
      isFatArrow = false
      return
    }

    // Check for do marker (thin or fat arrow)
    const isDoThin = item.is('native', '__mark:do__')
    const isDoFat = item.is('native', '__mark:do-fat__')

    if (!isDoThin && !isDoFat) {
      listContent.push(item)
      return
    }

    flag = true
    isFatArrow = isDoFat

    // add `()` for type-checking
    listContent.push(
      new Item({ type: 'bracket', value: '(', scope: item.scope }),
    )
  })

  content.reload(listContent)
}

export default main
