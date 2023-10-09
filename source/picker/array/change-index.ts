import { Context } from '../../types'
import Item from '../../module/Item'
import Scope from '../../module/Scope'

// interface

type Range = [number, number]

// function

const main = (ctx: Context) => {
  const { content } = ctx
  const token = `__ci_${ctx.option.salt}__`
  let countIgnore = 0

  // function

  const pickItem = (
    item: Item,
    i: number,
    listResult: Item[] = [],
  ): [number, Item[]] => {
    const it = content.at(i)
    if (!it) {
      countIgnore = 0
      return [i, listResult]
    }

    listResult.push(it)

    if (it.is('edge', 'index-start') && it.scope.isEquals(item.scope)) {
      countIgnore++
      return pickItem(item, i + 1, listResult)
    }

    if (it.is('edge', 'index-end') && it.scope.isEquals(item.scope)) {
      countIgnore--
      if (countIgnore === 0) return [i, listResult]
      return pickItem(item, i + 1, listResult)
    }

    return pickItem(item, i + 1, listResult)
  }

  const update = (range: Range, list: Item[]) => {
    const listContent: Item[] = [...content.list]
    listContent.splice(range[0], range[1] - range[0] + 1, ...list)
    content.reload(listContent)
  }

  // each
  let i = -1
  let len = content.list.length
  while (i < len) {
    i++
    len = content.list.length
    const item = content.at(i)

    if (!item?.is('edge', 'index-start')) continue

    const next = content.at(i + 1)
    if (!next) continue
    if (next.is('identifier', token)) continue
    if (next.is('edge', 'index-end')) continue

    const [iEnd, listItem] = pickItem(item, i)
    const listUnwrap: Item[] = listItem.slice(1, listItem.length - 1)
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
      ctx.flag.isChangeIndexUsed = true // set flag

      const list = [...listUnwrap]
      const scp = list[0].scope
      const scpCall = new Scope([...scp.list, 'call'])

      update(
        [i + 1, iEnd - 1],
        [
          new Item('identifier', token, scp),
          new Item('edge', 'call-start', scpCall),
          ...list,
          new Item('edge', 'call-end', scpCall),
        ],
      )

      continue
    }

    if (type === 'number') {
      const first = listUnwrap[0]
      const list =
        listUnwrap.length === 1
          ? [
              new Item(
                first.type,
                (parseFloat(first.value) + 1).toString(),
                first.scope,
              ),
            ]
          : [
              listUnwrap[listUnwrap.length - 1],
              new Item('math', '+', first.scope),
              new Item('number', '1', first.scope),
            ]

      update([i + listUnwrap.length, i + listUnwrap.length], list)

      continue
    }
  }
}

// export
export default main
