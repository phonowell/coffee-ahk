import type { Context } from '../../../types'

export const pickIndent = (ctx: Context, i: number): number => {
  const { content } = ctx
  const it = content.at(i)
  if (!it) return 0
  if (it.type === 'new-line') return parseInt(it.value, 10)
  return pickIndent(ctx, i - 1)
}
