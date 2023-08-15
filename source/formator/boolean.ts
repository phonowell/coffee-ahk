// interface

import { Context } from '../types'

// function

const main = (ctx: Context): boolean => {
  const { content, type, value } = ctx

  if (type === 'bool') {
    content.push('boolean', value)
    return true
  }

  return false
}

// export
export default main
