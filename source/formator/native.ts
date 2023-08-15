// interface

import { Context } from '../types'

// function

const main = (ctx: Context): boolean => {
  const { content, type, value } = ctx

  if (type === 'js') {
    content.push('native', value)
    return true
  }

  return false
}

// export
export default main
