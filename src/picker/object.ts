// Main object picker orchestrator
import { deconstruct } from './object/deconstruct.js'
import { reverseDeconstruct } from './object/reverse-destructure.js'
import { deconstruct2 } from './object/shorthand.js'

import type { Context } from '../types'

const main = (ctx: Context) => {
  // deconstruction
  deconstruct(ctx)
  deconstruct2(ctx)
  reverseDeconstruct(ctx)
}

export default main
