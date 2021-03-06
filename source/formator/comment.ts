import { Context } from '../entry/type'
import _ from 'lodash'

// function

const main = (
  ctx: Context,
): boolean => {

  const { content, raw } = ctx

  if (raw.comments) {

    const listComment: string[] = []
    for (const comment of raw.comments) {
      _.trim(
        comment.content, '\n '
      )
        .split('\n')
        .forEach(comm => listComment.push(comm))
    }

    content.last.comment = listComment
    return true
  }

  return false
}

// export
export default main