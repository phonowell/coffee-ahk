import processAnonymousFunctions from './anonymous.js'
import processClassMethods from './class.js'
import injectFunctionContext from './context.js'
import countFunctions from './count.js'
import processDoStatements from './do.js'
import injectImplicitParameters from './implicit-parameter.js'
import injectImplicitReturns from './implicit-return.js'
import markFunctions from './mark.js'
import transformParameters from './parameter.js'

import type { Context } from '../../types'

/** Process function-related transformations */
const functionProcessor = (context: Context) => {
  // mark function
  // change its type from `fn: identifier(...)`
  // to `fn: function(...)`
  markFunctions(context)

  processClassMethods(context)

  injectImplicitParameters(context)
  injectImplicitReturns(context)

  // replace ctx in parameter
  // from `fn(a = a)` to `fn(a)`
  injectFunctionContext(context)

  // anonymous
  processAnonymousFunctions(context)
  const functionSet = countFunctions(context)

  transformParameters(context, functionSet)

  processDoStatements(context)
}

export default functionProcessor
