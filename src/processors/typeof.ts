// Typeof processor: wraps the operand in a function call
import Item from '../models/Item.js'
import Scope from '../models/Scope.js'

import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  let typeofScope: Scope | null = null

  content.toArray().forEach((item, i) => {
    if (item.is('edge', 'typeof-start')) {
      typeofScope = new Scope([...item.scope.toArray(), 'call'])
      listContent.push(
        new Item({ type: 'edge', value: 'call-start', scope: typeofScope }),
      )
      return
    }

    if (typeofScope) {
      listContent.push(item)
      // End after expression terminators (not bracket closers which are part of expression)
      const next = content.at(i + 1)
      const isTerminator =
        !next ||
        next.is('new-line') ||
        (next.type === 'math' && next.value !== '~') ||
        next.type === 'compare' ||
        next.type === 'logical-operator' ||
        next.is('sign', ',') ||
        next.is('sign', ':') ||
        next.is('edge', 'array-end') ||
        next.is('edge', 'block-end') ||
        next.is('edge', 'parameter-end') ||
        next.is('bracket', '}')

      // Also end if current item closes a bracket and next is not a continuation
      const isBracketClose =
        item.is('edge', 'call-end') ||
        item.is('edge', 'index-end') ||
        item.is('edge', 'array-end') ||
        item.is('edge', 'expression-end')

      // When isBracketClose is true and we reach here, next exists (isTerminator handles !next)
      const isContinuation =
        next?.is('.') === true ||
        next?.type === 'property' ||
        next?.is('edge', 'call-start') === true ||
        next?.is('edge', 'index-start') === true

      const isEndOfExpr = isTerminator || (isBracketClose && !isContinuation)

      if (isEndOfExpr) {
        listContent.push(
          new Item({ type: 'edge', value: 'call-end', scope: typeofScope }),
        )
        typeofScope = null
      }
      return
    }

    listContent.push(item)
  })

  content.reload(listContent)
}

export default main
