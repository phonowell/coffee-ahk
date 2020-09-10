// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, type } = ctx

  if (type === '@') {
    content
      .push('this')
      .push('.')
    return true
  }

  if (type === '::') {
    if (content.last.type === '.') content.pop()
    content
      .push('.')
      .push('prototype')
      .push('.')
    return true
  }

  return false
}

// export
export default main