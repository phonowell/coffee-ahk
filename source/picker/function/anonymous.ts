import { findLastIndex, isEqual, findIndex } from 'lodash'

import { Context } from '../../types'
import Item from '../../module/Item'

// functions

const main = (ctx: Context) => {
  next(ctx)
  transFunc(ctx)
}

const next = (ctx: Context, count = 1) => {
  const { content } = ctx

  content.load()
  const i = findLastIndex(content.list, {
    type: 'function',
    value: 'anonymous',
  })
  if (!~i) return

  const it = content.at(i)
  if (!it) throw new Error('Unexpected error: picker/function/anonymous/1')
  it.value = `${ctx.option.salt}_${count}`

  pickItem(ctx, count, i, [...it.scope, 'function']).forEach(item => {
    if (item.type === 'void') return
    content.push(item)
  })

  next(ctx, count + 1)
}

const pickItem = (
  ctx: Context,
  count: number,
  i: number,
  scope: Item['scope'],
  listResult: Item[] = [],
): Item[] => {
  const { content } = ctx

  const item = content.at(i)
  if (!item) return listResult

  const it = Item.new(item)

  // reset scope
  for (let j = 0; j < scope.length - 1; j++) it.scope.shift()

  listResult.push(it)

  if (!Item.is(item, 'edge', 'block-end') || !isEqual(item.scope, scope)) {
    item.type = 'void'
    return pickItem(ctx, count, i + 1, scope, listResult)
  }

  // last one
  item.type = 'native'
  item.value = `Func("${ctx.option.salt}_${count}")`
  listResult.push(Item.new('new-line', '0', scope))

  // reset indent
  const diff: number =
    parseInt(
      listResult[
        findIndex(listResult, {
          type: 'new-line',
        })
      ].value,
      10,
    ) - 1
  if (diff > 0)
    listResult.forEach(it2 => {
      if (it2.type !== 'new-line') return
      let value = parseInt(it2.value, 10) - diff
      if (!(value >= 0)) value = 0
      it2.value = value.toString()
    })

  return listResult
}

const transFunc = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach(item => {
    if (
      !(
        item.type === 'native' &&
        item.value.startsWith('Func(') &&
        item.value.endsWith(')')
      )
    ) {
      listContent.push(item)
      return
    }

    const scope2 = [...item.scope]
    scope2.pop()

    listContent.push(Item.new('identifier', 'Func', scope2))
    listContent.push(Item.new('edge', 'call-start', [...scope2, 'call']))
    listContent.push(
      Item.new('string', item.value.slice(5, item.value.length - 1), [
        ...scope2,
        'call',
      ]),
    )
    listContent.push(Item.new('edge', 'call-end', [...scope2, 'call']))
  })

  content.load(listContent)
}

// export
export default main
