import Item from '../../models/Item.js'
import findIndex from '../../utils/findIndex.js'
import findLastIndex from '../../utils/findLastIndex.js'

import type Scope from '../../models/Scope'
import type { Context } from '../../types'

const main = (ctx: Context) => {
  next(ctx)
  transFunc(ctx)
}

const next = (ctx: Context, count = 1) => {
  const { content } = ctx

  content.reload()
  const i = findLastIndex(content.list, {
    type: 'function',
    value: 'anonymous',
  })
  if (!~i) return

  const it = content.at(i)
  if (!it) throw new Error('Unexpected error: picker/function/anonymous/1')
  it.value = `${ctx.option.salt}_${count}`

  pickItem(ctx, count, i, [...it.scope.list, 'function']).forEach((item) => {
    if (item.type === 'void') return
    content.push(item)
  })

  next(ctx, count + 1)
}

const pickItem = (
  ctx: Context,
  count: number,
  i: number,
  scope: Scope['list'],
  listResult: Item[] = [],
): Item[] => {
  const { content } = ctx

  const item = content.at(i)
  if (!item) return listResult

  const it = item.clone()

  // reset scope
  for (let j = 0; j < scope.length - 1; j++) it.scope.shift()

  listResult.push(it)

  if (!item.is('edge', 'block-end') || !item.scope.isEquals(scope)) {
    item.type = 'void'
    return pickItem(ctx, count, i + 1, scope, listResult)
  }

  // last one
  item.type = 'native'
  item.value = `Func("${ctx.option.salt}_${count}")`
  listResult.push(new Item('new-line', '0', scope))

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
  if (diff > 0) {
    listResult.forEach((it2) => {
      if (it2.type !== 'new-line') return
      let value = parseInt(it2.value, 10) - diff
      if (!(value >= 0)) value = 0
      it2.value = value.toString()
    })
  }

  return listResult
}

const transFunc = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item) => {
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

    const scope2 = item.scope.list
    scope2.pop()

    listContent.push(new Item('identifier', 'Func', scope2))
    listContent.push(new Item('edge', 'call-start', [...scope2, 'call']))
    listContent.push(
      new Item('string', item.value.slice(5, item.value.length - 1), [
        ...scope2,
        'call',
      ]),
    )
    listContent.push(new Item('edge', 'call-end', [...scope2, 'call']))
  })

  content.reload(listContent)
}

export default main
