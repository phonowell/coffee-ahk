// interface

import { Context } from '../type'

// variable

const listForbidden = [
  '..',
  '?',
  'null',
  'undefined'
] as const

// function

function main(
  ctx: Context
): boolean {

  const { type } = ctx

  if (listForbidden.includes(type as typeof listForbidden[number]))
    throw new Error(`ahk/forbidden: '${type}' is not allowed`)

  if (type === 'post_if')
    throw new Error("ahk/forbidden: 'post-if' is not allowed")

  return false
}

// export
export default main