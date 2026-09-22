import { ErrorType, TranspileError } from '../utils/error.js'

import type { Context } from '../types/index.js'

const main = (ctx: Context) => {
  const { content, scope, type } = ctx

  if (type === 'switch') {
    // `x = switch a ...` — switch is a statement; assigning it emits
    // `x := switch a {` — invalid AHK
    const prev = content.at(-1)
    if (prev && prev.type !== 'new-line' && !prev.is('edge', 'block-start')) {
      throw new TranspileError(
        ctx,
        ErrorType.UNSUPPORTED,
        `'switch' in expression position is not supported`,
        `Use a statement-level 'switch', or wrap in 'do ->' with 'return'`,
      )
    }
    scope.push('switch')
    content.push({ type: 'if', value: 'switch' })
    return true
  }

  if (type === 'leading_when') {
    scope.push('case')
    content.push({ type: 'if', value: 'case' })
    return true
  }

  return false
}

export default main
