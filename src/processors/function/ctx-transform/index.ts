/**
 * Context Transform Processor
 *
 * Transforms variable access to use λ (lambda) object for proper closure semantics.
 * Inner functions can read AND modify outer function variables via shared λ.
 * Using λ (U+03BB) as it semantically represents closures and saves 6 chars vs __ctx__.
 */
import { addBind } from './bind.js'
import { collectParams } from './params.js'
import { transformFunctions } from './transform-functions.js'
import { transformVars } from './transform-vars.js'

import type { Context } from '../../../types'

/** Main processor */
const main = (ctx: Context) => {
  const paramsInfo = collectParams(ctx)
  const skip = transformFunctions(ctx, paramsInfo)
  transformVars(ctx, skip)
  addBind(ctx, paramsInfo)
}

export default main
