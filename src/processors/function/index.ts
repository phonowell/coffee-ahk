import processAnonymousFunctions from './anonymous.js'
import processClassMethods from './class.js'
import countFunctions from './count.js'
import ctxTransform from './ctx-transform.js'
import processDoStatements from './do.js'
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

  // implicit returns (keep this, it's separate from ctx handling)
  injectImplicitReturns(context)

  // anonymous function extraction
  processAnonymousFunctions(context)
  const functionSet = countFunctions(context)

  transformParameters(context, functionSet)

  processDoStatements(context)

  // ctx transform: convert variable access to λ.xxx for closure semantics
  ctxTransform(context)
}

export default functionProcessor
