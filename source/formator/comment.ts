import $trim from 'lodash/trim'
import { Context } from '../entry/type'

// function

const main = (ctx: Context): boolean => {
  const { content, raw } = ctx

  if (raw.comments) {
    const listComment: string[] = []
    raw.comments.forEach(comment =>
      $trim(comment.content, '\n ')
        .split('\n')
        .forEach(comm => listComment.push(comm))
    )

    content.last.comment = listComment
    return true
  }

  return false
}

// export
export default main
