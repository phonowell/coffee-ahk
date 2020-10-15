import findIndex from 'lodash/findIndex'
import findLastIndex from 'lodash/findLastIndex'
import isEqual from 'lodash/isEqual'

// interface

import { Context } from '../type'
type Item = Context['content']['list'][number]

// variable

const listForbidden = [
  // 'anonymous',
  'exception',
  'off',
  'on',
  'toggle'
]

// function

function countFn(
  ctx: Context
): Set<string> {

  const { content } = ctx
  const listFn: Set<string> = new Set()

  content.list.forEach(it => {
    if (it.type !== 'function') return
    listFn.add(it.value)
  })

  return listFn
}

function main(
  ctx: Context
): void {

  const { content } = ctx

  // function
  content.list.forEach((it, i) => {

    if (it.type !== 'edge' || it.value !== 'parameter-start') return

    const _prev = content.eq(i - 1)
    if (_prev.type !== 'identifier') return

    _prev.type = 'function'
  })

  // list
  let listFn = countFn(ctx)

  // validate
  listFn.forEach(it => {
    if (!listForbidden.includes(it.toLowerCase())) return
    throw new Error(`ahk/forbidden: function name '${it}' is not allowed`)
  })

  // anonymous function
  if (listFn.has('anonymous')) {
    pickAnonymous(ctx)
    listFn = countFn(ctx) // re-list
  }

  // fn in parameter -> "fn"
  content.list.forEach(it => {

    if (it.type !== 'identifier') return
    if (it.scope[it.scope.length - 1] !== 'call') return
    if (!listFn.has(it.value)) return

    it.type = 'string'
    it.value = `"${it.value}"`
  })
}

function pickAnonymous(
  ctx: Context,
  seed = 1
): void {

  const { content } = ctx

  content.update()
  const i = findLastIndex(content.list, {
    type: 'function',
    value: 'anonymous'
  })
  if (!~i) return

  const it = content.eq(i)
  it.value = `anonymous_${seed}`

  pickItem(ctx, seed, i, [...it.scope, 'function'])
    .forEach(it => {
      if (!it.type) return
      if (it.type === 'void') return
      content.add(it)
    })

  pickAnonymous(ctx, seed + 1)
}

function pickItem(
  ctx: Context,
  seed: number,
  i: number,
  scope: Item['scope'],
  listResult: Item[] = []
): Item[] {

  const { content } = ctx

  const item = content.eq(i)

  // clone
  const it = { ...item }
  it.scope = [...it.scope]

  // reset scope
  for (let i = 0; i < scope.length - 1; i++)
    it.scope.shift()

  listResult.push(it)

  if (
    !content.equal(item, 'edge', 'block-end')
    || !isEqual(item.scope, scope)
  ) {
    item.type = 'void'
    return pickItem(ctx, seed, i + 1, scope, listResult)
  }

  // last one
  item.type = 'string'
  item.value = `"anonymous_${seed}"`
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