import boostGlobal from './boost-global'
import translateError from './translate-error'
import validate from './validate'

import type { Context } from '../../types'

const main = (ctx: Context) => {
  validate(ctx)

  // global
  boostGlobal(ctx)

  // new Error -> Exception
  translateError(ctx)
}

export default main
