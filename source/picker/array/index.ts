import { Context } from '../../entry/type'

import changeIndex from './change-index'
import deconstruct from './deconstruct'

// function

const main = (ctx: Context): void => {
  // list[0] -> list[1]
  changeIndex(ctx)

  // deconstruction
  // [a, b] = [1, 2]
  deconstruct(ctx)
}

// export
export default main
