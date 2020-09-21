// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, type } = ctx

  if (type === '@') {
    content.push(ctx, 'this')
    return true
  }

  if (type === '::') {
    if (content.last.type === '.') content.pop()
    content
      .push(ctx, '.')
      .push(ctx, 'prototype')
    return true
  }

  return false
}

// export
export default main