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

  const i = findLastIndex(content.list, {
    type: 'function',
    value: 'anonymous'
  })
  if (!~i) return

  const it = content.eq(i)

  it.value = `anonymous_${seed}`
  pickItem(ctx, seed, i, [...it.scope, 'function'])
    .forEach(it => content.add(it))
  content.update()

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

  const it = content.eq(i)
  listResult.push({ ...it })

  // last one
  if (
    content.equal(it, 'edge', 'block-end')
    && isEqual(it.scope, scope)
  ) {
    it.type = 'string'
    it.value = `"anonymous_${seed}"`
    listResult.push({
      type: 'new-line',
      value: '0',
      scope
    })
    return listResult
  }

  it.type = 'void'
  return pickItem(ctx, seed, i + 1, scope, listResult)
}

// export
export default main