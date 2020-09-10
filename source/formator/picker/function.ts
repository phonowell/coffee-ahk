// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): void {

  const { content, storage } = ctx

  content.clone().forEach((it, i) => {
    if (it.type !== 'param-start') return
    const _it = content.eq(i - 1)
    if (_it.type === 'identifier') _it.type = 'function'
  })

  content.clone().forEach(it => {
    if (it.type !== 'function') return
    storage.push('function', it.value)
  })
}

// export
export default main