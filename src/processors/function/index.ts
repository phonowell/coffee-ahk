import processAnonymousFunctions from './anonymous.js'
import processAwaitStatements from './await.js'
import processClassMethods from './class.js'
import injectFunctionContext from './context.js'
import countFunctions from './count.js'
import processDoStatements from './do.js'
import injectImplicitParameters from './implicit-parameter.js'
import injectImplicitReturns from './implicit-return.js'
import markFunctions from './mark.js'
import transformParameters from './parameter.js'
import processPromiseStatements from './promise.js'
import trackFunctionCalls from './track.js'

import type { Context } from '../../types'

/** Process function-related transformations */
const functionProcessor = (context: Context) => {
  processAwaitStatements(context)
  processPromiseStatements(context)

  // mark function
  // change its type from `fn: identifier(...)`
  // to `fn: function(...)`
  markFunctions(context)

  // list all functions
  let functionSet = countFunctions(context)

  processClassMethods(context)

  injectImplicitParameters(context)
  injectImplicitReturns(context)

  // replace ctx in parameter
  // from `fn(a = a)` to `fn(a)`
  injectFunctionContext(context)

  // anonymous
  if (context.options.anonymous && functionSet.has('anonymous')) {
    processAnonymousFunctions(context)
    functionSet = countFunctions(context) // re-count
  }

  transformParameters(context, functionSet)

  processDoStatements(context)

  if (context.options.track) trackFunctionCalls(context)
}

export default functionProcessor
