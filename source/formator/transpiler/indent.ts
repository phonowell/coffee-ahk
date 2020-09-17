// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type } = ctx

  if (type === 'indent') {

    if (['array', 'object'].includes(cache.last)) return true
    ctx.indent++

    const last = cache.last
    if (['else', 'function'].includes(last))
      content.push('edge', 'block-start')
    if (['if', 'while'].includes(last)) {
      content
        .push('edge', 'expression-end')
        .push('edge', 'block-start')
    }

    content.push('new-line', ctx.indent)
    return true
  }

  if (type === 'outdent') {

    if (['array', 'object'].includes(cache.last)) return true

    ctx.indent--

    if (!cache.last) return true

    cache.pop()
    content.push('edge', 'block-end')
    return true
  }

  return false
}

// export
export default main