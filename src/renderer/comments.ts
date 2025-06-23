// Comment injection functionality
import { newLine2 } from './basic.js'

import type Item from '../models/Item.js'
import type { Context as Context2 } from '../types'

type Context = Context2 & {
  i: number
  it: Item
}

let cacheComment: string[] = []

export const getCacheComment = () => cacheComment
export const setCacheComment = (comments: string[]) => {
  cacheComment = comments
}

export const injectComment = (input: string, ctx: Context): string => {
  if (!ctx.options.comments) return input

  const { i, it } = ctx
  if (!cacheComment.length) return input
  if (it.type !== 'new-line') return input

  const _prev = ctx.content.at(i - 1)
  const seprator =
    _prev && _prev.type !== 'new-line' && _prev.value ? ' ; ' : '; '

  const newLine = newLine2(ctx)

  const output = `${seprator}${cacheComment.join(' ')}${newLine}`
  cacheComment = []
  return output
}
