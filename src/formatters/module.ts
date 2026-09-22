import { ErrorType, TranspileError } from '../utils/error.js'

import type { Context } from '../types/index.js'

const main = (ctx: Context) => {
  const { type } = ctx

  // `export` is consumed by the include pipeline (file mode); a token reaching
  // the formatter means it slipped through (e.g. string input) — rendering a
  // literal `export` would emit invalid AHK silently
  if (type === 'export') {
    throw new TranspileError(
      ctx,
      ErrorType.UNSUPPORTED,
      `'export' is only supported in file-based modules`,
      `Import/export via file compilation, not string input`,
    )
  }

  return false
}

export default main
