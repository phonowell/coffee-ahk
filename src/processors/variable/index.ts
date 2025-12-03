import boostGlobal from './boost-global.js'
import translateError from './translate-error.js'

import type { Context } from '../../types'

const main = (ctx: Context) => {
  // Note: validation is now run early in processors/index.ts
  // before destructuring transformations

  // global
  boostGlobal(ctx)

  // new Error -> Exception
  translateError(ctx)
}

export default main
