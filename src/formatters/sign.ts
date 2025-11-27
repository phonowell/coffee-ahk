import type { Context } from '../types'

const main = (ctx: Context): boolean => {
  const { content, scope, token, type } = ctx
  const line = token[2].first_line + 1

  if (type === '...') {
    if (!['call', 'parameter'].includes(scope.last)) {
      throw new Error(
        `ahk/forbidden (line ${line}): spread operator '...' is only allowed in function calls or parameter lists. Context: ${scope.last}`,
      )
    }
    content.push({ type: 'sign', value: '...' })
  }

  if (type === '=') {
    // 检查左值是否与 class 名冲突
    const prev = content.at(-1)
    if (prev?.type === 'identifier' && ctx.cache.classNames.has(prev.value)) {
      throw new Error(
        `ahk/class-case (line ${line}): cannot assign to class name '${prev.value}'. Please use a different identifier for variables.`,
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
