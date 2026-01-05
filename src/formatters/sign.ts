import { ErrorType, TranspileError } from '../utils/error.js'

import type { Context } from '../types'

const main = (ctx: Context): boolean => {
  const { content, scope, type } = ctx

  if (type === '...') {
    if (!['call', 'parameter'].includes(scope.last)) {
      throw new TranspileError(
        ctx,
        ErrorType.FORBIDDEN,
        `spread operator '...' only allowed in function calls or parameter lists`,
        `Move spread operator to function call or parameter context`,
      )
    }
    content.push({ type: 'sign', value: '...' })
  }

  if (type === '=') {
    // 检查左值是否与 class 名冲突
    const prev = content.at(-1)
    if (prev?.type === 'identifier' && ctx.cache.classNames.has(prev.value)) {
      throw new TranspileError(
        ctx,
        ErrorType.CLASS_ERROR,
        `cannot assign to class name '${prev.value}'`,
        `Use a different identifier for variables`,
      )
    }
    content.push({ type: 'sign', value: '=' })
    return true
  }

  if (type === ',') {
    content.push({ type: 'sign', value: ',' })
    return true
  }

  if (type === ':') {
    if (scope.last === 'class') {
      content.push({ type: 'sign', value: '=' })
      return true
    }
    content.push({ type: 'sign', value: ':' })
    return true
  }

  return false
}

export default main
