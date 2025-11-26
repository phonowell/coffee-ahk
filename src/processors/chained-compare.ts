// Chained comparison processor: 1 < y < 10 → 1 < y && y < 10
import Item from '../models/Item.js'

import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content } = ctx
  const listContent: Item[] = []

  // Track: after a compare, if we see another compare without &&/||, insert && and repeat middle operand
  let prevCompareIdx = -1
  let middleOperand: Item | null = null

  content.toArray().forEach((item, i) => {
    // If this is a compare and we had a previous compare with a middle operand
    if (item.type === 'compare' && prevCompareIdx !== -1 && middleOperand) {
      // Insert && and clone of middle operand before this compare
      listContent.push(new Item('logical-operator', '&&', item.scope))
      listContent.push(middleOperand.clone())
    }

    listContent.push(item)

    // Update tracking
    if (item.type === 'compare') {
      prevCompareIdx = i
      middleOperand = null
    } else if (prevCompareIdx !== -1 && !middleOperand) {
      // First item after compare is the middle operand
      if (
        item.type === 'identifier' ||
        item.type === 'number' ||
        item.type === 'string'
      )
        middleOperand = item
      else {
        // Complex expression - reset
        prevCompareIdx = -1
        middleOperand = null
      }
    } else if (item.type === 'logical-operator' || item.is('new-line')) {
      // Reset on logical operator or newline
      prevCompareIdx = -1
      middleOperand = null
    }
  })

  content.reload(listContent)
}

export default main
