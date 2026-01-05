import aliasFormatter from './alias.js'
import arrayFormatter from './array.js'
import booleanFormatter from './boolean.js'
import bracketFormatter from './bracket.js'
import classFormatter from './class.js'
import commentFormatter from './comment.js'
import doFormatter from './do.js'
import forFormatter from './for.js'
import forbiddenFormatter from './forbidden.js'
import functionFormatter from './function.js'
import identifierFormatter from './identifier.js'
import ifFormatter from './if.js'
import indentFormatter from './indent.js'
import moduleFormatter from './module.js'
import nativeFormatter from './native.js'
import newLineFormatter from './new-line.js'
import nilFormatter from './nil.js'
import numberFormatter from './number.js'
import objectFormatter from './object.js'
import operatorFormatter from './operator.js'
import propertyFormatter from './property.js'
import signFormatter from './sign.js'
import statementFormatter from './statement.js'
import stringFormatter from './string.js'
import switchFormatter from './switch.js'
import tryFormatter from './try.js'
import whileFormatter from './while.js'

import type { Context } from '../types'

type Formatter = (ctx: Context) => boolean

const formattersMap = {
  'new-line': newLineFormatter,
  alias: aliasFormatter,
  array: arrayFormatter,
  boolean: booleanFormatter,
  bracket: bracketFormatter,
  class: classFormatter,
  comment: commentFormatter,
  do: doFormatter,
  for: forFormatter,
  forbidden: forbiddenFormatter,
  function: functionFormatter,
  if: ifFormatter,
  indent: indentFormatter,
  // NOTE: previously misspelled as 'indentifier'; corrected to 'identifier'
  identifier: identifierFormatter,
  module: moduleFormatter,
  native: nativeFormatter,
  nil: nilFormatter,
  number: numberFormatter,
  object: objectFormatter,
  operator: operatorFormatter,
  property: propertyFormatter,
  sign: signFormatter,
  statement: statementFormatter,
  string: stringFormatter,
  switch: switchFormatter,
  try: tryFormatter,
  while: whileFormatter,
} as const satisfies Record<string, Formatter>

const formatterOrder = [
  'new-line',
  'alias',
  'array',
  'boolean',
  'bracket',
  'class',
  'do',
  'for',
  'forbidden',
  'function',
  'if',
  'indent',
  'identifier',
  'module',
  'native',
  'nil',
  'number',
  'object',
  'operator',
  'property',
  'sign',
  'statement',
  'string',
  'switch',
  'try',
  'while',
] as const

/** Apply formatters to transform context */
const processFormatters = (context: Context) => {
  for (const key of formatterOrder) {
    if (formattersMap[key](context)) break
  }

  formattersMap.comment(context)
}

export default processFormatters
