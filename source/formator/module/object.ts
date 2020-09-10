import { insertIndent } from '../toolkit'

// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, raw, type } = ctx

  if (type === '{') {
    cache.push('object')

    if (raw.generated) {
      if (content.last.type === 'new-line') {
        content.pop()
        content
          .push('{')
          .push('new-line', '\n' + insertIndent(ctx))
        return true
      }
    }

    content.push('{')
    return true
  }

  if (type === '}') {
    cache.pop()

    if (raw.generated)
      if (raw.origin && raw.origin[0].toLowerCase() === 'outdent') {
        content
          .push('new-line', '\n' + insertIndent(ctx, -1))
          .push('}')
        return true
      }

    content.push('}')
    return true
  }

  return false
}

// export
export default main