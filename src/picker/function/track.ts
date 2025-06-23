import { at } from 'fire-keeper'

import Item from '../../models/Item.js'

import type Scope from '../../models/Scope.js'
import type { Context } from '../../types/index.js'

type Option = {
  countBracket: number
  hasIdentifier: boolean
  i: number
  list: Item[]
  result: Item[]
  scope: Scope
}

const isUpper = (ipt: string) => !ipt.startsWith(ipt[0].toLowerCase())

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

const pickIt = (option: Option): [number, Item[]] => {
  const { countBracket, hasIdentifier, i, list, result, scope } = option

  const item = at(list, i)
  if (!item) return [i, result]

  result.unshift(item)

  let countBracket2 = countBracket
  if (item.is('bracket')) {
    if (item.value === '(') countBracket2 = countBracket - 1
    else countBracket2 = countBracket + 1
  }

  const hasIdentifier2 =
    ['identifier', 'super', 'this'].includes(item.type) || hasIdentifier

  if (countBracket2 === 0 && hasIdentifier2 && item.scope.isEqual(scope))
    return [i, result]

  return pickIt({
    countBracket: countBracket2,
    hasIdentifier: hasIdentifier2,
    i: i - 1,
    list,
    result,
    scope,
  })
}

export default main
