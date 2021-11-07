import { Context } from '../../entry/type'
import Item from '../../module/Item'
import findIndex from 'lodash/findIndex'
import findLastIndex from 'lodash/findLastIndex'
import isEqual from 'lodash/isEqual'

// function

const main = (
  ctx: Context
): void => {

  next(ctx)
  transFunc(ctx)
}

const next = (
  ctx: Context,
  count = 1
): void => {

  const { content } = ctx

  content.load()
  const i = findLastIndex(content.list, {
    type: 'function',
    value: 'anonymous',
  })
  if (!~i) return

  const it = content.eq(i)
  it.value = `${ctx.option.salt}_${count}`

  pickItem(ctx, count, i, [...it.scope, 'function'])
    .forEach(_it => {
      if (!_it.type) return
      if (_it.type === 'void') return
      content.push(_it)
    })

  next(ctx, count + 1)
}

const pickItem = (
  ctx: Context,
  count: number,
  i: number,
  scope: Item['scope'],
  listResult: Item[] = []
): Item[] => {

  const { content } = ctx

  const item = content.eq(i)
  if (!item) return listResult

  const it = Item.new(item)

  // reset scope
  for (let j = 0; j < scope.length - 1; j++) it.scope.shift()

  listResult.push(it)

  if (
    !Item.equal(item, 'edge', 'block-end')
    || !isEqual(item.scope, scope)
  ) {
    item.type = 'void'
    return pickItem(ctx, count, i + 1, scope, listResult)
  }

  // last one
  item.type = 'origin'
  item.value = `Func("${ctx.option.salt}_${count}")`
  listResult.push(Item.new('new-line', '0', scope))

  // reset indent
  const diff: number = parseInt(
    listResult[
      findIndex(listResult, {
        type: 'new-line',
      })
    ].value, 10
  ) - 1
  if (diff > 0) listResult.forEach(_it => {
    if (_it.type !== 'new-line') return
    let value = parseInt(_it.value, 10) - diff
    if (!(value >= 0)) value = 0
    _it.value = value.toString()
  })

  return listResult
}

const transFunc = (
  ctx: Context
): void => {

  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach(item => {

    if (!(
      item.type === 'origin'
      && item.value.startsWith('Func(')
      && item.value.endsWith(')')
    )) {
      listContent.push(item)
      return
    }

    const _scope = [...item.scope]
    _scope.pop()

    listContent.push(Item.new('identifier', 'Func', _scope))
    listContent.push(Item.new('edge', 'call-start', [..._scope, 'call']))
    listContent.push(Item.new(
      'string',
      item.value.slice(5, item.value.length - 1),
      [..._scope, 'call']
    ))
    listContent.push(Item.new('edge', 'call-end', [..._scope, 'call']))
  })

  content.load(listContent)
}

// export
export default main