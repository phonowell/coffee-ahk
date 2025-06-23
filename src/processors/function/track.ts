import Item from '../../models/Item.js'

import { pickIt } from './track/pick-it.js'
import { isUpper } from './track/utils.js'

import type { Context } from '../../types/index.js'

const main = (ctx: Context) => {
  const { content } = ctx
  const token = `__rf_${ctx.options.salt}__`

  const listStart: number[] = []
  const listEnd: number[] = []

  content.list.forEach((item, i) => {
    if (!item.is('edge', 'call-start')) return

    const prev = content.at(i - 1)
    if (!prev) return
    if (prev.is('function')) return
    if (prev.is('super')) return

    const [i2, listIt] = pickIt({
      countBracket: 0,
      hasIdentifier: false,
      i: i - 1,
      list: content.list,
      result: [],
      scope: prev.scope,
    })
    const list = listIt.filter((it) => it.is('identifier') || it.is('property'))
    const last = list[list.length - 1]
    if (last.value.startsWith('__')) return
    if (isUpper(last.value)) return

    // console.log(listIt)
    listStart.push(i2)
    listEnd.push(i - 1)
  })

  const listContent: Item[] = []
  let count = 0

  content.list.forEach((item, i) => {
    if (listStart.includes(i)) {
      listContent.push(
        new Item('identifier', token, item.scope),
        new Item('edge', 'call-start', [...item.scope.list, 'call']),
      )
    }
    listContent.push(item)
    if (listEnd.includes(i)) {
      listContent.push(
        new Item('sign', ',', item.scope),
        new Item('string', `"#rf/${ctx.options.salt}/${++count}"`, item.scope),
        new Item('edge', 'call-end', [...item.scope.list, 'call']),
      )
    }
  })

  content.reload(listContent)
}

export default main
