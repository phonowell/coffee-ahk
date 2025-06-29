// Comment injection functionality
import { trim } from 'radash'

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

  const { it } = ctx
  if (!cacheComment.length) return input
  if (it.type !== 'new-line') return input

  const _prev = ctx.content.last
  const seprator = _prev.type !== 'new-line' && _prev.value ? ' ; ' : '; '

  const newLine = newLine2(ctx)

  const output = `${seprator}${cacheComment
    .map((line) => trim(line, ' #;'))
    .join('; ')}${newLine}`
  cacheComment = []
  return output
}
