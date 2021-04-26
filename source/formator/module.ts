// interface

import { Context } from '../entry/type'

// function

const main = (
  ctx: Context,
): boolean => {

  const { content, type } = ctx

  if (type === 'export') {
    content.push('statement', 'export')
    return true
  }

  return false
}

// export
export default main