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
    if (['for', 'function'].includes(last)) {
      if (cache.next !== 'if')
        content.push('edge', 'block-start')
    }

    if (['class', 'else'].includes(cache.next)) {
      const _next = cache.next
      cache.next = ''
      cache.push(_next)
      content.push('edge', 'block-start')
    }

    if (['if', 'while'].includes(cache.next)) {
      content.push('edge', 'expression-end')
      const _next = cache.next
      cache.next = ''
      cache.push(_next)
      content.push('edge', 'block-start')
    }

    content.push('new-line', ctx.indent)
    return true
  }

  if (type === 'outdent') {

    if (['array', 'object'].includes(cache.last)) return true
    ctx.indent--

    if (!cache.length) return true

    content
      .push('new-line', ctx.indent)
      .push('edge', 'block-end')

    cache.pop()
    return true
  }

  return false
}

// export
export default main