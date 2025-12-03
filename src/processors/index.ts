import arrayProcessor from './array/index.js'
import builtInLoaderProcessor from './build-in-loader.js'
import chainedCompareProcessor from './chained-compare.js'
import classProcessor from './class/index.js'
import forProcessor from './for.js'
import functionProcessor from './function/index.js'
import ifExpressionProcessor from './if-expression.js'
import instanceofProcessor from './instanceof.js'
import logicalOrProcessor from './logical-or.js'
import newLineProcessor from './new-line.js'
import objectProcessor from './object.js'
import typeofProcessor from './typeof.js'
import variableProcessor from './variable/index.js'
import validate from './variable/validate.js'

import type { Context } from '../types'

/** Process AST transformations */
const processAst = (context: Context) => {
  newLineProcessor(context) // have to be first

  // Run validation early before destructuring transformations
  validate(context)

  forProcessor(context)
  arrayProcessor(context)
  objectProcessor(context)
  logicalOrProcessor(context) // convert || to ternary for default values
  ifExpressionProcessor(context) // convert if-then-else to ternary
  chainedCompareProcessor(context) // expand 1<y<10 → 1<y && y<10
  typeofProcessor(context) // before variable to handle typeof identifiers
  instanceofProcessor(context) // convert class name to string
  variableProcessor(context)

  builtInLoaderProcessor(context)
  classProcessor(context)
  functionProcessor(context)
}

export default processAst
