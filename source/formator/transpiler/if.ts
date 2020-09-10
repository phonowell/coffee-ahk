// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { cache, content, type, value } = ctx

  if (type === 'if') {
    cache.push('if')
    content
      .push('if', 'if ')
      .push(
        '(',
        value === 'if' // if | unless
          ? '('
          : '!('
      )
    return true
  }

  if (type === 'else') {
    cache.push('else')
    content.push('else', ' else ')
    return true
  }

  return false
}

// export
export default main