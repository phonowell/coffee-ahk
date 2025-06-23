import type { Context } from '../../../types'

export const renameConstructor = (ctx: Context) => {
  const { content } = ctx
  content.list.forEach((it) => {
    if (!it.is('property', 'constructor')) return
    it.value = '__New'
  })
}
