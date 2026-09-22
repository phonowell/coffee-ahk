import { createTranspileError, ErrorType } from '../../../utils/error.js'

import type Scope from '../../../models/Scope.js'
import type { Context } from '../../../types/index.js'

export const findFnStart = (ctx: Context, i: number): [number, Scope] => {
  const { content } = ctx

  // The function body of THIS parameter list lives one scope level up:
  // params sit in [...outer, 'parameter'], the body block in [...outer, 'function']
  const paramScope = content.at(i)?.scope.toArray() ?? []
  const expected = [...paramScope.slice(0, -1), 'function' as const]

  for (let j = i; j < content.length; j++) {
    const item = content.at(j)
    if (!item) break
    if (item.is('edge', 'block-start') && item.scope.isEqual(expected)) {
      return [j, item.scope]
    }
  }

  throw createTranspileError(
    ErrorType.SYNTAX_ERROR,
    `missing function block-start after parameter list`,
    `Ensure the function has a body block`,
  )
}
