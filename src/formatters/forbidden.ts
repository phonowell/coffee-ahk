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

  if (listForbidden.includes(type)) {
    throw new Error(
      `ahk/forbidden: token type '${type}' is not supported in CoffeeScript→AHK transpilation.`,
    )
  }

  if (type === 'post_if') {
    throw new Error(
      'ahk/forbidden: post-if syntax is not supported. Use standard if/else.',
    )
  }

  return false
}

export default main
