// Main object picker orchestrator
import { deconstruct } from './object/deconstruct.js'
import { reverseDeconstruct } from './object/reverse-destructure.js'
import { transformObjectShorthand } from './object/shorthand.js'

import type { Context } from '../types'

const main = (ctx: Context) => {
  // deconstruction
  deconstruct(ctx)
  transformObjectShorthand(ctx)
  reverseDeconstruct(ctx)
}

export default main
