import $alias from './alias'
import $array from './array'
import $boolean from './boolean'
import $bracket from './bracket'
import $class from './class'
import $comment from './comment'
import $do from './do'
import $for from './for'
import $forbidden from './forbidden'
import $function from './function'
import $if from './if'
import $indent from './indent'
import $indentifier from './identifier'
import $module from './module'
import $newLine from './new-line'
import $number from './number'
import $object from './object'
import $operator from './operator'
import $origin from './origin'
import $property from './property'
import $sign from './sign'
import $statement from './statement'
import $string from './string'
import $switch from './switch'
import $try from './try'
import $while from './while'

// interface

import { Context } from '../type'

// variable

const map = {
  alias: $alias,
  array: $array,
  boolean: $boolean,
  bracket: $bracket,
  class: $class,
  comment: $comment,
  do: $do,
  for: $for,
  forbidden: $forbidden,
  function: $function,
  if: $if,
  indent: $indent,
  indentifier: $indentifier,
  module: $module,
  'new-line': $newLine,
  number: $number,
  object: $object,
  operator: $operator,
  origin: $origin,
  property: $property,
  sign: $sign,
  statement: $statement,
  string: $string,
  switch: $switch,
  try: $try,
  while: $while,
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
