import type Scope from '../../../models/Scope.js'
import type { Context } from '../../../types'

export const findFnStart = (ctx: Context, i: number): [number, Scope] => {
  const { content } = ctx
  const item = content.at(i)

  if (!(item?.is('edge', 'block-start') && item.scope.at(-1) === 'function'))
    return findFnStart(ctx, i + 1)

  return [i, item.scope]
}
