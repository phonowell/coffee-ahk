import Item from '../../models/Item.js'
import Scope from '../../models/Scope.js'

import { findFnStart } from './implicit-return/find-fn-start.js'
import { ignore } from './implicit-return/ignore.js'
import { pickItems } from './implicit-return/pick-items.js'

import type { Flag } from './implicit-return/types.js'
import type { Context } from '../../types'

const main = (ctx: Context) => {
  const { content } = ctx

  const flag: Flag = {
    i: -1,
    scope: new Scope(),
    isObjectWithoutBrackets: false,
  }

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    listContent.push(item)

    if (i === flag.i) {
      if (flag.isObjectWithoutBrackets) {
        listContent.push(
          new Item('new-line', flag.scope.length.toString(), flag.scope),
        )
      }
      listContent.push(new Item('statement', 'return', flag.scope))
      return
    }

    if (!item.is('edge', 'parameter-start')) return
    if (content.at(i - 1)?.is('property', '__New')) return

    const [iStart, scpStart] = findFnStart(ctx, i)
    const list = pickItems(ctx, {
      i: iStart,
      list: [],
      scope: scpStart,
    })

    const item1 = list.at(1)
    const isObjectWithoutBrackets = item1?.is('bracket', '{') ?? false
    if (
      list.filter((it) => it.is('new-line') && it.scope.isEqual(scpStart))
        .length > (isObjectWithoutBrackets ? 1 : 2)
    )
      return
    const item2 = list.at(2)
    if (item2 && ignore(item2)) return

    flag.i = iStart + (isObjectWithoutBrackets ? 0 : 1)
    flag.scope = scpStart
    flag.isObjectWithoutBrackets = isObjectWithoutBrackets
  })

  content.reload(listContent)
}

export default main
