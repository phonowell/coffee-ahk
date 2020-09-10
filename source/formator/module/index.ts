import $alias from './alias'
import $array from './array'
import $newLine from './new-line'
import $comment from './comment'
import $forbidden from './forbidden'
import $function from './function'
import $if from './if'
import $indent from './indent'
import $indentifier from './identifier'
import $key from './key'
import $number from './number'
import $object from './object'
import $operator from './operator'
import $punctuation from './punctuation'
import $string from './string'
import $while from './while'

// interface

import { Context } from '../type'

// variable

const map = {
  'new-line': $newLine,
  alias: $alias,
  array: $array,
  comment: $comment,
  forbidden: $forbidden,
  function: $function,
  if: $if,
  indent: $indent,
  indentifier: $indentifier,
  key: $key,
  number: $number,
  object: $object,
  operator: $operator,
  punctuation: $punctuation,
  string: $string,
  while: $while
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