// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): void {

  const { content } = ctx

  content.list.forEach((it, i) => {
    if (it.type === 'edge' && it.value === 'index-start') {
      const _next = content.eq(i + 1)
      if (_next.type === 'number' && _next.value === '0') {
        const _next = content.eq(i + 2)
        if (_next.type === 'edge' && _next.value === 'index-end')
          throw new Error("ahk/forbidden: 'Array[0]' is not allowed, Array of ahk is beginning from '1'")
      }
    }
  })
}

// export
export default main