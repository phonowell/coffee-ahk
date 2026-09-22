import Item from '../models/Item.js'
import { createTranspileError, ErrorType } from '../utils/error.js'

import type { Context } from '../types/index.js'

const main = (ctx: Context) => {
  const { content } = ctx

  const findIndex = (i: number): number => {
    for (let j = i; j < content.length; j++) {
      const it = content.at(j)
      if (!it) break
      if (it.is('edge', 'block-start') && it.scope.at(-1) === 'for') return j
    }
    return -1
  }

  const findName = (i: number): string => {
    for (let j = i; j >= 0; j--) {
      const it = content.at(j)
      if (!it) break
      if (!it.is('for', 'for')) continue

      const next = content.at(j + 1)
      if (!next) {
        throw createTranspileError(
          ErrorType.SYNTAX_ERROR,
          `missing variable name after for/in keyword`,
          `Add variable name after 'for' keyword`,
        )
      }
      return next.value
    }
    return ''
  }

  // each
  const listCache: [number, Item[]][] = []
  content.toArray().forEach((item, i) => {
    if (!item.is('for-in', 'in')) return

    const name = findName(i)
    if (name.startsWith('__') && name.endsWith('__')) return
    // Internal placeholders (ℓi for single-var `for v in arr`) are invisible to
    // the user — decrementing them is dead code
    if (name.startsWith('ℓ')) return

    const index = findIndex(i)
    if (index < 0) {
      throw createTranspileError(
        ErrorType.SYNTAX_ERROR,
        `missing block-start after for/in statement`,
        `Ensure for loop has proper block structure`,
      )
    }

    const next = content.at(index + 1)
    if (!next) {
      throw createTranspileError(
        ErrorType.SYNTAX_ERROR,
        `missing block-start after for/in statement`,
        `Ensure for loop has proper block structure`,
      )
    }

    const indent = next.value
    const { scope } = next

    listCache.unshift([
      index + 1,
      [
        new Item({ type: 'new-line', value: indent, scope }),
        new Item({ type: 'identifier', value: name, scope }),
        new Item({ type: 'sign', value: '=', scope }),
        new Item({ type: 'identifier', value: name, scope }),
        new Item({ type: 'math', value: '-', scope }),
        new Item({ type: 'number', value: '1', scope }),
      ],
    ])
  })

  if (listCache.length) {
    const listContent: Item[] = content.toArray()
    for (const it of listCache) listContent.splice(it[0], 0, ...it[1])
    content.reload(listContent)
  }
}

export default main
