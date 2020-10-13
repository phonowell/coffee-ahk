// interface

import { Context } from '../type'

// variable

const listForbidden = [
  'exception',
  'off',
  'on',
  'toggle'
]

// function

function main(
  ctx: Context
): void {

  const { content } = ctx
  const listFn: Set<string> = new Set()

  // function
  content.list.forEach((it, i) => {

    if (it.type !== 'edge' || it.value !== 'parameter-start') return

    const _prev = content.eq(i - 1)
    if (_prev.type !== 'identifier') return

    _prev.type = 'function'
    listFn.add(_prev.value)
  })

  // validate
  listFn.forEach(it => {
    if (!listForbidden.includes(it.toLowerCase())) return
    throw new Error(`ahk/forbidden: function name '${it}' is not allowed`)
  })

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