// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, type } = ctx

  if (type === 'do' || type === 'do_iife') {
    content.push('origin', '__mark:do__')
    return true
  }

  return false
}

// export
export default main