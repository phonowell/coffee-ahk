import { ErrorType, TranspileError } from '../utils/error.js'

import type { Context } from '../types/index.js'

const main = (ctx: Context): boolean => {
  const { content, type, value } = ctx

  if (type === 'extends') {
    content.push({ type: 'statement', value: 'extends' })
    return true
  }

  if (type === 'return' || type === 'throw') {
    // `x = throw e` / `x = return v` — statements can't sit in expression
    // position; `x := throw e` is invalid AHK
    const prev = content.at(-1)
    if (
      prev &&
      !prev.is('new-line') &&
      !(prev.type === 'edge' && (prev.value === 'block-start' || prev.value === 'parameter-end'))
    ) {
      throw new TranspileError(
        ctx,
        ErrorType.UNSUPPORTED,
        `'${type}' in expression position is not supported`,
        `Use a standalone ${type} statement`,
      )
    }
    content.push({ type: 'statement', value: type })
    return true
  }

  if (type === 'this') {
    content.push({ type: 'this', value: 'this' })
    return true
  }

  if (type === 'statement') {
    // `debugger` has no AHK equivalent — reject instead of dropping silently
    if (value === 'debugger') {
      throw new TranspileError(
        ctx,
        ErrorType.UNSUPPORTED,
        `'debugger' is not supported`,
        `Use OutputDebug or a logging helper instead`,
      )
    }

    if (value === 'break' || value === 'continue') {
      content.push({ type: 'statement', value })
      return true
    }
  }

  if (type === 'unary' && value === 'new') {
    content.push({ type: 'statement', value: 'new' })
    return true
  }

  return false
}

export default main
