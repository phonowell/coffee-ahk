// interface

import { Context } from '../types'

// function

const main = (ctx: Context): boolean => {
  const { content, type } = ctx

  if (['nan', 'null', 'undefined'].includes(type)) {
    content.push('string', '""')
    return true
  }

  return false
}

// export
export default main
