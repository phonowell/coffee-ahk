import $array from './array'
import $buildIn from './build-in'
import $for from './for'
import $function from './function'
import $object from './object'
import $type from './type'
import $variable from './variable'

// interface

import { Context } from '../entry/type'

// variable

const map = {
  array: $array,
  for: $for,
  object: $object,
  variable: $variable,
} as const

// function

const main = (
  ctx: Context
): void => {

  for (const key of Object.keys(map)) map[key](ctx)

  $buildIn(ctx)
  $function(ctx)

  if (ctx.option.checkType) $type(ctx)
}

// export
export default main