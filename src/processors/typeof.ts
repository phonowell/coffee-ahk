// Typeof processor: wraps the operand in a function call
import Item from '../models/Item.js'
import Scope from '../models/Scope.js'

import type { Context } from '../types/index.js'

const main = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  // Stack of open typeof calls — supports nested `typeof typeof x`
  const scopeStack: Scope[] = []
  // Scope depth where the operand lives: items nested inside calls, arrays,
  // objects or function bodies sit deeper, so `,`/`:`/new-lines there must not
  // terminate the operand early (`typeof f(1, 2)`, `typeof {k: 1}`, `typeof -> x`)
  let operandDepth = 0
  // Groups opened inside the operand — their closers are consumed, not boundaries
  let innerDepth = 0

  content.toArray().forEach((item, i) => {
    if (item.is('edge', 'typeof-start')) {
      const scope = new Scope([...item.scope.toArray(), 'call'])
      scopeStack.push(scope)
      operandDepth = item.scope.toArray().length
      innerDepth = 0
      listContent.push(new Item({ type: 'edge', value: 'call-start', scope }))
      return
    }

    if (scopeStack.length) {
      listContent.push(item)

      const scopeLen = item.scope.toArray().length
      if (
        (item.type === 'edge' && item.value.endsWith('-start')) ||
        item.is('bracket', '(') ||
        item.is('bracket', '{') ||
        item.is('bracket', '[')
      ) {
        if (scopeLen > operandDepth) innerDepth++
      } else if (
        (item.type === 'edge' && item.value.endsWith('-end')) ||
        item.is('bracket', ')') ||
        item.is('bracket', '}') ||
        item.is('bracket', ']')
      ) {
        // A closer at deeper scope pairs with a group opened inside the operand
        // (array-end/index-end report the outer scope but are consumed the same
        // way when innerDepth > 0)
        if (innerDepth > 0) innerDepth--
      }

      // End after expression terminators (not bracket closers which are part of expression)
      const next = content.at(i + 1)
      const nextNested = (next?.scope.toArray().length ?? 0) > operandDepth
      const isTerminator =
        innerDepth === 0 &&
        !nextNested &&
        (!next ||
          next.is('new-line') ||
          (next.type === 'math' && next.value !== '~') ||
          next.type === 'compare' ||
          next.type === 'logical-operator' ||
          next.is('sign', ',') ||
          next.is('sign', ':') ||
          next.is('edge', 'array-end') ||
          next.is('edge', 'block-end') ||
          next.is('edge', 'parameter-end') ||
          next.is('bracket', '}'))

      // Also end if current item closes a bracket and next is not a continuation
      const isBracketClose =
        innerDepth === 0 &&
        (item.is('edge', 'call-end') ||
          item.is('edge', 'index-end') ||
          item.is('edge', 'array-end') ||
          item.is('edge', 'expression-end') ||
          item.is('bracket', ')') ||
          item.is('bracket', '}') ||
          item.is('bracket', ']'))

      // When isBracketClose is true and we reach here, next exists (isTerminator handles !next)
      const isContinuation =
        next?.is('.') === true ||
        next?.type === 'property' ||
        next?.is('edge', 'call-start') === true ||
        next?.is('edge', 'index-start') === true

      const isEndOfExpr = isTerminator || (isBracketClose && !isContinuation)

      if (isEndOfExpr) {
        // Close every pending typeof: when the innermost operand ends, an outer
        // `typeof (typeof x)` operand — the inner call itself — ends too
        while (scopeStack.length) {
          const scope = scopeStack.pop()
          if (scope) listContent.push(new Item({ type: 'edge', value: 'call-end', scope }))
        }
      }
      return
    }

    listContent.push(item)
  })

  content.reload(listContent)
}

export default main
