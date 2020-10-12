// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): void {

  const { content } = ctx

  content.list.forEach((it, i) => {
    if (content.equal(it, 'edge', 'index-start')) {
      const _next = content.eq(i + 1)
      if (content.equal(_next, 'number', '0')) {
        const _next = content.eq(i + 2)
        if (content.equal(_next, 'edge', 'index-end'))
          throw new Error("ahk/forbidden: 'Array[0]' is not allowed, Array of ahk is beginning from '1'")
      }
    }
  })
}

// export
export default main