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

import type { Context } from '../types/index.js'

type Formatter = (ctx: Context) => boolean

// Order matters: first formatter returning true consumes the token
const formatters = [
  newLineFormatter,
  aliasFormatter,
  arrayFormatter,
  booleanFormatter,
  bracketFormatter,
  classFormatter,
  doFormatter,
  forFormatter,
  forbiddenFormatter,
  functionFormatter,
  ifFormatter,
  indentFormatter,
  identifierFormatter,
  moduleFormatter,
  nativeFormatter,
  nilFormatter,
  numberFormatter,
  objectFormatter,
  operatorFormatter,
  propertyFormatter,
  signFormatter,
  statementFormatter,
  stringFormatter,
  switchFormatter,
  tryFormatter,
  whileFormatter,
] satisfies Formatter[]

/**
 * Apply formatters to transform context.
 * Returns true if a formatter consumed the token; false means the token
 * produced no output — reported by the caller so tokens never drop silently.
 */
const processFormatters = (context: Context): boolean => {
  let consumed = false
  for (const fmt of formatters) {
    if (fmt(context)) {
      consumed = true
      break
    }
  }

  commentFormatter(context)
  return consumed
}

export default processFormatters
