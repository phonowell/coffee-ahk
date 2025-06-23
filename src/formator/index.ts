import partAlias from './alias.js'
import partArray from './array.js'
import partAsync from './async.js'
import partAwait from './await.js'
import partBoolean from './boolean.js'
import partBracket from './bracket.js'
import partClass from './class.js'
import partComment from './comment.js'
import partDo from './do.js'
import partFor from './for.js'
import partForbidden from './forbidden.js'
import partFunction from './function.js'
import partIndentifier from './identifier.js'
import partIf from './if.js'
import partIndent from './indent.js'
import partModule from './module.js'
import partNative from './native.js'
import partNewLine from './new-line.js'
import partNil from './nil.js'
import partNumber from './number.js'
import partObject from './object.js'
import partOperator from './operator.js'
import partProperty from './property.js'
import partSign from './sign.js'
import partStatement from './statement.js'
import partString from './string.js'
import partSwitch from './switch.js'
import partTry from './try.js'
import partWhile from './while.js'

import type { Context } from '../types'

const map: Record<string, (ctx: Context) => boolean> = {
  'new-line': partNewLine,
  alias: partAlias,
  array: partArray,
  async: partAsync,
  await: partAwait,
  boolean: partBoolean,
  bracket: partBracket,
  class: partClass,
  comment: partComment,
  do: partDo,
  for: partFor,
  forbidden: partForbidden,
  function: partFunction,
  if: partIf,
  indent: partIndent,
  indentifier: partIndentifier,
  module: partModule,
  native: partNative,
  nil: partNil,
  number: partNumber,
  object: partObject,
  operator: partOperator,
  property: partProperty,
  sign: partSign,
  statement: partStatement,
  string: partString,
  switch: partSwitch,
  try: partTry,
  while: partWhile,
} as const

const main = (ctx: Context) => {
  for (const key of Object.keys(map)) {
    if (key === 'comment') continue
    if (map[key](ctx)) break
  }

  map.comment(ctx)
}

export default main
