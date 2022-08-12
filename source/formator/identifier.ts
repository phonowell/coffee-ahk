// interface

import { Context } from '../entry/type'

// function

const main = (ctx: Context): boolean => {
  const { content, type, value } = ctx

  if (type === 'identifier') {
    content.push('identifier', value)
    return true
  }

  return false
}

// export
export default main
