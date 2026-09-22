import { ErrorType, TranspileError } from '../utils/error.js'

import type { Context } from '../types/index.js'

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

    // Scientific notation: expand to plain decimal (AHK v1 literal-safe).
    // Guarded by regex so hex like 0x1e5 is not mistaken for an exponent.
    if (/^\d*\.?\d+[eE][+-]?\d+$/.test(value2)) {
      const num = Number(value2)
      if (!Number.isFinite(num)) {
        throw new TranspileError(
          ctx,
          ErrorType.UNSUPPORTED,
          `number literal '${value}' exceeds representable range`,
          `Use a smaller value or string representation`,
        )
      }
      value2 = String(num)
    }

    content.push({ type: 'number', value: value2 })
    return true
  }

  return false
}

export default main
