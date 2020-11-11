// interface

import { Context } from '../../type'

// function

function main(
  ctx: Context
): void {

  const { content } = ctx

  content.list.forEach((item, i) => {

    if (!content.equal(item, 'edge', 'parameter-start')) return

    const it = content.eq(i - 1)
    if (it.type !== 'identifier') return

    it.type = 'function'
  })
}

// export
export default main