import changeIndex from './change-index'
import deconstruct from './deconstruct'

import type { Context } from '../../types'

const main = (ctx: Context) => {
  // list[0] -> list[1]
  changeIndex(ctx)

  // deconstruction
  // [a, b] = [1, 2]
  deconstruct(ctx)
}

export default main
