import { ErrorType, TranspileError } from '../utils/error.js'

import type { Context } from '../types'

const main = (ctx: Context): boolean => {
  const { content, type, value } = ctx

  if (type === 'number') {
    let value2 = value

    if (value.includes('n')) {
      throw new TranspileError(
        ctx,
        ErrorType.UNSUPPORTED,
        `BigInt literal '${value}' is not supported in AHK v1`,
        `Use standard number type or string representation`,
      )
    }

    if (value.includes('_')) value2 = value2.replace(/_/g, '')

    if (value.includes('e')) {
      const parts = value2.split('e')
      const pre = parts.at(0)
      const sub = parts.at(1)
      if (pre && sub) value2 = `${pre}${'0'.repeat(parseInt(sub, 10))}`
    }

    content.push({ type: 'number', value: value2 })
    return true
  }

  return false
}

export default main
