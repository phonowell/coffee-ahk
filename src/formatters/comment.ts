import { trim } from 'radash'

import type Content from '../models/Content.js'
import type { CommentData, Context, TokenLocationData } from '../types/index.js'

// Comments before the first emitted item have nothing to attach to yet;
// buffer them per Content and prepend to the first item once it exists
const pendingComments = new WeakMap<Content, string[]>()

const main = (ctx: Context): boolean => {
  const { content, token } = ctx

  const pending = pendingComments.get(content)
  if (pending?.length) {
    const first = content.at(0)
    if (first) {
      pendingComments.delete(content)
      first.comment = [...pending, ...(first.comment ?? [])]
    }
  }

  if (token.comments) {
    const listComment: string[] = []
    const tokenLocationData = token[2] as TokenLocationData | undefined
    const tokenLine = tokenLocationData?.first_line

    token.comments.forEach((comment: CommentData) => {
      const commentLine = comment.locationData?.first_line
      const isStandalone =
        typeof tokenLine === 'number' &&
        typeof commentLine === 'number' &&
        commentLine !== tokenLine

      const prefix = isStandalone ? 'STANDALONE:' : 'INLINE:'
      const commentContent = comment.content

      if (commentContent) {
        const trimmed = trim(commentContent, '\n ')
        trimmed.split('\n').forEach((comm) => listComment.push(prefix + comm))
      }
    })

    const last = content.at(-1)
    if (last) last.comment = [...(last.comment ?? []), ...listComment]
    else if (listComment.length) {
      pendingComments.set(content, [...(pendingComments.get(content) ?? []), ...listComment])
    }
    return true
  }

  return false
}

export default main
