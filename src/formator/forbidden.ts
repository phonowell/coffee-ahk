import type { Context } from '../types'

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

const main = (ctx: Context) => {
  const { type } = ctx

  if (listForbidden.includes(type))
    throw new Error(`ahk/forbidden: '${type}' is not allowed`)

  if (type === 'post_if')
    throw new Error("ahk/forbidden: 'post-if' is not allowed")

  return false
}

export default main
