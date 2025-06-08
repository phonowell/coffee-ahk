import { trim } from 'radash'

import type { Context } from '../types'

const main = (ctx: Context): boolean => {
  const { content, token } = ctx

  if (token.comments) {
    const listComment: string[] = []
    token.comments.forEach((comment) =>
      trim(comment.content, '\n ')
        .split('\n')
        .forEach((comm) => listComment.push(comm)),
    )

    const { last } = content
    last.comment = listComment
    return true
  }

  return false
}

export default main
