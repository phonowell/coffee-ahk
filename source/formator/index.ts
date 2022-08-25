import partAlias from './alias'
import partArray from './array'
import partAwait from './await'
import partBoolean from './boolean'
import partBracket from './bracket'
import partClass from './class'
import partComment from './comment'
import partDo from './do'
import partFor from './for'
import partForbidden from './forbidden'
import partFunction from './function'
import partIf from './if'
import partIndent from './indent'
import partIndentifier from './identifier'
import partModule from './module'
import partNewLine from './new-line'
import partNil from './nil'
import partNumber from './number'
import partObject from './object'
import partOperator from './operator'
import partOrigin from './origin'
import partProperty from './property'
import partSign from './sign'
import partStatement from './statement'
import partString from './string'
import partSwitch from './switch'
import partTry from './try'
import partWhile from './while'

// interface

import { Context } from '../entry/type'

// variable

const map = {
  'new-line': partNewLine,
  alias: partAlias,
  array: partArray,
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
  nil: partNil,
  number: partNumber,
  object: partObject,
  operator: partOperator,
  origin: partOrigin,
  property: partProperty,
  sign: partSign,
  statement: partStatement,
  string: partString,
  switch: partSwitch,
  try: partTry,
  while: partWhile,
} as const

// function

const main = (ctx: Context): void => {
  for (const key of Object.keys(map)) {
    if (key === 'comment') continue
    if (map[key](ctx)) break
  }

  map.comment(ctx)
}

// export
export default main
