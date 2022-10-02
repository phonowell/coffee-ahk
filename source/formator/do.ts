// interface

import { Context } from '../entry/type'

// function

const main = (ctx: Context): boolean => {
  const { content, type } = ctx

  if (type === 'do' || type === 'do_iife') {
    content.push('native', '__mark:do__')
    return true
  }

  return false
}

// export
export default main
