import Item from '../../models/Item.js'

import type { ScopeType } from '../../models/ScopeType.js'
import type { Context } from '../../types/index.js'

const main = (ctx: Context) => {
  const { content } = ctx

  let flag = false
  let isFatArrow = false
  // Depth of groups opened *inside* the do expression; a closer at depth 0
  // belongs to an outer construct (e.g. the call wrapping `f(x, do -> y)`)
  let depth = 0

  const listContent: Item[] = []
  content.toArray().forEach((item) => {
    if (flag) {
      const isOpener = item.type === 'edge' && item.value.endsWith('-start')
      const isCloser = item.type === 'edge' && item.value.endsWith('-end')

      const isBoundary =
        item.is('new-line') ||
        item.is('bracket', '}') ||
        item.is('bracket', ')') ||
        item.is('sign', ',') ||
        (isCloser && depth === 0)

      if (isBoundary) {
        flag = false
        depth = 0
        const scope2: ScopeType[] = [...item.scope.toArray(), 'call']
        listContent.push(
          // add `()` for type-checking
          new Item({ type: 'bracket', value: ')', scope: item.scope }),
          new Item({ type: 'edge', value: 'call-start', scope: scope2 }),
        )
        // Pass this if fat arrow (=>) function
        if (isFatArrow) {
          listContent.push(new Item({ type: 'this', value: 'this', scope: scope2 }))
        }

        listContent.push(new Item({ type: 'edge', value: 'call-end', scope: scope2 }), item)
        isFatArrow = false
        return
      }

      if (isOpener) depth++
      else if (isCloser) depth--

      listContent.push(item)
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
    depth = 0
    isFatArrow = isDoFat

    // add `()` for type-checking
    listContent.push(new Item({ type: 'bracket', value: '(', scope: item.scope }))
  })

  content.reload(listContent)
}

export default main
