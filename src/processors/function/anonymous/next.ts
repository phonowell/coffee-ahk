import { findLastIndex } from '../../../utils/arrayHelpers.js'

import { pickItem } from './pick-item.js'

import type { Context } from '../../../types'

export const next = (ctx: Context, count = 1) => {
  const { content } = ctx

  content.reload()
  const i = findLastIndex(content.toArray(), {
    type: 'function',
    value: 'anonymous',
  })
  if (!~i) return

  const it = content.at(i)
  if (!it) {
    throw new Error(
      `Coffee-AHK/internal: function/anonymous: missing anonymous function at expected index (content length: ${content.length})`,
    )
  }
  it.value = `${ctx.options.salt}_${count}`

  pickItem(ctx, count, i, [...it.scope.toArray(), 'function']).forEach(
    (item) => {
      if (item.type === 'void') return
      content.push(item)
    },
  )

  next(ctx, count + 1)
}
