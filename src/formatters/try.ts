import { ErrorType, TranspileError } from '../utils/error.js'

import type { Context } from '../types/index.js'

const main = (ctx: Context) => {
  const { content, scope, type } = ctx

  // `try`/`catch`/`finally` are statements — a mid-line occurrence like
  // `x = try f() catch e` would emit `x := try {` — invalid AHK
  if (['try', 'catch', 'finally'].includes(type)) {
    const prev = content.at(-1)
    // `catch`/`finally` legitimately follow the try-block's `block-end`
    const ok =
      !prev ||
      prev.type === 'new-line' ||
      prev.is('edge', 'block-start') === true ||
      (type !== 'try' && prev.is('edge', 'block-end') === true)
    if (!ok) {
      throw new TranspileError(
        ctx,
        ErrorType.UNSUPPORTED,
        `'${type}' in expression position is not supported`,
        `Use a statement-level '${type}' block, or wrap in 'do ->' with 'return'`,
      )
    }
  }

  if (type === 'catch') {
    scope.next = 'catch'
    content.push({ type: 'try', value: 'catch' })
    return true
  }

  if (type === 'finally') {
    content.push({ type: 'try', value: 'finally' })
    scope.push('finally')
    content.push({ type: 'edge', value: 'block-start' })
    return true
  }

  if (type === 'try') {
    content.push({ type: 'try', value: 'try' })
    scope.push('try')
    content.push({ type: 'edge', value: 'block-start' })
    return true
  }

  return false
}

export default main
