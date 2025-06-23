import { findLastIndex } from '../../../utils/arrayHelpers.js'

import { pickItem } from './pick-item.js'

import type { Context } from '../../../types'

export const next = (ctx: Context, count = 1) => {
  const { content } = ctx

  content.reload()
  const i = findLastIndex(content.list, {
    type: 'function',
    value: 'anonymous',
  })
  if (!~i) return

  const it = content.at(i)
  if (!it) throw new Error('Unexpected error: picker/function/anonymous/1')
  it.value = `${ctx.options.salt}_${count}`

  pickItem(ctx, count, i, [...it.scope.list, 'function']).forEach((item) => {
    if (item.type === 'void') return
    content.push(item)
  })

  next(ctx, count + 1)
}
