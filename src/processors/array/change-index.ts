import { pickItem } from './change-index/pick-item.js'
import {
  isSimpleNonNegativeIndex,
  processIndexWithHelper,
  processSimpleIndex,
} from './change-index/process-types.js'
import { updateContent } from './change-index/update-content.js'

import type { Range } from './change-index/types.js'
import type Item from '../../models/Item.js'
import type { Context } from '../../types'

/**
 * Collect the full array expression before index-start.
 * Supports chained expressions like: obj.items, nested[0], arr[i][j]
 */
const collectArrayExpression = (
  content: Context['content'],
  startIndex: number,
): Item[] => {
  const items: Item[] = []
  let j = startIndex

  while (j >= 0) {
    const prev = content.at(j)
    if (!prev) break

    if (
      prev.type === 'identifier' ||
      prev.type === 'property' ||
      prev.type === '.'
    ) {
      items.unshift(prev)
      j--
    } else if (prev.is('edge', 'index-end')) {
      // Backtrack to find matching index-start for chained index: arr[x][y]
      let depth = 1
      let k = j - 1
      while (k >= 0 && depth > 0) {
        const it = content.at(k)
        if (it?.is('edge', 'index-end')) depth++
        else if (it?.is('edge', 'index-start')) depth--
        k--
      }
      // Collect items from index-end back to index-start (inclusive)
      // Use reverse order to maintain correct sequence when using unshift
      for (let m = j; m >= k + 1; m--) {
        const it = content.at(m)
        if (it) items.unshift(it)
      }
      j = k
    } else break
  }

  return items
}

/**
 * Check if the index expression is a string key (object property access).
 * String keys don't need 0→1 conversion.
 */
const isStringIndex = (listUnwrap: Item[]): boolean =>
  listUnwrap.some((it) => it.type === 'string')

/**
 * Find all index-start positions in content.
 */
const findAllIndexStarts = (content: Context['content']): number[] => {
  const positions: number[] = []
  for (let i = 0; i < content.length; i++) {
    const item = content.at(i)
    if (item?.is('edge', 'index-start')) positions.push(i)
  }
  return positions
}

const main = (ctx: Context) => {
  const { content } = ctx
  const token = `__ci_${ctx.options.salt}__`
  const countIgnore = { value: 0 }
  // Track processed simple indices by Item reference (stable across content reloads)
  const processedItems = new WeakSet<Item>()

  const update = (range: Range, list: Item[]) => {
    updateContent(ctx, range, list)
  }

  // Process from right to left to avoid issues with chained indices.
  // When processing nested[0][-1]:
  // - First process [-1] with arrayItems = [nested, [, 0, ]]
  // - Then process [0] with arrayItems = [nested]
  // This ensures arrayItems are collected before any modification.
  let positions = findAllIndexStarts(content)

  while (positions.length > 0) {
    // Always get the rightmost unprocessed index
    const i = positions.pop()
    if (i === undefined) break

    const item = content.at(i)
    if (!item?.is('edge', 'index-start')) continue
    if (processedItems.has(item)) continue // Already processed (simple index)

    const next = content.at(i + 1)
    if (!next) continue
    if (next.is('identifier', token)) continue // Already processed (__ci__ call)
    if (next.is('edge', 'index-end')) continue // Empty index []

    const [iEnd, listItem] = pickItem(ctx, item, i, countIgnore)
    const listUnwrap = listItem.slice(1, listItem.length - 1)

    // String keys (object property access) don't need conversion
    if (isStringIndex(listUnwrap)) continue

    // Compile-time optimization: single non-negative integer → direct +1
    const simpleIndex = isSimpleNonNegativeIndex(listUnwrap)
    if (simpleIndex !== null) {
      const indexItem = listUnwrap.at(0)
      if (indexItem) {
        processSimpleIndex(
          [i + 1, iEnd - 1],
          simpleIndex,
          indexItem.scope,
          update,
        )
        processedItems.add(item)
      }
      continue
    }

    // Collect the full array expression (supports chained index)
    const arrayItems = collectArrayExpression(content, i - 1)
    if (arrayItems.length === 0) continue

    // Runtime processing via __ci__ helper
    processIndexWithHelper(
      ctx,
      [i + 1, iEnd - 1],
      listUnwrap,
      arrayItems,
      update,
    )

    // Recalculate positions after content modification
    // Note: __ci__ calls are detected by next.is('identifier', token) check
    positions = findAllIndexStarts(content)
  }
}

export default main
