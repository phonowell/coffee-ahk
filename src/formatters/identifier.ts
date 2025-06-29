import type { Context } from '../types'

/** Format identifier tokens */
const identifierFormatter = (context: Context): boolean => {
  const { content, type, value } = context

  // 收集 class 名称与检测冲突和命名规范
  if (type === 'identifier') {
    const prev = content.last
    if (prev.type === 'class') {
      // 检查首字母是否为大写字母
      if (!/^[A-Z]/.test(value)) {
        throw new Error(
          `ahk/class-case: class name '${value}' must start with an uppercase letter.`,
        )
      }

      // 检查是否与已有变量/函数/参数冲突
      if (context.cache.identifiers.has(value)) {
        throw new Error(
          `ahk/class-case: class name '${value}' conflicts with variable/function/parameter of the same name. Please rename to avoid ambiguity.`,
        )
      }

      context.cache.classNames.add(value)
      content.push('identifier', value)
      return true
    }

    context.cache.identifiers.add(value)
    content.push('identifier', value)
    return true
  }

  return false
}

export default identifierFormatter
