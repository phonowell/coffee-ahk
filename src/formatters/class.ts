import { ErrorType, TranspileError } from '../utils/error.js'

import type { Context } from '../types/index.js'

const main = (ctx: Context) => {
  const { content, scope, type, value } = ctx

  if (type === 'class') {
    // `x = class` — a class is a statement in AHK v1; assigning it would emit
    // `x := class {` which is invalid syntax
    const prev = content.at(-1)
    if (
      prev &&
      (prev.is('sign', '=') ||
        prev.is('sign', ',') ||
        prev.is('sign', ':') ||
        prev.is('bracket', '(') ||
        (prev.type === 'statement' &&
          (prev.value === 'return' || prev.value === 'throw' || prev.value === 'new')) ||
        (prev.type === 'edge' && prev.value.endsWith('-start') && !prev.is('edge', 'block-start')))
    ) {
      throw new TranspileError(
        ctx,
        ErrorType.UNSUPPORTED,
        `'class' in expression position is not supported`,
        `Declare the class at statement level and assign it to a variable`,
      )
    }

    scope.next = 'class'
    content.push({ type: 'class', value })
    return true
  }

  if (type === 'super') {
    content.push({ type: 'super', value: 'super' })
    return true
  }

  return false
}

export default main
