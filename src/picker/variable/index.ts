import boostGlobal from './boost-global.js'
import translateError from './translate-error.js'
import validate from './validate.js'

import type { Context } from '../../types'

const main = (ctx: Context) => {
  validate(ctx)

  // global
  boostGlobal(ctx)

  // new Error -> Exception
  translateError(ctx)
}

export default main
