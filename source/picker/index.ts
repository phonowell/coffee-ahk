import partArray from './array'
import partBuildIn from './build-in'
import partFor from './for'
import partFunction from './function'
import partObject from './object'
import partType from './type'
import partVariable from './variable'

// interface

import { Context } from '../entry/type'

// variable

const map = {
  array: partArray,
  for: partFor,
  object: partObject,
  variable: partVariable,
} as const

// function

const main = (ctx: Context): void => {
  for (const key of Object.keys(map)) map[key](ctx)

  partBuildIn(ctx)
  partFunction(ctx)

  if (ctx.option.checkType) partType(ctx)
}

// export
export default main
