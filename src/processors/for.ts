import Item from '../models/Item.js'
import { ErrorType, TranspileError } from '../utils/error.js'

import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content } = ctx

  const findIndex = (i: number): number => {
    const it = content.at(i)
    if (!it) return 0

    if (it.is('edge', 'block-start') && it.scope.at(-1) === 'for') return i

    return findIndex(i + 1)
  }

  const findName = (i: number): string => {
    const it = content.at(i)
    if (!it) return ''

    if (it.is('for', 'for')) {
      const next = content.at(i + 1)
      if (!next) {
        throw new TranspileError(
          ctx,
          ErrorType.SYNTAX_ERROR,
          `missing variable name after for/in keyword`,
          `Add variable name after 'for' keyword`,
        )
      }
      return next.value
    }

    return findName(i - 1)
  }

  // each
  const listCache: [number, Item[]][] = []
  content.toArray().forEach((item, i) => {
    if (!item.is('for-in', 'in')) return

    const name = findName(i)
    if (name.startsWith('__') && name.endsWith('__')) return

    const index = findIndex(i)

    const next = content.at(index + 1)
    if (!next) {
      throw new TranspileError(
        ctx,
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
