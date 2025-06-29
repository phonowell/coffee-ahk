import type { Context } from '../types'

const main = (ctx: Context): boolean => {
  const { content, scope, type } = ctx

  if (type === '...') {
    if (!['call', 'parameter'].includes(scope.last)) {
      throw new Error(
        `ahk/forbidden: spread operator '...' is only allowed in function calls or parameter lists. Context: ${scope.last}`,
      )
    }
    content.push('sign', '...')
  }

  if (type === '=') {
    // 检查左值是否与 class 名冲突
    const prev = content.last
    if (prev.type === 'identifier' && ctx.cache.classNames.has(prev.value)) {
      throw new Error(
        `ahk/class-case: cannot assign to class name '${prev.value}'. Please use a different identifier for variables.`,
      )
    }
    content.push('sign', '=')
    return true
  }

  if (type === ',') {
    content.push('sign', ',')
    return true
  }

  if (type === ':') {
    if (scope.last === 'class') {
      content.push('sign', '=')
      return true
    }
    content.push('sign', ':')
    return true
  }

  return false
}

export default main
