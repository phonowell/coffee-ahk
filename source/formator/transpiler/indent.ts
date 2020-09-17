// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type } = ctx

  if (type === 'indent') {

    if(['array','object'].includes(cache.last)) return true
    ctx.indent++

    const last = cache.last
    if (last === 'else')
      content.push('{')
    if (last === 'function')
      content.push('{')
    if (['if', 'while'].includes(last)) {
      content
        .push(')')
        .push('{')
    }

    content.push('new-line', ctx.indent)
    return true
  }

  if (type === 'outdent') {

    if(['array','object'].includes(cache.last)) return true

    ctx.indent--
    content.push('new-line', ctx.indent)

    if (!cache.last) return true

    cache.pop()
    content.push('}')
    return true
  }

  return false
}

// export
export default main