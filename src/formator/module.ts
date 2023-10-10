// interface

import { Context } from '../types'

// function

const main = (ctx: Context) => {
  const { content, type } = ctx

  if (type === 'export') {
    content.push('statement', 'export')
    return true
  }

  return false
}

// export
export default main
