import $function from './function'
import $variable from './variable'

// interface

import { Context } from '../type'

// variable

const map = {
  function: $function,
  variable: $variable
} as const

// function

function main(
  name: keyof typeof map,
  ctx: Context
): void {

  map[name](ctx)
}

// export
export default main