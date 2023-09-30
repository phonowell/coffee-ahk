import { Context } from '../../types'
import Item, { Scope } from '../../module/Item'
import at from '../../utils/at'

// interface

type Option = {
  countBracket: number
  hasIdentifier: boolean
  i: number
  list: Item[]
  result: Item[]
  scope: Scope[]
}

// function

const isUpper = (ipt: string) => !ipt.startsWith(ipt[0].toLowerCase())

const main = (ctx: Context) => {
  const { content } = ctx
  const token = `__rf_${ctx.option.salt}__`

  const listStart: number[] = []
  const listEnd: number[] = []

  content.list.forEach((item, i) => {
    if (!Item.is(item, 'edge', 'call-start')) return

    const prev = content.at(i - 1)
    if (!prev) throw new Error('Unexpected error: picker/return-function/1')

    if (Item.is(prev, 'function')) return
    if (Item.is(prev, 'super')) return

    const [i2, listIt] = pickIt({
      countBracket: 0,
      hasIdentifier: false,
      i: i - 1,
      list: content.list,
      result: [],
      scope: prev.scope,
    })
    const list = listIt.filter(
      it => Item.is(it, 'identifier') || Item.is(it, 'property'),
    )
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
    if (listStart.includes(i))
      listContent.push(
        Item.new('identifier', token, item.scope),
        Item.new('edge', 'call-start', [...item.scope, 'call']),
      )
    listContent.push(item)
    if (listEnd.includes(i))
      listContent.push(
        Item.new('sign', ',', item.scope),
        Item.new('string', `"#rf/${ctx.option.salt}/${++count}"`, item.scope),
        Item.new('edge', 'call-end', [...item.scope, 'call']),
      )
  })

  content.load(listContent)
}

const pickIt = (option: Option): [number, Item[]] => {
  const { countBracket, hasIdentifier, i, list, result, scope } = option

  const item = at(list, i)
  if (!item) return [i, result]

  result.unshift(item)

  const countBracket2 = !Item.is(item, 'bracket')
    ? countBracket
    : item.value === '('
    ? countBracket - 1
    : countBracket + 1

  const hasIdentifier2 =
    ['identifier', 'super', 'this'].includes(item.type) || hasIdentifier

  if (
    countBracket2 === 0 &&
    hasIdentifier2 &&
    Item.isScopeEqual(item.scope, scope)
  )
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

// export
export default main
