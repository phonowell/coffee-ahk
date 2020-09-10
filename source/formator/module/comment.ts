import _ from 'lodash'
import { insertIndent } from '../toolkit'

// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { listResult, raw } = ctx

  if (raw.comments) {
    const listComment = _.trim(
      raw.comments[0].content, '\n '
    ).split('\n')
    for (const comment of listComment)
      listResult.push(
        '\n' + insertIndent(ctx),
        `; ${comment}`
      )
    return true
  }

  return false
}

// export
export default main