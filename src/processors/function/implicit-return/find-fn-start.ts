import { ErrorType, TranspileError } from '../../../utils/error.js'

import type Scope from '../../../models/Scope.js'
import type { Context } from '../../../types/index.js'

export const findFnStart = (ctx: Context, i: number): [number, Scope] => {
  const { content } = ctx

  for (let j = i; j < content.length; j++) {
    const item = content.at(j)
    if (!item) break
    if (item.is('edge', 'block-start') && item.scope.at(-1) === 'function') {
      return [j, item.scope]
    }
  }

  throw new TranspileError(
    ctx,
    ErrorType.SYNTAX_ERROR,
    `missing function block-start after parameter list`,
    `Ensure the function has a body block`,
  )
}
