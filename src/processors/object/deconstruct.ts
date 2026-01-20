// Object deconstruction functionality
import { OBJECT } from '../../constants.js'
import Item from '../../models/Item.js'
import { ErrorType, TranspileError } from '../../utils/error.js'
import {
  getForbiddenReason,
  isVariableForbidden,
} from '../../utils/forbidden.js'

import type { Context } from '../../types'

export const deconstruct = (ctx: Context) => {
  const { content } = ctx

  const listPre: string[] = []
  const token = OBJECT
  let listContent: Item[] = []

  const pickIndent = (i: number): number => {
    const it = content.at(i)
    if (!it) return 0
    if (it.type === 'new-line') return parseInt(it.value, 10)
    return pickIndent(i - 1)
  }

  const pickPre = (i: number) => {
    const it = content.at(i)
    if (!it) return
    if (it.is('bracket', '{')) return
    if (it.is('identifier')) listPre.push(it.value)
    listContent.pop()
    pickPre(i - 1)
  }

  // each
  content.toArray().forEach((item, i) => {
    // output
    if (listPre.length && item.type === 'new-line') {
      const indent = pickIndent(i - 1)
      const _scope = item.scope

      for (let j = 0; j < listPre.length; j++) {
        const preItem = listPre[listPre.length - j - 1] ?? ''
        listContent = [
          ...listContent,
          // \n xxx = token[xxx]
          new Item({
            type: 'new-line',
            value: indent.toString(),
            scope: _scope,
          }),
          new Item({ type: 'identifier', value: preItem, scope: _scope }),
          new Item({ type: 'sign', value: '=', scope: _scope }),
          new Item({ type: 'identifier', value: token, scope: _scope }),
          new Item({ type: 'edge', value: 'index-start', scope: _scope }),
          new Item({ type: 'string', value: `"${preItem}"`, scope: _scope }),
          new Item({ type: 'edge', value: 'index-end', scope: _scope }),
        ]
      }

      listPre.length = 0
      listContent.push(item)
      return
    }

    // find
    if (!item.is('sign', '=')) {
      listContent.push(item)
      return
    }
    if (!content.at(i - 1)?.is('bracket', '}')) {
      listContent.push(item)
      return
    }

    // pick
    pickPre(i)

    // Validate object destructuring targets
    listPre.forEach((name) => {
      if (!isVariableForbidden(name)) return
      throw new TranspileError(
        ctx,
        ErrorType.FORBIDDEN,
        `object destructuring target '${name}' cannot be used (${getForbiddenReason(name)})`,
        `Choose a different variable name`,
      )
    })

    listContent = [
      ...listContent,
      new Item({ type: 'identifier', value: token, scope: item.scope }),
      new Item({ type: 'sign', value: '=', scope: item.scope }),
    ]
  })

  // reload
  content.reload(listContent)
}
