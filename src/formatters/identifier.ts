import { TranspileError } from '../utils/error.js'

import type { Context } from '../types'

/** Format identifier tokens */
const identifierFormatter = (context: Context): boolean => {
  const { content, type, value } = context

  // 收集 class 名称与检测冲突和命名规范
  if (type === 'identifier') {
    const prev = content.at(-1)
    if (prev?.type === 'class') {
      // 检查首字母是否为大写字母
      if (!/^[A-Z]/.test(value)) {
        throw new TranspileError(
          context,
          'class-case',
          `class name '${value}' must start with an uppercase letter.`,
        )
      }

      // 检查单字母类名（AHK v1 限制）
      if (value.length === 1) {
        throw new TranspileError(
          context,
          'class-single-letter',
          `class name '${value}' is a single letter, which is forbidden in AHK v1. Class names must be at least 2 characters.`,
        )
      }

      context.cache.classNames.add(value)
      content.push({ type: 'identifier', value })
      return true
    }

    context.cache.identifiers.add(value)
    content.push({ type: 'identifier', value })
    return true
  }

  return false
}

export default identifierFormatter
