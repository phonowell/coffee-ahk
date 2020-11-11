import findIndex from 'lodash/findIndex'
import findLastIndex from 'lodash/findLastIndex'
import isEqual from 'lodash/isEqual'

// interface

import { Context } from '../../type'
type Item = Context['content']['list'][number]

// function

function main(
  ctx: Context
): void {

  next(ctx)
}

function next(
  ctx: Context,
  count = 1
): void {

  const { content } = ctx

  content.load()
  const i = findLastIndex(content.list, {
    type: 'function',
    value: 'anonymous'
  })
  if (!~i) return

  const it = content.eq(i)
  it.value = `${ctx.option.salt}_${count}`

  pickItem(ctx, count, i, [...it.scope, 'function'])
    .forEach(it => {
      if (!it.type) return
      if (it.type === 'void') return
      content.add(it)
    })

  next(ctx, count + 1)
}

function pickItem(
  ctx: Context,
  count: number,
  i: number,
  scope: Item['scope'],
  listResult: Item[] = []
): Item[] {

  const { content } = ctx

  const item = content.eq(i)
  const it = content.new(item)

  // reset scope
  for (let i = 0; i < scope.length - 1; i++)
    it.scope.shift()

  listResult.push(it)

  if (
    !content.equal(item, 'edge', 'block-end')
    || !isEqual(item.scope, scope)
  ) {
    item.type = 'void'
    return pickItem(ctx, count, i + 1, scope, listResult)
  }

  // last one
  item.type = 'origin'
  item.value = `Func("${ctx.option.salt}_${count}")`
  listResult.push({
    type: 'new-line',
    value: '0',
    scope
  })

  // reset indent
  const diff: number = parseInt(
    listResult[
      findIndex(listResult, {
        type: 'new-line'
      })
    ].value
  ) - 1
  if (diff > 0) {
    listResult.forEach(it => {
      if (it.type !== 'new-line') return
      let value = parseInt(it.value) - diff
      if (!(value >= 0)) value = 0
      it.value = value.toString()
    })
  }

  return listResult
}

// export
export default main