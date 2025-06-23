import { next } from './anonymous/next.js'
import { transFunc } from './anonymous/trans-func.js'

import type { Context } from '../../types'

const main = (ctx: Context) => {
  next(ctx)
  transFunc(ctx)
}

export default main
