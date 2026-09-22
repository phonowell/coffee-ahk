// Chained comparison processor: 1 < y < 10 → 1 < y && y < 10
import Item from '../models/Item.js'

import type { Context } from '../types/index.js'

const isOpener = (item: Item): boolean =>
  (item.type === 'edge' && item.value.endsWith('-start')) ||
  item.is('bracket', '(') ||
  item.is('bracket', '{') ||
  item.is('bracket', '[')

const isCloser = (item: Item): boolean =>
  (item.type === 'edge' && item.value.endsWith('-end')) ||
  item.is('bracket', ')') ||
  item.is('bracket', '}') ||
  item.is('bracket', ']')

const isHardBoundary = (item: Item): boolean =>
  item.type === 'logical-operator' ||
  item.type === 'new-line' ||
  item.type === 'for-in' ||
  (item.type === 'sign' && [',', ':', '?', '='].includes(item.value))

const main = (ctx: Context) => {
  const { content } = ctx
  const listContent: Item[] = []

  // After a compare, capture the middle operand as an item sequence so
  // property/index/call operands (a < b.c < d) and nested commas stay intact.
  let operand: Item[] | null = null
  let depth = 0

  content.toArray().forEach((item) => {
    if (operand !== null) {
      // Chain continues: emit && + captured operand before this compare
      if (depth === 0 && item.type === 'compare' && operand.length > 0) {
        listContent.push(new Item({ type: 'logical-operator', value: '&&', scope: item.scope }))
        for (const it of operand) listContent.push(it.clone())
        listContent.push(item)
        operand = []
        return
      }

      // Expression boundary: stop tracking, input stays untouched
      if (depth === 0 && (isHardBoundary(item) || isCloser(item))) {
        operand = null
        listContent.push(item)
        return
      }

      operand.push(item)
      if (isOpener(item)) depth++
      else if (isCloser(item) && depth > 0) depth--
      listContent.push(item)
      return
    }

    listContent.push(item)
    if (item.type === 'compare') {
      operand = []
      depth = 0
    }
  })

  content.reload(listContent)
}

export default main
