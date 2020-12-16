import $array from './array'
import $function from './function'
import $object from './object'
import $type from './type'
import $variable from './variable'

// interface

import { Context } from '../type'

// variable

const map = {
  array: $array,
  function: $function,
  object: $object,
  variable: $variable
} as const

// function

function main(
  ctx: Context
): void {

  for (const key of Object.keys(map))
    map[key](ctx)

  if (ctx.option.checkType)
    $type(ctx)
}

// export
export default main