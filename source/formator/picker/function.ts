import findIndex from 'lodash/findIndex'
import findLastIndex from 'lodash/findLastIndex'
import isEqual from 'lodash/isEqual'

// interface

import { Context } from '../type'
type Item = Context['content']['list'][number]

// variable

const listForbidden = [
  'exception',
  'off',
  'on',
  'toggle'
]

let salt = ''

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

  // salt
  salt = ctx.option.salt || Math.random()
    .toString(32)
    .split('.')[1]
    .padStart(11, '0')

  // function
  transFn(ctx)

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

  // function as parameter
  transFnAsParam(ctx, listFn)

  // call function(s) which as parameter
  transCallAsParam(ctx)
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
  it.value = `${salt}_${seed}`

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
  item.value = `"${salt}_${seed}"`
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

function transCallAsParam(
  ctx: Context
): void {

  const { content } = ctx

  content.list.forEach((it, i) => {

    if (it.type !== 'function') return

    function pick(
      i: number,
      listResult: string[] = []
    ): string[] {

      const it = content.eq(i)

      if (content.equal(it, 'edge', 'parameter-end')) return listResult
      if (it.type !== 'identifier') return pick(i + 1, listResult)
      listResult.push(it.value)
      return pick(i + 1, listResult)
    }
    const listParameter = pick(i)

    function change(
      i: number,
      scope: Item['scope']
    ): void {

      const it = content.eq(i)

      if (!it) return
      if (
        content.equal(it, 'edge', 'block-end')
        && it.scope.length === 1
        && it.scope[0] === 'function'
      ) return

      if (it.type !== 'identifier') return change(i + 1, scope)
      if (!listParameter.includes(it.value)) return change(i + 1, scope)

      const _next = content.eq(i + 1)
      if (!_next) return change(i + 1, scope)
      if (!content.equal(_next, 'edge', 'call-start')) return change(i + 1, scope)

      it.type = 'origin'
      it.value = `Func(${it.value}).Call`

      return change(i + 1, scope)
    }
    change(i, it.scope)
  })
}

function transFn(
  ctx: Context
): void {

  const { content } = ctx

  content.list.forEach((it, i) => {

    if (it.type !== 'edge' || it.value !== 'parameter-start') return

    const _prev = content.eq(i - 1)
    if (_prev.type !== 'identifier') return

    _prev.type = 'function'
  })
}

function transFnAsParam(
  ctx: Context,
  listFn: Set<string>
): void {

  const { content } = ctx

  content.list.forEach((it, i) => {

    if (it.type !== 'identifier') return
    if (it.scope[it.scope.length - 1] !== 'call') return
    if (!listFn.has(it.value)) return
    if (content.equal(content.eq(i + 1), 'edge', 'call-start')) return

    it.type = 'string'
    it.value = `"${it.value}"`
  })
}

// export
export default main