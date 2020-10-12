// interface

import { Context } from '../type'

// variable

const listForbidden = [
  '..',
  'catch',
  'finally',
  'try',
  'when'
] as const

// function

function main(
  ctx: Context
): boolean {

  const { type } = ctx

  if (type === '=>')
    throw new Error("ahk/forbidden: '=>' is not allowed, use '->' instead of it")

  if (listForbidden.includes(type as typeof listForbidden[number]))
    throw new Error(`ahk/forbidden: '${type}' is not allowed`)

  if (type === 'post_if')
    throw new Error("ahk/forbidden: 'post-if' is not allowed")

  return false
}

// export
export default main