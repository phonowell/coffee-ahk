import { ARRAY } from '../../constants.js'
import Item from '../../models/Item.js'
import { TranspileError } from '../../utils/error.js'
import {
  getForbiddenReason,
  isVariableForbidden,
} from '../../utils/forbidden.js'

import { pickIndent } from './deconstruct/pick-indent.js'
import { pickPre } from './deconstruct/pick-pre.js'

import type Scope from '../../models/Scope'
import type { Context } from '../../types'

const buildAssignment = (
  preItems: Item[],
  index: number,
  indent: string,
  scope: Scope,
): Item[] => {
  const clonedPreItems = preItems.map((it) => {
    const cloned = it.clone()
    cloned.scope.reload(scope)
    return cloned
  })

  return [
    new Item({ type: 'new-line', value: indent, scope }),
    ...clonedPreItems,
    new Item({ type: 'sign', value: '=', scope }),
    new Item({ type: 'identifier', value: ARRAY, scope }),
    new Item({ type: 'edge', value: 'index-start', scope }),
    new Item({ type: 'number', value: (index + 1).toString(), scope }),
    new Item({ type: 'edge', value: 'index-end', scope }),
  ]
}

const main = (ctx: Context) => {
  const { content } = ctx

  let listPre: Item[][] = []
  let listContent: Item[] = []

  // each
  content.toArray().forEach((item, i) => {
    // output
    if (listPre.length && item.type === 'new-line') {
      const indent = pickIndent(ctx, i - 1).toString()

      listPre.forEach((_, j) => {
        const preItems = listPre[listPre.length - j - 1] ?? []
        listContent = [
          ...listContent,
          ...buildAssignment(preItems, j, indent, item.scope),
        ]
      })

      listPre.length = 0
      listContent.push(item)
      return
    }

    // find
    if (!item.is('sign', '=')) {
      listContent.push(item)
      return
    }
    if (!content.at(i - 1)?.is('edge', 'array-end')) {
      listContent.push(item)
      return
    }

    // pick
    // why i - 2
    // [xxx] = [xxx]
    //    ^1 ^2
    // 1 is what you need, and 2 is where you are, so minus 2
    listPre = pickPre(ctx, i - 2, listContent)

    // Validate array destructuring targets
    listPre.forEach((preItems) => {
      preItems.forEach((it) => {
        if (it.type === 'identifier' && isVariableForbidden(it.value)) {
          throw new TranspileError(
            ctx,
            'forbidden',
            `array destructuring target '${it.value}' cannot be used (${getForbiddenReason(it.value)}).`,
          )
        }
      })
    })

    listContent = listContent.slice(0, listContent.length - 2)

    listContent = [
      ...listContent,
      new Item({ type: 'identifier', value: ARRAY, scope: item.scope }),
      new Item({ type: 'sign', value: '=', scope: item.scope }),
    ]
  })

  // reload
  content.reload(listContent)
}

export default main
