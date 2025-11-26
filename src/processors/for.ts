import Item from '../models/Item.js'

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
        throw new Error(
          `ahk/internal: for: missing variable name after for/in keyword (token index ${i})`,
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
      throw new Error(
        `ahk/internal: for: missing block-start after for/in statement (token index ${index})`,
      )
    }

    const indent = next.value
    const { scope } = next

    listCache.unshift([
      index + 1,
      [
        new Item('new-line', indent, scope),
        new Item('identifier', name, scope),
        new Item('sign', '=', scope),
        new Item('identifier', name, scope),
        new Item('math', '-', scope),
        new Item('number', '1', scope),
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
