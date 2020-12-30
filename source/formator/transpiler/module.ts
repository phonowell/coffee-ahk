// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, type } = ctx

  if (type === 'export') {

    content.push('statement', 'export')

    return true
  }

  return false
}

// export
export default main
