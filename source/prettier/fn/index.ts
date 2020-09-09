import _ from 'lodash'

// interface

import { Context } from '../type'

// function

function insertIndent(
  env: Context
): string {
  return _.repeat(' ', env.indent * 2)
}

// export
export {
  insertIndent
}