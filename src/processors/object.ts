// Main object picker orchestrator
import { deconstruct } from './object/deconstruct.js'
import { transformObjectShorthand } from './object/shorthand.js'

import type { Context } from '../types/index.js'

const main = (ctx: Context) => {
  // deconstruction
  deconstruct(ctx)
  transformObjectShorthand(ctx)
}

export default main
