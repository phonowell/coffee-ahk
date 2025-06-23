import { pickItem } from './change-index/pick-item.js'
import {
  processIdentifierType,
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

    const [iEnd, listItem] = pickItem(ctx, item, i, countIgnore)
    const listUnwrap = listItem.slice(1, listItem.length - 1)
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
      processIdentifierType(ctx, [i + 1, iEnd - 1], listUnwrap, update)
      continue
    }

    if (type === 'number')
      processNumberType([i + 1, iEnd - 1], listUnwrap, update)
  }
}

export default main
