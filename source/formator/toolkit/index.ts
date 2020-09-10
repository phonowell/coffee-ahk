import _ from 'lodash'

// interface

import { Context } from '../type'

// function

function insertIndent(
  ctx: Context,
  fix = 0
): string {
  return _.repeat(' ', (ctx.indent + fix) * 2)
}

// export
export {
  insertIndent
}