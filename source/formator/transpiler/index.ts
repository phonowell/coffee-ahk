import $alias from './alias'
import $array from './array'
import $boolean from './boolean'
import $bracket from './bracket'
import $class from './class'
import $comment from './comment'
import $for from './for'
import $forbidden from './forbidden'
import $function from './function'
import $if from './if'
import $indent from './indent'
import $indentifier from './identifier'
import $key from './key'
import $newLine from './new-line'
import $number from './number'
import $object from './object'
import $operator from './operator'
import $origin from './origin'
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
  boolean: $boolean,
  bracket: $bracket,
  class: $class,
  comment: $comment,
  for: $for,
  forbidden: $forbidden,
  function: $function,
  if: $if,
  indent: $indent,
  indentifier: $indentifier,
  key: $key,
  number: $number,
  object: $object,
  operator: $operator,
  origin: $origin,
  punctuation: $punctuation,
  string: $string,
  while: $while
} as const

// function

function main(
  ctx: Context
): void {

  for (const key of Object.keys(map)) {
    if (key === 'comment') continue
    if (map[key](ctx)) break
  }

  map.comment(ctx)
}

// export
export default main