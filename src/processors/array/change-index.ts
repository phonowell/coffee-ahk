import { pickItem } from './change-index/pick-item.js'
import {
  processIdentifierType,
  processNegativeIndex,
  processNumberType,
} from './change-index/process-types.js'
import { updateContent } from './change-index/update-content.js'

import type { Range } from './change-index/types.js'
import type Item from '../../models/Item.js'
import type { Context } from '../../types'

const main = (ctx: Context) => {
  const { content } = ctx
  const token = `__ci_${ctx.options.salt}__`
  const countIgnore = { value: 0 }

  const update = (range: Range, list: Item[]) => {
    updateContent(ctx, range, list)
  }

  // each
  let i = -1
  let len = content.length
  while (i < len) {
    i++
    len = content.length
    const item = content.at(i)

    if (!item?.is('edge', 'index-start')) continue

    const next = content.at(i + 1)
    if (!next) continue
    if (next.is('identifier', token)) continue
    if (next.is('edge', 'index-end')) continue

    // Get the full array expression before index-start (may be chain like obj.items)
    const arrayItems: Item[] = []
    let j = i - 1
    while (j >= 0) {
      const prev = content.at(j)
      if (!prev) break
      if (
        prev.type === 'identifier' ||
        prev.type === 'property' ||
        prev.type === '.'
      ) {
        arrayItems.unshift(prev)
        j--
      } else break
    }

    const [iEnd, listItem] = pickItem(ctx, item, i, countIgnore)
    const listUnwrap = listItem.slice(1, listItem.length - 1)

    // Check for negative index first
    const first = listUnwrap.at(0)
    const second = listUnwrap.at(1)
    if (
      first?.type === 'negative' &&
      second?.type === 'number' &&
      arrayItems.length > 0
    ) {
      processNegativeIndex([i + 1, iEnd - 1], listUnwrap, arrayItems, update)
      continue
    }

    let type: 'identifier' | 'number' | 'string' = 'number'

    for (const it of listUnwrap) {
      if (['.', 'identifier', 'property', 'this'].includes(it.type)) {
        type = 'identifier'
        break
      }

      if (it.type === 'string') {
        type = 'string'
        break
      }
    }

    if (type === 'identifier') {
      processIdentifierType(
        ctx,
        [i + 1, iEnd - 1],
        listUnwrap,
        arrayItems,
        update,
      )
      continue
    }

    if (type === 'number')
      processNumberType([i + 1, iEnd - 1], listUnwrap, update)
  }
}

export default main
