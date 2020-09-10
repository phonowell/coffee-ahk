import _ from 'lodash'

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
        .push('new-line', ctx.indent)
        .push('comment', `; ${comment}`)
    return true
  }

  return false
}

// export
export default main