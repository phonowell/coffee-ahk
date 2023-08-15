import { Context } from '../types'
import Item from '../module/Item'

// function

const main = (ctx: Context): void => {
  const { content } = ctx

  const findIndex = (i: number): number => {
    const it = content.eq(i)
    if (!it) return 0

    if (
      Item.is(it, 'edge', 'block-start') &&
      it.scope[it.scope.length - 1] === 'for'
    )
      return i

    return findIndex(i + 1)
  }

  const findName = (i: number): string => {
    const it = content.eq(i)
    if (!it) return ''

    if (Item.is(it, 'for', 'for')) return content.eq(i + 1).value

    return findName(i - 1)
  }

  // each
  const listCache: [number, Item[]][] = []
  content.list.forEach((item, i) => {
    if (!Item.is(item, 'for-in', 'in')) return

    const name = findName(i)
    if (name.startsWith('__') && name.endsWith('__')) return

    const index = findIndex(i)

    const next = content.eq(index + 1)
    const indent = next.value
    const scope = next.scope

    listCache.unshift([
      index + 1,
      [
        Item.new('new-line', indent, scope),
        Item.new('identifier', name, scope),
        Item.new('sign', '=', scope),
        Item.new('identifier', name, scope),
        Item.new('math', '-', scope),
        Item.new('number', '1', scope),
      ],
    ])
  })

  if (listCache.length) {
    const listContent: Item[] = [...content.list]
    for (const it of listCache) listContent.splice(it[0], 0, ...it[1])
    content.load(listContent)
  }
}

// export
export default main
