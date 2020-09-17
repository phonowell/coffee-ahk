// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, type } = ctx

  if (type === 'index_start') {
    if (content.last.type === '.') content.pop()
    content.push('edge', 'index-start')
    return true
  }

  if (type === 'index_end') {
    content.push('edge', 'index-end')
    return true
  }

  return false
}

// export
export default main