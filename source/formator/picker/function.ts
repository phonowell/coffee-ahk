// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): void {

  const { content } = ctx

  content.clone().forEach((it, i) => {
    if (it.type !== 'param-start') return
    const _it = content.eq(i - 1)
    if (_it.type === 'identifier') _it.type = 'function'
  })
}

// export
export default main