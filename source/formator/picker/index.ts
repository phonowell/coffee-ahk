import $array from './array'
import $function from './function'
import $variable from './variable'

// interface

import { Context } from '../type'

// variable

const map = {
  array: $array,
  function: $function,
  variable: $variable
} as const

// function

function main(
  ctx: Context
): void {

  for (const key of Object.keys(map))
    map[key](ctx)
}

// export
export default main