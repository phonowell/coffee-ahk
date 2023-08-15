import { Context } from '../../types'

import boostGlobal from './boost-global'
import translateError from './translate-error'
import validate from './validate'

// function

const main = (ctx: Context): void => {
  validate(ctx)

  // global
  boostGlobal(ctx)

  // new Error -> Exception
  translateError(ctx)
}

// export
export default main
