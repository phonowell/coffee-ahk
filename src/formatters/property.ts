import type { Context } from '../types'

const main = (ctx: Context): boolean => {
  const { content, type, value, scope, token } = ctx

  if (type === '.') {
    content.push({ type: '.', value: '.' })
    return true
  }

  if (type === 'index_start') {
    if (content.at(-1)?.type === '.') content.pop()
    content.push({ type: 'edge', value: 'index-start' })
    return true
  }

  if (type === 'index_end') {
    content.push({ type: 'edge', value: 'index-end' })
    return true
  }

  if (type === 'property') {
    const lastType = content.at(-1)?.type

    // Invalid: `this.prop` in constructor params → AHK can't handle it
    if (
      lastType === 'this' &&
      scope.includes('class') &&
      scope.includes('parameter')
    ) {
      const line = token[2].first_line + 1
      throw new Error(
        `Coffee-AHK/invalid-syntax (line ${line}): ` +
          `Using 'this.${value}' in constructor parameters creates invalid AHK syntax. ` +
          `AHK function parameters must be simple variable names, not property accesses. ` +
          `Solution: Use constructor: (name) -> @name = name instead.`,
      )
    }

    if (lastType && ['prototype', 'this'].includes(lastType))
      content.push({ type: '.', value: '.' })
    content.push({ type: 'property', value })
    return true
  }

  return false
}

export default main
