import { trim } from 'radash'

import type { CommentData, Context, TokenLocationData } from '../types'

const main = (ctx: Context): boolean => {
  const { content, token } = ctx

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
        trim(commentContent, '\n ')
          .split('\n')
          .forEach((comm) => listComment.push(prefix + comm))
      }
    })

    const { last } = content
    last.comment = listComment
    return true
  }

  return false
}

export default main
