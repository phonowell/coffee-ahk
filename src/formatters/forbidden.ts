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
  const { type, token } = ctx
  const line = token[2].first_line + 1

  if (listForbidden.includes(type)) {
    throw new Error(
      `ahk/forbidden (line ${line}): token type '${type}' is not supported in CoffeeScript→AHK transpilation.`,
    )
  }

  if (type === 'post_if') {
    throw new Error(
      `ahk/forbidden (line ${line}): post-if syntax is not supported. Use standard if/else.`,
    )
  }

  return false
}

export default main
