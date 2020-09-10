import _ from 'lodash'
import { insertIndent } from '../toolkit'

// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, raw } = ctx

  if (raw.comments) {
    const listComment = _.trim(
      raw.comments[0].content, '\n '
    ).split('\n')
    for (const comment of listComment)
      content
        .push('new-line', '\n' + insertIndent(ctx))
        .push('comment', `; ${comment}`)
    return true
  }

  return false
}

// export
export default main