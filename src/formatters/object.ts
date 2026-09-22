import { ErrorType, TranspileError } from '../utils/error.js'

import type { Context } from '../types/index.js'

const main = (ctx: Context): boolean => {
  const { content, scope, token, type } = ctx

  if (type === '{') {
    // `f = ({a, b}) ->` — destructuring parameters have no AHK v1 equivalent;
    // a `{` after `=` is a default value, not a pattern
    const prev = content.at(-1)
    if (
      scope.last === 'parameter' &&
      (prev?.is('edge', 'parameter-start') || prev?.is('sign', ','))
    ) {
      throw new TranspileError(
        ctx,
        ErrorType.UNSUPPORTED,
        `object destructuring in parameters is not supported`,
        `Take a plain parameter and destructure inside the body: f = (obj) -> {a, b} = obj`,
      )
    }

    if (scope.last === 'class' && !content.at(-1)?.is('sign', '=')) return true

    if (content.at(-1)?.is('new-line') && token.generated) content.pop()

    scope.push('object')
    content.push({ type: 'bracket', value: '{' })
    return true
  }

  if (type === '}') {
    if (scope.last === 'class') return true

    if (token.generated && typeof token.origin?.indentSize === 'number')
      content.push({ type: 'bracket', value: '}-' })
    else content.push({ type: 'bracket', value: '}' })
    scope.pop()
    return true
  }

  return false
}

export default main
