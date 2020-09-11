// interface

import { Context } from '../type'

// variable

const cacheVariable: Set<string> = new Set()

// function

function main(
  ctx: Context
): void {

  const { content } = ctx

  content.clone().forEach((it, i) => {

    if (it.type !== '=') return

    const _it = content.eq(i - 1)
    if (_it.type !== 'identifier') return

    const _prev = content.eq(i - 2)
    if (!_prev || (_prev.type === 'new-line' && _prev.value === '0')) {
      if (cacheVariable.has(_it.value)) return
      cacheVariable.add(_it.value)
      _it.value = `global ${_it.value}`
    }
  })
}

// export
export default main