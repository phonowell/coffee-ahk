// interface

import { Context } from '../entry/type'

// function

const main = (
  ctx: Context,
): boolean => {

  const { content, type } = ctx

  if (type === '@') {
    content.push('this')
    return true
  }

  if (type === '::') {
    if (content.last.type === '.') content.pop()
    content
      .push('.')
      .push('prototype')
    return true
  }

  return false
}

// export
export default main