import array from './array'
import comment from './comment'
import _function from './function'
import _if from './if'
import indent from './indent'
import indentifier from './identifier'
import number from './number'
import string from './string'

// interface

import { Context } from '../type'

// variable

const map = {
  array,
  comment,
  function: _function,
  if: _if,
  indent,
  indentifier,
  number,
  string
} as const

// function

function main(
  name: keyof typeof map,
  ctx: Context
): boolean {

  return map[name](ctx)
}

// export
export default main