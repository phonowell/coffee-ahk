// interface

import { Context } from '../entry/type'

// variable

const listForbidden = [
  '..',
  '?',
  '?.',
  'bin?',
  // 'export',
  'from',
  'func_exist',
  'import',
]

// function

const main = (ctx: Context): boolean => {
  const { type } = ctx

  if (listForbidden.includes(type))
    throw new Error(`ahk/forbidden: '${type}' is not allowed`)

  if (type === 'post_if')
    throw new Error("ahk/forbidden: 'post-if' is not allowed")

  return false
}

// export
export default main
