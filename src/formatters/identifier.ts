import type { Context } from '../types'

/** Format identifier tokens */
const identifierFormatter = (context: Context): boolean => {
  const { content, token, type, value } = context
  const line = token[2].first_line + 1

  // 收集 class 名称与检测冲突和命名规范
  if (type === 'identifier') {
    const prev = content.at(-1)
    if (prev?.type === 'class') {
      // 检查首字母是否为大写字母
      if (!/^[A-Z]/.test(value)) {
        throw new Error(
          `ahk/class-case (line ${line}): class name '${value}' must start with an uppercase letter.`,
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
