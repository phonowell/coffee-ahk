import { ErrorType, TranspileError } from '../utils/error.js'

import type { Context } from '../types/index.js'

const main = (ctx: Context) => {
  const { content, scope, type } = ctx

  if (type === '[') {
    // `f = ([a, b]) ->` — array destructuring parameters have no AHK v1
    // equivalent; a `[` after `=` is a default value, not a pattern
    const prev = content.at(-1)
    if (
      scope.last === 'parameter' &&
      (prev?.is('edge', 'parameter-start') || prev?.is('sign', ','))
    ) {
      throw new TranspileError(
        ctx,
        ErrorType.UNSUPPORTED,
        `array destructuring in parameters is not supported`,
        `Take a plain parameter and destructure inside the body: f = (arr) -> [a, b] = arr`,
      )
    }

    scope.push('array')
    content.push({ type: 'edge', value: 'array-start' })
    return true
  }

  if (type === ']') {
    scope.pop()
    content.push({ type: 'edge', value: 'array-end' })
    return true
  }

  return false
}

export default main
