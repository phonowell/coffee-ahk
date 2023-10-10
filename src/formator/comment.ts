import trim from 'lodash/trim'

import { Context } from '../types'

// function

const main = (ctx: Context): boolean => {
  const { content, token } = ctx

  if (token.comments) {
    const listComment: string[] = []
    token.comments.forEach(comment =>
      trim(comment.content, '\n ')
        .split('\n')
        .forEach(comm => listComment.push(comm)),
    )

    const { last } = content
    last.comment = listComment
    return true
  }

  return false
}

// export
export default main
