import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'

// interface

import { Context } from '../type'

// variable

const listForbidden = [
  // 'anonymous',
  'exception',
  'off',
  'on',
  'toggle'
]

// function

function main(
  ctx: Context,
  seed: number = 0
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
  const listFn: Set<string> = new Set()
  content.list.forEach(it => {
    if (it.type !== 'function') return
    listFn.add(it.value)
  })

  // validate
  listFn.forEach(it => {
    if (!listForbidden.includes(it.toLowerCase())) return
    throw new Error(`ahk/forbidden: function name '${it}' is not allowed`)
  })

  // anonymous function
  if (listFn.has('anonymous')) {

    type Item = typeof content['list'][number]
    const list: Item[] = []

    function next(
      n: number,
      scope: Item['scope']
    ): void {

      const it = content.eq(n)
      list.push({ ...it })

      // last one
      if (
        content.equal(it, 'edge', 'block-end')
        && isEqual(it.scope, scope)
      ) {
        it.type = 'string'
        it.value = `"anonymous_${seed}"`
        list.push({
          type: 'new-line',
          value: '0',
          scope
        })
        return
      }

      it.type = 'void'
      next(n + 1, scope)
    }

    const i = findIndex(content.list, {
      type: 'function',
      value: 'anonymous'
    })
    const it = content.eq(i)

    it.value = `anonymous_${++seed}`
    next(i, [...it.scope, 'function'])

    list.forEach(_it => content.add(_it))
    content.update()
    return main(ctx, seed)
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

// export
export default main