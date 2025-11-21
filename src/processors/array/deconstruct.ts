import Item from '../../models/Item.js'

import { pickIndent } from './deconstruct/pick-indent.js'
import { pickPre } from './deconstruct/pick-pre.js'

import type { Context } from '../../types'

const main = (ctx: Context) => {
  const { content } = ctx

  let listPre: Item[][] = []
  const token = '__array__'
  let listContent: Item[] = []

  // each
  content.list.forEach((item, i) => {
    // output
    if (listPre.length && item.type === 'new-line') {
      const indent = pickIndent(ctx, i - 1)

      listPre.forEach(
        (_, j) =>
          (listContent = [
            ...listContent,
            // \n xxx = token[n]
            ...[
              ['new-line', indent.toString()],
              ...(listPre[listPre.length - j - 1] ?? []).map((it) => [
                it.type,
                it.value,
              ]),
              ['sign', '='],
              ['identifier', token],
              ['edge', 'index-start'],
              ['number', (j + 1).toString()],
              ['edge', 'index-end'],
            ].map(
              (args) =>
                new Item(args[0] as Item['type'], args[1] ?? '', item.scope),
            ),
          ]),
      )

      listPre.length = 0
      listContent.push(item)
      return
    }

    // find
    if (!item.is('sign', '=')) {
      listContent.push(item)
      return
    }
    if (!content.at(i - 1)?.is('edge', 'array-end')) {
      listContent.push(item)
      return
    }

    // pick
    // why i - 2
    // [xxx] = [xxx]
    //    ^1 ^2
    // 1 is what you need, and 2 is where you are, so minus 2
    listPre = pickPre(ctx, i - 2, listContent)
    listContent = listContent.slice(0, listContent.length - 2)

    listContent = [
      ...listContent,
      new Item('identifier', token, item.scope),
      new Item('sign', '=', item.scope),
    ]
  })

  // reload
  content.reload(listContent)
}

export default main
